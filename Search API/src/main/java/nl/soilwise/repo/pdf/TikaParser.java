package nl.soilwise.repo.pdf;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Tries to make sense out of the Tika result
 */
public class TikaParser {
    public final static Logger log = LoggerFactory.getLogger(TikaParser.class);


    public ParsedPdf parseTikaContent(InputStream inStream) throws IOException, SAXException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode response = mapper.readTree(inStream);
        if (response == null || response.isNull()) {
            log.warn("Tika response is empty");
            return null;
        }

        ParsedPdf parsedPdf = new ParsedPdf();

        JsonNode metadata = response.get(0);
        Map<String, String> metadataMap = new HashMap<>();
        metadata.fields().forEachRemaining(entry ->
                metadataMap.put(entry.getKey(), entry.getValue().asText())
        );
        //log.info("### metadataMap.keys: "+metadataMap.keySet());

        String creator = metadataMap.get("dc:creator");
        String title =  metadataMap.get("pdf:docinfo:title");

        parsedPdf.setTitle(title);
        if (creator!=null) {
            parsedPdf.setAuthors(Arrays.asList(creator.split(",")));
        }

        String tikaContent = metadataMap.get("X-TIKA:content");
        if (tikaContent != null) {
            tikaContent = tikaContent.replaceAll("(?<=\\w)-(?:\\r?\\n|\\r)(?=\\w)", ""); //handles words split across lines:
            tikaContent = tikaContent.replaceAll("(?:\\r?\\n|\\r)(?=[a-z])", " "); //looks for a newline immediately followed by a lowercase letter and replaces the newline with a space
            tikaContent = tikaContent.replaceAll("[ \\t]+", " ")
                    .replaceAll("(\\n \\n)+", "\n")
                    .replaceAll("[\\r\\n]+", "\n")
                    .replaceAll("(\\n \\n)+", "\n")
                    .trim(); //condense whitespace
        }
        parsedPdf.setText(tikaContent);
        
        return parsedPdf;
    }

}
