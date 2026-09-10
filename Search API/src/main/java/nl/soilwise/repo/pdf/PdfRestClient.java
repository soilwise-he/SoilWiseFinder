package nl.soilwise.repo.pdf;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;


import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import java.io.InputStream;

@Component
public class PdfRestClient {

    private static final Logger log = LoggerFactory.getLogger(PdfRestClient.class);

    private final static int MAX_CALL_COUNT = 3;

    private ObjectMapper objectMapper = new ObjectMapper();


    private final HttpClient pdfClient = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    public PdfRestClient() {
    }


    public HttpResponse<InputStream> fetchPdfAsStream(PdfItemBase pdfItem) {
        String url = pdfItem.getPdfurl();

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<InputStream> response =
                    pdfClient.send(request, HttpResponse.BodyHandlers.ofInputStream());

            pdfItem.setDownloadMessage(response.statusCode() + "");

            log.info("connected to: {} with statuscode: {}",
                    url, response.statusCode());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("Could not connect to: {} with statuscode: {}",
                        url, response.statusCode());

                response.body().close();
            }

            return response;

        } catch (Exception ex) {
            log.error("Could not connect to: {} with error: {}",
                    url, ex.getMessage());

            pdfItem.setDownloadMessage(ex.getMessage());
            return null;
        }
    }

    public HttpResponse<byte[]> downloadPdf(PdfItemBase pdfItem) {
        String url = pdfItem.getPdfurl();

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<byte[]> response =
                    pdfClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

            pdfItem.setDownloadMessage(String.valueOf(response.statusCode()));
            return response;

        } catch (Exception ex) {
            log.error("Could not connect to: {} with error: {}", url, ex.getMessage());
            pdfItem.setDownloadMessage(ex.getMessage());
            return null;
        }
    }



}
