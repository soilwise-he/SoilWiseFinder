package nl.soilwise.repo;

import java.util.*;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import nl.soilwise.repo.service.SolrViewRepository;
import org.apache.solr.common.SolrInputDocument;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@Slf4j
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SolrViewRepositoryIntegrationTest {


    enum MappingToSolrAcceptanceCriteria {

        TYPE(List.of("type","fluutse")),
        CONTACTS(List.of("contact_persons", "contact_organizations", "view_contacts")),
        SOURCE(List.of("sources")),
        LANGUAGE(List.of("language")),
        CREATION_DATE(List.of("date_creation")),
        REVISION_DATE(List.of("date_revision")),
        DATE(List.of("date")),
        PROJECT(List.of("projects", "project_acronyms")),
        SUBJECTS(List.of("subjects")),
        MATCHED_SUBJECTS(List.of("matched_subjects"));
        private final List<String> associatedFieldsInSolr;

        MappingToSolrAcceptanceCriteria(List<String> associatedFieldsInSolrInputDocument) {
            this.associatedFieldsInSolr = associatedFieldsInSolrInputDocument;
        }
    }

    @Autowired
    private SolrViewRepository viewRepository;

    @Test
    public void validateAcceptanceCriteria() {
        Set<String> allUniqueSolrFieldNames = new HashSet<>();
        List<SolrInputDocument> solrInputDocuments = viewRepository.getSolrInputDocuments(true);
        for (var inputDoc : solrInputDocuments) {
            allUniqueSolrFieldNames.addAll(inputDoc.getFieldNames());
        }
        int a = 12;
        List<String> errormessages = new ArrayList<>();
        for (var ac : MappingToSolrAcceptanceCriteria.values()) {
            for (String associatedField : ac.associatedFieldsInSolr) {
                if (!allUniqueSolrFieldNames.remove(associatedField)) {
                    errormessages.add(String.format("'%s'(%s) is not found in any Solr Document (or part of multiple acceptance criteria)", associatedField, ac));
                }
            }
        }
        //TODO: check why this fails
        if (!allUniqueSolrFieldNames.isEmpty()) {
            String error = allUniqueSolrFieldNames.stream().collect(Collectors.joining(", ", "[", "]")) + " are not part of any acceptance criteria";
            errormessages.add(error);
        }
        for (var i : errormessages) {
            log.error(i);
        }
        Assertions.assertTrue(errormessages.isEmpty());

    }

}
