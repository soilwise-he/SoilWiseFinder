package nl.soilwise.repo.service;


import lombok.extern.slf4j.Slf4j;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.Http2SolrClient;
import org.apache.solr.client.solrj.request.CoreAdminRequest;
import org.apache.solr.client.solrj.response.CoreAdminResponse;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.apache.solr.common.SolrInputDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;

@Slf4j
@Service
public class ServiceSolrIngestion {

    private final SolrViewRepository solrViewRepository;

    private @Value("${repo.solr.collection_v2_active}") String collection_active;
    private @Value("${repo.solr.collection_v2_shadow}") String collection_shadow;
    private @Value("${repo.solr.url}") String solrUrl;
    private @Value("${repo.solr.user}") String solrUser;
    private @Value("${repo.solr.password}") String solrPassword;


    public ServiceSolrIngestion(@Autowired SolrViewRepository solrViewRepository) {
        this.solrViewRepository = solrViewRepository;
    }

    public void doFullReindex(boolean mockup) {
        log.info("in do full reindex");
        ensureCoresExistAndShadowIsEmpty();
        log.info("core created");
        fillCoreWithMetaData(collection_shadow, mockup);
        log.info("core filled with metadata");
        swapCores(collection_shadow, collection_active);
        log.info("end swapCores");
    }

    private void swapCores(String collectionShadow, String collectionActive) {
        try (SolrClient solrClient = new Http2SolrClient.Builder(solrUrl)
                .withBasicAuthCredentials(solrUser, solrPassword)
                .build()) {
            CoreAdminResponse coreAdminResponse = CoreAdminRequest.swapCore(collectionShadow, collectionActive, solrClient);
            if(coreAdminResponse.getStatus() != 0){
                log.error("Core swap failed for {} and {}", collectionActive, collectionShadow);
            } else {
                log.info("Successfully swapped core {} and {}", collectionActive, collectionShadow);
            }
        } catch (IOException | SolrServerException e) {
            log.error("Error swapping cores" ,e);
            throw new RuntimeException(e);
        }
    }


    private void fillCoreWithMetaData(String coreName, boolean mockup) {

        List<SolrInputDocument> list = solrViewRepository.getSolrInputDocuments(mockup);
        try (SolrClient solrClient = new Http2SolrClient.Builder(solrUrl)
                    .withBasicAuthCredentials(solrUser, solrPassword)
                    .build()) {
                Iterator<SolrInputDocument> docs = list.stream().iterator();
                UpdateResponse add = solrClient.add(coreName, docs);
                solrClient.commit(coreName);
            } catch (IOException | SolrServerException e) {
                log.error("Error while filling {} with data.", coreName, e);
                throw new RuntimeException(e);
            }


    }

    private void ensureCoresExistAndShadowIsEmpty() {
        try (SolrClient solrClient = new Http2SolrClient.Builder(solrUrl)
                .withBasicAuthCredentials(solrUser, solrPassword)
                .build()) {
            boolean activeExists = ensureCoreExists(solrClient, collection_active);
            boolean shadowExists = ensureCoreExists(solrClient, collection_shadow);
            boolean shadowEmpty = ensureCoreEmpty(solrClient, collection_shadow);
            if(activeExists && shadowExists && shadowEmpty){
                log.info("cores successfully initialsed, shadow is empty, ready for reindexing");
            } else{
                log.error("invalid state, will not reindex");
                throw new RuntimeException("invalid state, will not reindex");
            }
        } catch (IOException | SolrServerException e) {
            log.error(e.getMessage(),e);
            throw new RuntimeException(e);
        }

    }

    private boolean ensureCoreEmpty(SolrClient solrClient, String coreName) throws SolrServerException, IOException {
        UpdateResponse updateResponse = solrClient.deleteByQuery(coreName, "*:*");
        UpdateResponse commit = solrClient.commit(coreName,true, true);
        return getResultsInCoreCount(solrClient, coreName) == 0;
    }

    private static boolean ensureCoreExists(SolrClient solrClient, String coreName) throws SolrServerException, IOException {
        boolean coreExists = coreExists(solrClient, coreName);
        if (!coreExists) {
            return createCore(solrClient, coreName);
        }
        return true;
    }

    private static long getResultsInCoreCount(SolrClient solrClient, String coreName) throws SolrServerException, IOException {
        SolrQuery query = new SolrQuery("*:*");
        query.setRows(0);
        QueryResponse response = solrClient.query(coreName, query);
        return response.getResults().getNumFound();
    }

    private static boolean createCore(SolrClient solrClient, String coreName) throws SolrServerException, IOException {
        try {
            CoreAdminRequest.Create createCoreRequest = new CoreAdminRequest.Create();
            createCoreRequest.setCoreName(coreName);
            createCoreRequest.setConfigSet("metadata");
            CoreAdminResponse process = createCoreRequest.process(solrClient);
            return process.getStatus() == 0;
        } catch (SolrServerException | IOException e){
            return false;
        }
    }

    public static boolean coreExists(SolrClient solrClient, String coreName) {
        try {
            CoreAdminResponse response = CoreAdminRequest.getStatus(coreName, solrClient);
            return response.getCoreStatus(coreName).size() > 0;
        } catch (SolrServerException | IOException e) {
            return false;
        }
    }

}
