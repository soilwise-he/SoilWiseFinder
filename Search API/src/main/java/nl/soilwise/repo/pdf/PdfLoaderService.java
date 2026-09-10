package nl.soilwise.repo.pdf;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;


@Service
public class PdfLoaderService {
    public final static Logger log = LoggerFactory.getLogger(PdfLoaderService.class);

    @Value("${tika-server.url}")
    private String tika_server_url;

    @Value("${grobid-server.url}")
    private String grobid_server_url;

    @Value("${grobid-server.enabled:false}")
    private boolean grobid_server_enabled;

    @Value("${docling_server.enabled:false}")
    private boolean docling_server_enabled;

    private final DoclingRestClient doclingRestClient;

    private final PdfRepository pdfRepository;

    private final PdfRestClient pdfRestClient;

    TikaParser tikaParser = new TikaParser();
    GrobidParser grobidParser = new GrobidParser();

    private final HttpClient tikaClient = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    public PdfLoaderService(@Autowired PdfRepository pdfRepository, @Autowired PdfRestClient pdfRestClient, @Autowired DoclingRestClient doclingRestClient) {
        this.pdfRepository = pdfRepository;
        this.pdfRestClient = pdfRestClient;
        this.doclingRestClient = doclingRestClient;
    }

    /**
     * Fetched the PdfItems from the db with eiter an empty Tika status and/or Grobid status
     * The PDF will only be loaded once.
     * If the Tika status is empty it will try to parse with Tika.
     * If the Grobid status is empty it will try to parse with Grobid.
     * If the Docling status is empty it will try to parse with Grobid.
     * @param limit an optional limitation of the fetched records, mainly used for testing
     */
    public void processUncheckedPdfs(Integer limit) {
        List<PdfItemBase> pdfItems = pdfRepository.fetchUncheckedTikaGrobidDoclingItems(limit);
        //List<PdfItemBase> pdfItems = pdfRepository.fetchUncheckedTikaItems(limit);
        for (PdfItemBase pdfItem : pdfItems) {
            HttpResponse<byte[]> pdfResponse = pdfRestClient.downloadPdf(pdfItem);
            pdfRepository.updatePdfItemDownloadStatus(pdfItem);

            log.info("downloading {} => {}",pdfItem.getPdfurl(), pdfItem.getDownloadMessage());

            if (pdfResponse != null && pdfResponse.statusCode() >= 200 && pdfResponse.statusCode() < 300) {
                if (pdfItem.getTikaStatus()==null) {
                    PdfParseTika tika = checkPdfWithTikaServer(pdfResponse.body());
                    pdfRepository.updateTikaColumnsForPdfItem(tika, pdfItem.getIdentifier(), pdfItem.getPdfurl());
                }
                if (grobid_server_enabled && pdfItem.getGrobidStatus()==null) {
                    PdfParseGrobid grobid = checkPdfWithGrobidServer(pdfResponse.body());
                    pdfRepository.updateGrobidColumnsForPdfItem(grobid, pdfItem.getIdentifier(), pdfItem.getPdfurl());
                }
                if (docling_server_enabled && pdfItem.getDoclingStatus()==null) {
                    PdfParseDocling docling = doclingRestClient.forwardToDoclingLink(pdfResponse.body());
                    pdfRepository.updateDoclingColumnsForPdfItem(docling, pdfItem.getIdentifier(), pdfItem.getPdfurl());
                }
            }
        }
    }


    private PdfParseTika checkPdfWithTikaServer(byte[] body) {
        PdfParseTika pdfItem = new PdfParseTika();
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);

        URI tikaServerUri = URI.create(
                tika_server_url
                        + "?suppressDuplicateOverlappingText=true"
                        + "&enableAutoSpace=true"
                        + "&imageStrategy=NONE"
                        + "&sortByPosition=true"
        );

        try {
            HttpRequest tikaRequest = HttpRequest.newBuilder()
                    .uri(tikaServerUri)
                    .PUT(HttpRequest.BodyPublishers.ofByteArray(body))
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/pdf")
                    .build();
            HttpResponse<InputStream> tikaResponse =
                    tikaClient.send(
                            tikaRequest,
                            HttpResponse.BodyHandlers.ofInputStream()
                    );

            if (tikaResponse != null && tikaResponse.body() != null) {
                ParsedPdf parsedPdf = tikaParser.parseTikaContent(tikaResponse.body());
                pdfItem.setTikaContent(objectMapper.writeValueAsString(parsedPdf));
                pdfItem.setTikaStatus("OK");
            } else {
                pdfItem.setTikaStatus("NO RESPONSE FROM TIKA");
            }
        } catch (IOException tikaIOEx) {
            String msg = "IOException when invoking URI: " + tikaServerUri + ", msg: " + tikaIOEx.getMessage();
            log.error(msg);
            pdfItem.setTikaStatus(msg);
        } catch (InterruptedException | SAXException tikaEx) {
            pdfItem.setTikaStatus(tikaEx.getMessage());
        }
        log.info("parsed with tika: "+pdfItem.getTikaStatus());
        return pdfItem;
    }


    private PdfParseGrobid checkPdfWithGrobidServer(byte[] pdfBytes) {
        PdfParseGrobid pdfItem = new PdfParseGrobid();
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);

        URI grobidServerUri = URI.create(grobid_server_url);
        try {
            ByteArrayResource pdfResource = new ByteArrayResource(pdfBytes) {
                @Override
                public String getFilename() {
                    return "grobid.pdf";
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("input", pdfResource);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

            RestTemplate restTemplate = new RestTemplate();

            String teiXml = restTemplate.postForObject(
                    grobidServerUri,
                    request,
                    String.class
            );
            if (teiXml != null ) {
                ParsedPdf parsedPdf = grobidParser.parseGrobidResponse(teiXml);
                pdfItem.setGrobidContent(objectMapper.writeValueAsString(parsedPdf));
                pdfItem.setGrobidStatus("OK");
            } else {
                pdfItem.setGrobidStatus("NO RESPONSE FROM GROBID");
            }
        } catch (Exception ex) {
            String msg = "Exception when invoking URI: " + grobidServerUri + ", msg: " + ex.getMessage();
            log.warn(msg);
            pdfItem.setGrobidStatus(msg);
        }
        log.info("parsed with grobid: "+pdfItem.getGrobidStatus());
        return pdfItem;
    }

}
