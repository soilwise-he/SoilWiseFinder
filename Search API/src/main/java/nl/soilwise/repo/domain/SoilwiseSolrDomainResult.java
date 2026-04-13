package nl.soilwise.repo.domain;

import java.util.Map;

public class SoilwiseSolrDomainResult {
    public Map<String, Integer> getType() {
        return type;
    }

    public void setType(Map<String, Integer> type) {
        this.type = type;
    }

    Map<String, Integer> type;

}
