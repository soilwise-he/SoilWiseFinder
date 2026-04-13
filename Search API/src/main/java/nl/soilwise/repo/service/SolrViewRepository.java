package nl.soilwise.repo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

import org.apache.solr.common.SolrInputDocument;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.*;

import static nl.soilwise.repo.util.ProjectStatics.SDF_DATE_PLUS_TIME;
@Slf4j

@Repository
public class SolrViewRepository {
    private JdbcTemplate jdbcTemplate;
    private DecimalFormat pointFormat;

    public SolrViewRepository(@Autowired JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;

        DecimalFormatSymbols decimalPointSymbols = new DecimalFormatSymbols(Locale.getDefault());
        decimalPointSymbols.setDecimalSeparator('.');
        pointFormat = new DecimalFormat();
        pointFormat.setDecimalFormatSymbols(decimalPointSymbols);
        pointFormat.setGroupingUsed(false);
    }

    private List<String> mapToSolrListField(List<?> objectList, ObjectMapper objectMapper) {
        if (objectList == null) return null;

        return objectList.stream().map(item -> {
            try {
                return item instanceof String ? (String) item : objectMapper.writeValueAsString(item);
            } catch (JsonProcessingException ignored) {
                return "";
            }
        })
        .filter(s -> s != null && !s.isBlank())
        .distinct()
        .toList();
    }

    private SolrInputDocument mapToSolrInputDocument(SolrMetaDataRecord solrMetaDataRecord, ObjectMapper objectMapper) {
        SolrInputDocument result = new SolrInputDocument();
        result.addField("identifier", solrMetaDataRecord.getIdentifier());
        result.addField("sources", mapToSolrListField(solrMetaDataRecord.getSources(), objectMapper));

        result.addField("title", solrMetaDataRecord.getTitle());
        result.addField("abstract", solrMetaDataRecord.getAbstract_());
        result.addField("type", solrMetaDataRecord.getType());

        if (solrMetaDataRecord.getAuthors() != null) {
            result.addField("persons", solrMetaDataRecord.getAuthors().stream()
                    .filter(Objects::nonNull)
                    .map(SolrMetaDataRecord.AuthorElement::person)
                    .filter(s -> s != null && !s.isBlank())
                    .toList());
            result.addField("organizations", solrMetaDataRecord.getAuthors().stream()
                    .filter(Objects::nonNull)
                    .map(SolrMetaDataRecord.AuthorElement::organization)
                    .filter(s -> s != null && !s.isBlank())
                    .distinct()
                    .toList());
            result.addField("view_authors", mapToSolrListField(solrMetaDataRecord.getAuthors(), objectMapper));
        }
        
        if (solrMetaDataRecord.getContacts() != null) {
            result.addField("contact_persons", solrMetaDataRecord.getContacts().stream()
                    .filter(Objects::nonNull)
                    .map(SolrMetaDataRecord.ContactElement::person)
                    .filter(s -> s != null && !s.isBlank())
                    .toList());
            result.addField("contact_organizations", solrMetaDataRecord.getContacts().stream()
                    .filter(Objects::nonNull)
                    .map(SolrMetaDataRecord.ContactElement::organization)
                    .filter(s -> s != null && !s.isBlank())
                    .distinct()
                    .toList());
            result.addField("view_contacts", mapToSolrListField(solrMetaDataRecord.getContacts(), objectMapper));
        }

        if (solrMetaDataRecord.getLinks() != null) {
            result.addField("links", mapToSolrListField(solrMetaDataRecord.getLinks(), objectMapper));
        }
        
        result.addField("soilmission", solrMetaDataRecord.getSoilMission());
        result.addField("license", solrMetaDataRecord.getLicense());
        result.addField("language", solrMetaDataRecord.getLanguage());

        result.addField("date_publication", solrMetaDataRecord.getPublicationDate());
        result.addField("date_creation", solrMetaDataRecord.getCreationDate());
        result.addField("date_revision", solrMetaDataRecord.getRevisionDate());
        result.addField("date", solrMetaDataRecord.getDate());
        result.addField("date_harvest", solrMetaDataRecord.getHarvestDate());

        result.addField("projects", mapToSolrListField(solrMetaDataRecord.getProjects(), objectMapper));
        result.addField("project_acronyms", extractAcronymsFromProjects(solrMetaDataRecord.getProjects()));
        result.addField("subjects", mapToSolrListField(solrMetaDataRecord.getSubjects(), objectMapper));
        result.addField("matched_subjects", mapToSolrListField(solrMetaDataRecord.getMatchedSubjects(), objectMapper));

        result.addField("thumbnail", solrMetaDataRecord.getThumbnail());
        
        result.addField("spatial", solrMetaDataRecord.getSpatial());
        result.addField("temporal_start", solrMetaDataRecord.getTemporalStart());
        result.addField("temporal_end", solrMetaDataRecord.getTemporalEnd());
        
        if (solrMetaDataRecord.getTemporalStart() != null && solrMetaDataRecord.getTemporalEnd() != null) {
            if (solrMetaDataRecord.getTemporalStart().before(solrMetaDataRecord.getTemporalEnd()))
                result.addField("temporal_range", "[" + SDF_DATE_PLUS_TIME.format(solrMetaDataRecord.getTemporalStart()) + " TO " + SDF_DATE_PLUS_TIME.format(solrMetaDataRecord.getTemporalEnd()) + "]");
        }

        return result;
    }

