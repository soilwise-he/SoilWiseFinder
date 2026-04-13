package nl.soilwise.repo.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import nl.soilwise.repo.domain.*;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.apache.solr.client.solrj.util.ClientUtils;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ServiceSearch {
    private static final String RECORD_TYPES_FACET = "record_types";
    private ServiceSolr serviceSolr;


    private static final Set<String> ALLOWED_DATE_RANGE_FIELDS = Set.of("date", "temporal_range" );
    private static final Set<String> ALLOWED_STRING_MATCH_FIELDS = Set.of("soilmission");
    private static final Set<String> ALLOWED_ONE_OF_LIST_FIELDS = Set.of("type", "license", "sources","language", "matched_subjects", "project_acronyms");

    public ServiceSearch(@Autowired ServiceSolr serviceSolr) {
        this.serviceSolr = serviceSolr;
    }


    public String searchEdisMax(SearchInput input) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        String usedQuery = input.getQuery() == null || input.getQuery().isEmpty() ? "*" : input.getQuery();
        ObjectNode root = objectMapper.createObjectNode();
        root.put("query", usedQuery);
        ObjectNode params = root.putObject("params");
        params.put("defType", "edismax");
        params.put("df", "text_all");
        params.put("qf", "title^2 abstract");
        params.put("pf", "title^5 abstract^2");
        params.put("mm", "1");
        params.put("sort", buildSort(input.getSort()));
        params.put("rows", input.getPagesize());
        params.put("start", input.getOffset());
        ArrayNode fq = params.putArray("fq");
        List<String> filterStrings = buildFilter(input.getFilters());
        filterStrings.forEach(fq::add);

        params.put("hl", Boolean.TRUE);
        params.put("hl.fl", "title,abstract");
        params.put("hl.fragsize", 500);
        params.put("hl.tag.pre", "<em>");
        params.put("hl.tag.post", "</em>");
        return serviceSolr.searchSolrJson(root);
    }

    private static @NonNull String buildSort(SearchInputSortConfiguration sort) {
        SearchInputSortConfiguration usedSort = sort == null ? new SearchInputSortConfiguration() : sort;
        return ""+usedSort.getField().getSolrValue()+" "+usedSort.getOrder().getSolrValue();
    }

    private List<String> buildFilter(SearchInputFilters input) {
        if(input == null){
            return Collections.emptyList();
        }

        List<String> result = new ArrayList<>(); // These are all AND-ed with each other
        constructStringMatchesFilter(input.getSoilmission() == null ? null: input.getSoilmission().toString(), "soilmission").ifPresent(result::add);
        constructStringFilterFromList(input.getResource_types(), "type").ifPresent(result::add);
        constructStringFilterFromList(input.getLicense(), "license").ifPresent(result::add);
        constructStringFilterFromList(input.getMatched_subjects(),"matched_subjects" ).ifPresent(result::add);
        constructStringFilterFromList(input.getSources(),"sources" ).ifPresent(result::add);
        constructStringFilterFromList(input.getLanguages(),"language" ).ifPresent(result::add);
        constructStringFilterFromList(input.getProjects(), "project_acronyms").ifPresent(result::add);
        constructFromDateRangeInput(input.getDate(), "date", false).ifPresent(result::add);
        constructFromDateRangeInput(input.getTemporal_coverage(), "temporal_range", true).ifPresent(result::add);
        constructSpatialFilter(input.getSpatial_coverage()).ifPresent(result::add);
        return result;
    }

    private Optional<String> constructSpatialFilter(SpatialCoverageFilterInput spatialCoverage) {
        return Optional.empty();
    }

    private Optional<String> constructStringMatchesFilter(String value, String field){
        boolean fieldInvalid = !ALLOWED_STRING_MATCH_FIELDS.contains(field) || field == null;
        if(fieldInvalid){
            log.error("probably a programming error? {}", field);
        }
        if(fieldInvalid || value == null || value.isEmpty()){
            return Optional.empty();
        }
        return Optional.of(field+":"+ClientUtils.escapeQueryChars(value));
    }


    private Optional<String> constructStringFilterFromList(List<String> one_of_values, String field){
        if(!ALLOWED_ONE_OF_LIST_FIELDS.contains(field)){
            log.error("probably a programming error? {}", field);
            return Optional.empty();
        }
        if(one_of_values == null || one_of_values.isEmpty()){
            return Optional.empty();
        }
        return Optional.of(one_of_values.stream()
                .map(ClientUtils::escapeQueryChars)
                .collect(Collectors.joining(" OR ", field+":(", ")")));
    }

    private Optional<String> constructFromDateRangeInput(DateRangeFilterInput dateRangeFilterInput, String field, boolean asSolrDateRange){
        if(!ALLOWED_DATE_RANGE_FIELDS.contains(field)){
            log.error("probably a programming error? {}", field);
            return Optional.empty();
        }
        if(dateRangeFilterInput == null){
            return Optional.empty();
        }
        if(dateRangeFilterInput.getFrom() == null && dateRangeFilterInput.getTo() == null){
            return Optional.empty();
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        try{
            String fromString = dateRangeFilterInput.getFrom() == null ? "*" :
                    LocalDate.parse(dateRangeFilterInput.getFrom(), formatter)
                            .atStartOfDay(ZoneOffset.UTC)
                            .toInstant().toString();
            String toString = dateRangeFilterInput.getTo() == null ? "*" :
                    LocalDate.parse(dateRangeFilterInput.getTo(), formatter)
                            .plusDays(1).atStartOfDay(ZoneOffset.UTC)
                            .toInstant().toString();
            if(asSolrDateRange) {
                String query = "{!field f=".concat(field).concat(" op=Within}[").concat(fromString.concat(" TO ").concat(toString).concat("]"));
                return Optional.of(query);
            } else{
                String query = field+":["+fromString+" TO "+toString+"]";
                return Optional.of(query);
            }
        } catch (Exception e){
            return Optional.empty();
        }
    }

    public JsonNode detail(String identifier) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("query", "identifier:" + identifier);
        JsonNode jsonNode = serviceSolr.doSolrSelect(objectNode);
        return jsonNode != null ? jsonNode.findValue("docs") : null;
    }

    public SoilwiseSolrDomainResult getDomain() {

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode root = objectMapper.createObjectNode();
        root.put("query", "*:*");
        root.putObject("params").put("rows", 0);
        ObjectNode facet = root.putObject("facet");
        ObjectNode recordTypes = facet.putObject(RECORD_TYPES_FACET);
        recordTypes.put("type", "terms").put("field", "type");
        JsonNode result = serviceSolr.doSolrSelect(root);


        return facetQueryToDomainResult(result);

    }

    private SoilwiseSolrDomainResult facetQueryToDomainResult(JsonNode solrOutput) {
        if (solrOutput == null) {
            return null;
        }
        JsonNode recordTypeFacet = solrOutput.get("facets").get(RECORD_TYPES_FACET);
        Map<String, Integer> recordTypes = getFacetAsMap(recordTypeFacet);
        SoilwiseSolrDomainResult soilwiseSolrDomainResult = new SoilwiseSolrDomainResult();
        soilwiseSolrDomainResult.setType(recordTypes);
        return soilwiseSolrDomainResult;
    }

    private static @NonNull Map<String, Integer> getFacetAsMap(JsonNode recordTypeFacet) {
        Map<String, Integer> recordTypes = new HashMap<>();
        JsonNode jsonNode = recordTypeFacet.get("buckets");
        jsonNode.valueStream().forEach(node -> recordTypes.put(node.get("val").asText(), node.get("count").asInt()));
        return recordTypes;
    }
}
