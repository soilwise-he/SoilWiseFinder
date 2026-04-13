package nl.soilwise.repo.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import nl.soilwise.repo.domain.SearchInput;
import nl.soilwise.repo.domain.SoilwiseSolrDomainResult;
import nl.soilwise.repo.service.ServiceSearch;
import nl.soilwise.repo.service.ServiceSolrIngestion;
import org.apache.solr.client.solrj.util.ClientUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import nl.soilwise.repo.dto.Response;
import nl.soilwise.repo.service.ServiceRepo;
import nl.soilwise.repo.service.ServiceSolr;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

@Controller
@RequestMapping("/")
@Slf4j
public class ControllerRepo {

    private static final String API_TAG = "API";
    private static final String SOLR_TAG = "Solr";
    private static final String OTHERS_TAG = "Miscellaneous";

    private final ServiceRepo serviceRepo;
    private final ServiceSolr serviceSolr;

    private final AtomicBoolean reindexRunning = new AtomicBoolean(false);

    private final ServiceSolrIngestion serviceSolrIngestion;
    private final ServiceSearch serviceSearch;

    public ControllerRepo(ServiceRepo serviceRepo, ServiceSolr serviceSolr, ServiceSolrIngestion serviceSolrIngestion, ServiceSearch serviceSearch) {
        this.serviceRepo = serviceRepo;
        this.serviceSolr = serviceSolr;
        this.serviceSolrIngestion = serviceSolrIngestion;
        this.serviceSearch = serviceSearch;
    }


    @Operation(summary = "API search", tags = API_TAG,
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true,
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = Object.class),
                            examples = {
                                    @ExampleObject(name = "free text search", value = """
                                            {
                                                "query": "example query"
                                            }
                                            """),
                                    @ExampleObject(name = "all datasets", value = """
                                            {
                                            "selectedResourceTypes" : ["dataset"]
                                            }
                                            """),
                                    @ExampleObject(name = "all possible filters with example values", value = """
                                            {
                                              "query": "pollen",
                                              "filters": {
                                                "resource_types": [
                                                  "Article"
                                                ],
                                                "soilmission": true,
                                                "license": [
                                                  "CC-BY-SA"
                                                ],
                                                "matched_subjects": [
                                                  "blaa"
                                                ],
                                                "sources": [
                                                  "bla"
                                                ],
                                                "languages": [
                                                  "eng"
                                                ],
                                                "projects": [
                                                  "hutsefluts"
                                                ],
                                                "date": {
                                                  "from": "01-01-1950",
                                                  "to": "01-01-1950"
                                                },
                                                "temporal_coverage": {
                                                  "from": "01-01-1950",
                                                  "to": "01-01-1950"
                                                },
                                                "spatial_coverage": {
                                                  "wkt": "MOOIE WKT STRING",
                                                  "operation": "INTERSECTS OF WITHIN"
                                                }
                                              },
                                              "pagesize": 10,
                                              "offset": 10,
                                              "sort": {
                                                "field": "DATE",
                                                "order": "DESC"
                                              }
                                            }
                                            """)
                            }
                    )
            ))
    @PostMapping(path = "/api/search", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> apiSearch(@RequestBody SearchInput input) {
        try {
            return ResponseEntity.ok(serviceSearch.searchEdisMax(input));
        } catch (JsonProcessingException e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @Operation(summary = "API detail", tags = API_TAG, description = "Returns the details for the record with the given identifier")
    @GetMapping(path = "/api/detail" )
    public ResponseEntity<JsonNode> apiDetail(@RequestParam("identifier") String identifier) throws JsonProcessingException {
        String escapedIdentifier = ClientUtils.escapeQueryChars(identifier);
        log.info(identifier+" => "+escapedIdentifier);
        JsonNode docsNode = serviceSearch.detail(escapedIdentifier);
        //SOLR uses identifier as unique key, it will always return 1 or zero results
        if (docsNode != null && !docsNode.isEmpty() && docsNode.isArray() && docsNode.size() > 0) {
            JsonNode firstResult = docsNode.get(0);
            return ResponseEntity.ok(firstResult);
        }
        else
            return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get domain", tags = API_TAG, description = "returns the domain tables")
    @GetMapping(path = "/api/domain", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SoilwiseSolrDomainResult> apiDomain(){
        try{
            return ResponseEntity.ok(serviceSearch.getDomain());
        } catch (Exception e){
            return ResponseEntity.internalServerError().body(null);
        }
    }


    @Operation(summary = "'raw' solr search", description = "allows for finetuned queries", tags = SOLR_TAG,
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true,
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = Object.class),
                            examples = @ExampleObject(name = "Sample query",
                                    value = """
                                            {
                                              "query": "*:*"
                                            }
                                            """)
                    ))
    )
    @PostMapping(path = "/solr/search", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String solrSearch(@RequestBody JsonNode input) throws JsonProcessingException {
        String queryResponse = serviceSolr.searchSolrJson(input);
        return queryResponse;
    }


    @Operation(summary = "Solr Full Reindexation", tags = SOLR_TAG, description = "Throws away previous shadow index and recreates it. After recreation, the shadow index is swapped with the active index.")
    @PostMapping(path = "/solr/reindex")
    @ResponseBody
    public ResponseEntity<String> solrFullReindex(@Parameter(description = "Set to 'true' to enable mockup mode", example = "true") @RequestParam(required = false, defaultValue = "false") boolean mockup) {
        if (!reindexRunning.compareAndSet(false, true)) {
            return ResponseEntity.badRequest().body("Reindex already running");
        }
        try {
            serviceSolrIngestion.doFullReindex(mockup);
            return ResponseEntity.ok("Reindex started with mockup mode = " + mockup);
        } finally {
            reindexRunning.set(false);
        }
    }

    @Operation(summary = "Check the database connection by retrieving data from the database", description = "No authentication required", tags = OTHERS_TAG)
    @GetMapping(path = "/livenessProbe")
    @ResponseBody
    public Integer livenessProbe() {
        return serviceRepo.livenessProbe();
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(HttpServletRequest httpRequest, Exception e) {
//        log.warn("==> handleException # {} # {} # {}", httpRequest.getRequestURI(), e.getClass().getName(),
//                e.getMessage());

        log.error("oops", e);

        if (httpRequest.getRequestURI().endsWith("/favicon.ico")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Not Found");
        }

        return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new Response(null, null, e.getClass().getName() + " " + e.getMessage()));
    }
}
