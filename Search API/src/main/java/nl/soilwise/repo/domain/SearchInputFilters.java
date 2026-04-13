package nl.soilwise.repo.domain;


import java.util.List;

/*
{
                                                 "resource_types": [
                                                   "Article"
                                                 ],
                                                 "soilmission": true,
                                                 "license": ["CC-BY-SA"],
                                                 "matched_subjects": ["blaa"],
                                                 "sources": ["bla"],
                                                 "languages": ["eng"],
                                                 "projects": ["hutsefluts"],
                                                 "date": {"from":"01-01-1950", "to":"01-01-1950"},
                                                 "temporal_coverage": {"from":"01-01-1950", "to":"01-01-1950"},
                                                 "spatial_coverage": {
                                                   "wkt": "MOOIE WKT STRING",
                                                   "operation": "INTERSECTS OF WITHIN"
                                                 }
                                               }

 */
public class SearchInputFilters {
    private List<String> resource_types;
    private Boolean soilmission;
    private List<String> license;
    private List<String> matched_subjects;
    private List<String> sources;
    private List<String> languages;
    private List<String> projects;
    private DateRangeFilterInput date;
    private DateRangeFilterInput temporal_coverage;
    private SpatialCoverageFilterInput spatial_coverage;

    public List<String> getResource_types() {
        return resource_types;
    }

    public void setResource_types(List<String> resource_types) {
        this.resource_types = resource_types;
    }

    public Boolean getSoilmission() {
        return soilmission;
    }

    public void setSoilmission(Boolean soilmission) {
        this.soilmission = soilmission;
    }

    public List<String> getLicense() {
        return license;
    }

    public void setLicense(List<String> license) {
        this.license = license;
    }

    public List<String> getMatched_subjects() {
        return matched_subjects;
    }

    public void setMatched_subjects(List<String> matched_subjects) {
        this.matched_subjects = matched_subjects;
    }

    public List<String> getSources() {
        return sources;
    }

    public void setSources(List<String> sources) {
        this.sources = sources;
    }

    public List<String> getLanguages() {
        return languages;
    }

    public void setLanguages(List<String> languages) {
        this.languages = languages;
    }

    public List<String> getProjects() {
        return projects;
    }

    public void setProjects(List<String> projects) {
        this.projects = projects;
    }

    public DateRangeFilterInput getDate() {
        return date;
    }

    public void setDate(DateRangeFilterInput date) {
        this.date = date;
    }

    public DateRangeFilterInput getTemporal_coverage() {
        return temporal_coverage;
    }

    public void setTemporal_coverage(DateRangeFilterInput temporal_coverage) {
        this.temporal_coverage = temporal_coverage;
    }

    public SpatialCoverageFilterInput getSpatial_coverage() {
        return spatial_coverage;
    }

    public void setSpatial_coverage(SpatialCoverageFilterInput spatial_coverage) {
        this.spatial_coverage = spatial_coverage;
    }












}
