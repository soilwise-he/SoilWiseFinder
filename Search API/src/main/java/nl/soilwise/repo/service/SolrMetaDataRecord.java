package nl.soilwise.repo.service;


import java.util.List;
import java.util.Date;

public class SolrMetaDataRecord {

    private String identifier;
    private List<String> sources;

    private String title;
    private String abstract_;
    private String type;

    private List<AuthorElement> authors;
    private List<ContactElement> contacts;
    private List<LinkElement> links;

    private Boolean soilMission;
    private String license;
    private String language;

    private Date publicationDate;
    private Date creationDate;
    private Date revisionDate;
    private Date date;
    private Date harvestDate;

    private List<ProjectElement> projects;
    private List<String> subjects;
    private List<String> matchedSubjects;

    private String thumbnail;

    private String spatial;
    private Date temporalStart;
    private Date temporalEnd;

    public record AuthorElement(String person, String organization) {
    }

    public record ContactElement(String person, String organization) {
    }

    public record ProjectElement(String title, String acronym, String grantnr) {
    }

    public record LinkElement(String url, String name, String format) {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAbstract_() {
        return abstract_;
    }

    public void setAbstract_(String abstract_) {
        this.abstract_ = abstract_;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<AuthorElement> getAuthors() {
        return authors;
    }

    public void setAuthors(List<AuthorElement> authors) {
        this.authors = authors;
    }

    public List<ContactElement> getContacts() {
        return contacts;
    }

    public void setContacts(List<ContactElement> contacts) {
        this.contacts = contacts;
    }

    public List<LinkElement> getLinks() {
        return links;
    }

    public void setLinks(List<LinkElement> links) {
        this.links = links;
    }

    public Boolean getSoilMission() {
        return soilMission;
    }

    public void setSoilMission(Boolean soilMission) {
        this.soilMission = soilMission;
    }

    public String getLicense() {
        return license;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Date getPublicationDate() {
        return publicationDate;
    }

    public void setPublicationDate(Date publicationDate) {
        this.publicationDate = publicationDate;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public Date getRevisionDate() {
        return revisionDate;
    }

    public void setRevisionDate(Date revisionDate) {
        this.revisionDate = revisionDate;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Date getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(Date harvestDate) {
        this.harvestDate = harvestDate;
    }

    public List<String> getSources() {
        return sources;
    }

    public void setSources(List<String> sources) {
        this.sources = sources;
    }

    public List<ProjectElement> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectElement> projects) {
        this.projects = projects;
    }

    public List<String> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<String> subjects) {
        this.subjects = subjects;
    }

    public List<String> getMatchedSubjects() {
        return matchedSubjects;
    }

    public void setMatchedSubjects(List<String> matchedSubjects) {
        this.matchedSubjects = matchedSubjects;
    }

    public String getSpatial() {
        return spatial;
    }

    public void setSpatial(String spatial) {
        this.spatial = spatial;
    }

    public Date getTemporalStart() {
        return temporalStart;
    }

    public void setTemporalStart(Date temporalStart) {
        this.temporalStart = temporalStart;
    }

    public Date getTemporalEnd() {
        return temporalEnd;
    }

    public void setTemporalEnd(Date temporalEnd) {
        this.temporalEnd = temporalEnd;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getThumbnail() {
        return thumbnail;
    }
    
    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

}

