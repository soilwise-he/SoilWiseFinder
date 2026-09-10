package nl.soilwise.repo.controller;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import jakarta.validation.constraints.NotNull;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class SolrQueryRequest {
    private static final Set<String> ALLOWED_METHODS = Set.of("suggest", "terms", "mlt");

    private final Map<String, Object> parameters;

    @NotNull
    private String method;


    public SolrQueryRequest() {
        this.parameters = new HashMap<>();
    }

    public Map<String, Object> getParameters() {
        return parameters;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        if (!ALLOWED_METHODS.contains(method)) {
            throw new IllegalArgumentException("Method not allowed");
        }
        this.method = method;
    }

    @JsonAnySetter
    public void addParameter(String key, Object value) {
        parameters.put(key, value);
    }

}
