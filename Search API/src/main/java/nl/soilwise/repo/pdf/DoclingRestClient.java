package nl.soilwise.repo.pdf;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.jena.sparql.function.library.leviathan.log;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;
import java.util.Collections;
import java.util.Optional;

@Component
public class DoclingRestClient {
    public final static Logger log = LoggerFactory.getLogger(DoclingRestClient.class);


    private final HttpClient restClient;
    private final ObjectMapper objectMapper;
    private String doclingUrl;

    public DoclingRestClient(ObjectMapper objectMapper, @Value("${docling-server.url}") String doclingUrl) {
        this.restClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();

        this.objectMapper = objectMapper;
        this.doclingUrl = doclingUrl;
    }

    public PdfParseDocling forwardToDoclingLink(byte[] body) {
        try {

            var requestBody = new DoclingRequest(
                    Collections.singletonList(new DoclingFileSource("file", "testje.pdf", Base64.getEncoder().encodeToString(body)))
            );

            String json = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(doclingUrl))
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = restClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.error("Docling returned HTTP {}: {}", response.statusCode(), response.body());
                return new PdfParseDocling("ERROR", null);
            }

            ParsedPdf parsedPdf = mapToParsedPdf(response.body());
            return new PdfParseDocling("OK", objectMapper.writeValueAsString(parsedPdf));

        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Exception calling Docling", e);
            return new PdfParseDocling("ERROR", null);
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record DoclingConvertResponse(DoclingConvertReponseDocument document){}
    @JsonIgnoreProperties(ignoreUnknown = true)
    private record DoclingConvertReponseDocument(String md_content){}

    private static @NonNull ParsedPdf mapToParsedPdf(String body) throws JsonProcessingException {
        DoclingConvertResponse response = new ObjectMapper().readValue(body, DoclingConvertResponse.class);
        ParsedPdf parsedPdf = new ParsedPdf();
        parsedPdf.setText(response.document().md_content());
        return parsedPdf;
    }

    private record DoclingRequest(
            java.util.List<DoclingSource> sources
    ) {
    }

    interface DoclingSource {
    }

    private record DoclingFileSource(String kind, String filename, String base64_string) implements DoclingSource {
    }

    private record DoclingLinkSource(String kind, String url) implements DoclingSource {
    }
}