    private static List<String> extractAcronymsFromProjects(List<SolrMetaDataRecord.ProjectElement> projects) {
        if (projects == null || projects.size() == 0) return null;
        
        return projects.stream().map(item -> item.acronym())
            .filter(s -> s != null && !s.isBlank())
            .distinct()
            .toList();
    }

    public List<SolrInputDocument> getSolrInputDocuments(boolean mockup) {
        List<SolrMetaDataRecord> allMetaDataRecords = fetchSolrMetaDataRecordsFromMockTable(mockup);
        ObjectMapper objectMapper = new ObjectMapper();
        List<SolrInputDocument> list = allMetaDataRecords.stream().map(solrMetaDataRecord -> mapToSolrInputDocument(solrMetaDataRecord, objectMapper)).toList();
        return list;
    }

    private @NonNull List<SolrMetaDataRecord> fetchSolrMetaDataRecordsFromMockTable(boolean mockup) {
        String sql = (mockup) ? "select * from metadata.mockup_records" : "select * from metadata.mv_records";
        
        if (mockup) {
            log.info("*** reindex using MOCKUP_RECORDS ***");
        }
        
        ObjectMapper objectMapper = new ObjectMapper();
        RowMapper<SolrMetaDataRecord> mapper = (rs, rownum) -> {
            SolrMetaDataRecord solrMetaDataRecord = new SolrMetaDataRecord();
            solrMetaDataRecord.setIdentifier(rs.getString("identifier"));
            solrMetaDataRecord.setTitle(rs.getString("title"));
            solrMetaDataRecord.setAbstract_(rs.getString("abstract"));
            solrMetaDataRecord.setType(rs.getString("type"));

            String authorJson = rs.getString("authors");
            try {
                List<SolrMetaDataRecord.AuthorElement> authors = authorJson == null ? null : objectMapper.readValue(authorJson, new TypeReference<List<SolrMetaDataRecord.AuthorElement>>() {});
                solrMetaDataRecord.setAuthors(authors);
            } catch (JsonProcessingException ignored) {
            }
            
            String contactsJson = rs.getString("contacts");
            try {
                List<SolrMetaDataRecord.ContactElement> contacts = contactsJson == null ? null : objectMapper.readValue(contactsJson, new TypeReference<List<SolrMetaDataRecord.ContactElement>>() {});
                solrMetaDataRecord.setContacts(contacts);
            } catch (JsonProcessingException ignored) {
            }

            solrMetaDataRecord.setSoilMission(rs.getObject("soilmission") == null ? null : rs.getBoolean("soilmission"));
            solrMetaDataRecord.setLicense(rs.getString("license"));
            solrMetaDataRecord.setLanguage(rs.getString("language"));

            solrMetaDataRecord.setPublicationDate(rs.getDate("publicationdate"));
            solrMetaDataRecord.setCreationDate(rs.getDate("creationdate"));
            solrMetaDataRecord.setRevisionDate(rs.getDate("revisiondate"));
            solrMetaDataRecord.setDate(rs.getDate("date"));
            solrMetaDataRecord.setHarvestDate(rs.getDate("harvestdate"));

            try {
                String sourcesJson = rs.getString("sources");
                List<String> sources = sourcesJson == null ? null : objectMapper.readValue(sourcesJson, new TypeReference<List<String>>() {});
                solrMetaDataRecord.setSources(sources);
            } catch (Exception exception) {
                log.error(exception.getMessage());
            }

            try {
                String projectsJson = rs.getString("projects");
                List<SolrMetaDataRecord.ProjectElement> projects = projectsJson == null ? null : objectMapper.readValue(projectsJson, new TypeReference<List<SolrMetaDataRecord.ProjectElement>>() {});
                solrMetaDataRecord.setProjects(projects);
            } catch (Exception exception) {
                log.error(exception.getMessage());
            }

            try {
                String subjectsJson = rs.getString("subjects");
                List<String> subjects = subjectsJson == null ? null : objectMapper.readValue(subjectsJson, new TypeReference<List<String>>() {});
                solrMetaDataRecord.setSubjects(subjects);
            } catch (Exception exception) {
                log.error(exception.getMessage());
            }

            try {
                String matchesSubjectsJson = rs.getString("matched_subjects");
                List<String> matchedSubjects = matchesSubjectsJson == null ? null : objectMapper.readValue(matchesSubjectsJson, new TypeReference<List<String>>() {});
                solrMetaDataRecord.setMatchedSubjects(matchedSubjects);
            } catch (Exception exception) {
                log.error(exception.getMessage());
            }
                
            try {
                String linksJson = rs.getString("distributions");
                List<SolrMetaDataRecord.LinkElement> links = linksJson == null ? null : objectMapper.readValue(linksJson, new TypeReference<List<SolrMetaDataRecord.LinkElement>>() {});
                solrMetaDataRecord.setLinks(links);
            } catch (Exception exception) {
                log.error(exception.getMessage());
            }
            
            solrMetaDataRecord.setThumbnail(rs.getString("thumbnail"));
            
            String spatial = rs.getString("spatial");
            
            if (spatial != null && !spatial.isBlank()) {
               solrMetaDataRecord.setSpatial(bboxStringToSolrPolygon(spatial));
            }

            solrMetaDataRecord.setTemporalStart(rs.getDate("temporal_start"));
            solrMetaDataRecord.setTemporalEnd(rs.getDate("temporal_end"));


            return solrMetaDataRecord;
        };

        List<SolrMetaDataRecord> allMetaDataRecords = jdbcTemplate.query(sql, mapper);

        return allMetaDataRecords;
    }

    private String bboxStringToSolrPolygon(String bbox) {
        String cleaned = bbox.replace("[", "").replace("]", "");
        String[] parts = cleaned.split(",");
        if (parts.length != 4) {
            return null;
        }
        try {
            Double dMinX = Double.parseDouble(parts[0].trim());
            Double dMinY = Double.parseDouble(parts[1].trim());
            Double dMaxX = Double.parseDouble(parts[2].trim());
            Double dMaxY = Double.parseDouble(parts[3].trim());
            if (dMinX < -180 || dMaxX > 180 || dMinY < -90 || dMaxY > 90) {
                return null;
            }
            String minX = pointFormat.format(dMinX);
            String minY = pointFormat.format(dMinY);
            String maxX = pointFormat.format(dMaxX);
            String maxY = pointFormat.format(dMaxY);

            String polygon = "POLYGON((minX minY, maxX minY, maxX maxY, minX maxY, minX minY))";
            return polygon.replace("minX",minX).replace("maxX",maxX).replace("minY",minY).replace("maxY",maxY);
        } catch (Exception e) {
            log.info("could not parse bbox: "+bbox);
            return null;
        }
    }


}
