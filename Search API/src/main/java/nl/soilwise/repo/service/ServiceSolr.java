package nl.soilwise.repo.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import nl.soilwise.repo.controller.SolrQueryRequest;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Service
public class ServiceSolr {
    private final ObjectMapper objectMapper;
    private @Value("${repo.solr.url}") String solrUrl;
    private @Value("${repo.solr.collection_v2_active}") String active_core;

    private RestTemplate solrRestTemplate;

    public ServiceSolr( @Autowired RestTemplate solrRestTemplate, @Autowired ObjectMapper objectMapper) {
        this.solrRestTemplate = solrRestTemplate;
        this.objectMapper = objectMapper;
    }

    public String searchSolrJson(JsonNode solrJsonParams) throws JsonProcessingException {
        JsonNode reponse = doSolrSelect(solrJsonParams, "select");

        return objectMapper.writeValueAsString(reponse);
    }

    public @Nullable JsonNode doSolrSelect(JsonNode solrJsonParams, String method) {
        String url = UriComponentsBuilder
                .fromUriString(solrUrl)
                .pathSegment(active_core, method)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<JsonNode> request = new HttpEntity<>(solrJsonParams, headers);
        JsonNode reponse = solrRestTemplate.postForObject(url, request, JsonNode.class);
        return reponse;
    }

    public String querySolrUrl(SolrQueryRequest input) {
        UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder
                .fromUriString(solrUrl)
                .pathSegment(active_core, input.getMethod());
        for(var params : input.getParameters().entrySet()) {
            uriComponentsBuilder.queryParam(params.getKey(), params.getValue());
        }
        String url = uriComponentsBuilder.toUriString();

        return solrRestTemplate.getForObject(url, String.class);
    }
}
