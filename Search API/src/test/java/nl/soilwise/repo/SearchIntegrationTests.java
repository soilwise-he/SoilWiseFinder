package nl.soilwise.repo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import nl.soilwise.repo.domain.DateRangeFilterInput;
import nl.soilwise.repo.domain.SearchInput;
import nl.soilwise.repo.domain.SearchInputFilters;
import nl.soilwise.repo.domain.SearchInputSortConfiguration;
import nl.soilwise.repo.service.ServiceSearch;
import nl.soilwise.repo.service.ServiceSolrIngestion;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.EnabledIf;

import java.util.List;
import java.util.function.Consumer;
import java.util.function.Predicate;
import java.util.stream.StreamSupport;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@EnabledIf(expression = "#{environment['repo.solr.url'].startsWith('http://localhost:8983/solr')}", loadContext = true)
public class SearchIntegrationTests {

    enum FilterAcceptanceCriteria {
        TYPE(searchInputFilters -> searchInputFilters.setResource_types(List.of("Article")), jsonNode -> jsonNode.get("type").asText().equals("Article")),
        SOIL_MISSION(searchInput -> {
            searchInput.setSoilmission(true);
        }, jsonNode -> jsonNode.get("soilmission").asText().equals("true")),
        LICENSE(input -> input.setLicense(List.of("CC-BY-SA")), jsonNode -> jsonNode.get("license").asText().equals("CC-BY-SA")),
        MATCHED_SUBJECTS(input -> {
            input.setMatched_subjects(List.of("soil organic matter"));
        }, jsonNode -> jsonNode.get("matched_subjects").valueStream().anyMatch(node -> node.asText().equals("matched_subjects"))),
        SOURCE(input -> input.setSources(List.of("bonare")), jsonNode -> jsonNode.get("sources").valueStream().anyMatch(node -> node.asText().equals("bonare"))),
        LANGUAGE(input -> input.setLanguages(List.of("eng")), jsonNode -> jsonNode.get("language").asText().equals("eng")),
        PROJECTS(input -> {
            input.setProjects(List.of("ANTARES"));
        }, jsonNode -> testIfAnyProjectHasAcronym(jsonNode, "ANTARES")),
        DATE(input -> {
            DateRangeFilterInput date = new DateRangeFilterInput();
            date.setFrom("01-01-1950");
            date.setTo("01-01-1950");
            input.setDate(date);
        }, jsonNode -> false),
        TEMPORAL_COVERAGE(input -> {
            DateRangeFilterInput date = new DateRangeFilterInput();
            date.setFrom("01-01-1950");
            date.setTo("01-01-1950");
            input.setDate(date);

        }, jsonNode -> false);

        private final Predicate<JsonNode> evaluator;
        private SearchInput inputThatProvesThatFilterWorks;

        FilterAcceptanceCriteria(Consumer<SearchInputFilters> prepareSearchInput, Predicate<JsonNode> shouldBeTrueForAllDocs) {
            SearchInput searchInput = new SearchInput();
            searchInput.setFilters(new SearchInputFilters());
            prepareSearchInput.accept(searchInput.getFilters());
            this.inputThatProvesThatFilterWorks = searchInput;
            this.evaluator = shouldBeTrueForAllDocs;
        }

        private static boolean testIfAnyProjectHasAcronym(JsonNode jsonNode, String projectAcronym) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode1 = jsonNode.get("projects");
            if (jsonNode1 == null) return false;
            return StreamSupport.stream(jsonNode1.spliterator(), false)
                    .map(JsonNode::asText) // String like "[{...}]"
                    .flatMap(json -> {
                        try {
                            JsonNode array = mapper.readTree(json);
                            return StreamSupport.stream(array.spliterator(), false);
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    }).map(objNode -> objNode.get("acronym").asText())
                    .anyMatch(projectAcronym::equals);

        }
    }

    @Autowired
    private ServiceSolrIngestion ingestion;

    @Autowired
    private ServiceSearch serviceSearch;

    @BeforeAll
    public void reindexSolr() {
        ingestion.doFullReindex(true);
    }

    @Test
    public void testIfFieldFiltersWork() throws JsonProcessingException {
        for (var acceptanceCriteria : FilterAcceptanceCriteria.values()) {
            String response = serviceSearch.searchEdisMax(acceptanceCriteria.inputThatProvesThatFilterWorks);
            JsonNode docsNode = new ObjectMapper().readTree(response).get("response").get("docs");
            Assertions.assertTrue(docsNode.isArray());
            for (JsonNode doc : docsNode) {
                Assertions.assertNotNull(acceptanceCriteria.evaluator, acceptanceCriteria + " does not a valid evaluator");
                Assertions.assertTrue(acceptanceCriteria.evaluator.test(doc), acceptanceCriteria + " evaluator is not true for all results.");
            }

        }

    }

    @Test
    public void testIfSortingWorks() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        SearchInput input_date_asc = buildSearchInput(SearchInputSortConfiguration.SortFields.DATE, SearchInputSortConfiguration.Order.ASC);
        String result_date_asc = serviceSearch.searchEdisMax(input_date_asc);
        String first_identifier_date_asc = objectMapper.readTree(result_date_asc).get("response").get("docs").get(0).get("identifier").asText();
        SearchInput input_date_desc = buildSearchInput(SearchInputSortConfiguration.SortFields.DATE, SearchInputSortConfiguration.Order.DESC);
        String result_date_desc = serviceSearch.searchEdisMax(input_date_desc);
        String first_identifier_date_desc = objectMapper.readTree(result_date_desc).get("response").get("docs").get(0).get("identifier").asText();
        Assertions.assertNotEquals(first_identifier_date_asc, first_identifier_date_desc);

        SearchInput input_score_asc = buildSearchInput(SearchInputSortConfiguration.SortFields.SCORE, SearchInputSortConfiguration.Order.ASC);
        String result_score_asc = serviceSearch.searchEdisMax(input_score_asc);
        String first_identifier_score_asc = objectMapper.readTree(result_score_asc).get("response").get("docs").get(0).get("identifier").asText();
        SearchInput input_score_desc = buildSearchInput(SearchInputSortConfiguration.SortFields.SCORE, SearchInputSortConfiguration.Order.DESC);
        String result_score_desc = serviceSearch.searchEdisMax(input_score_desc);
        String first_identifier_score_desc = objectMapper.readTree(result_score_desc).get("response").get("docs").get(0).get("identifier").asText();
        Assertions.assertNotEquals(first_identifier_score_asc, first_identifier_score_desc);
    }

    private static @NonNull SearchInput buildSearchInput(SearchInputSortConfiguration.SortFields sortFields, SearchInputSortConfiguration.Order order) {
        SearchInput inputSortScore = new SearchInput();
        inputSortScore.setQuery("soil"); //This is here because it gives "score" something to score on.
        SearchInputSortConfiguration sortConfig = new SearchInputSortConfiguration();
        sortConfig.setField(sortFields);
        sortConfig.setOrder(order);
        inputSortScore.setSort(sortConfig);
        return inputSortScore;
    }


}
