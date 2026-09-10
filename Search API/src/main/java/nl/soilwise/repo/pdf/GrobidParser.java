package nl.soilwise.repo.pdf;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
/**
 * Tries to make sense out of the Tika result
 */
public class GrobidParser {
    public final static Logger log = LoggerFactory.getLogger(GrobidParser.class);

    public ParsedPdf parseGrobidResponse(String xml) throws Exception {

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

        factory.setNamespaceAware(true);

        Document document = factory
                .newDocumentBuilder()
                .parse(new ByteArrayInputStream(
                        xml.getBytes(StandardCharsets.UTF_8)
                ));

        XPath xpath = XPathFactory.newInstance().newXPath();

        // TEI namespace
        xpath.setNamespaceContext(new javax.xml.namespace.NamespaceContext() {

            @Override
            public String getNamespaceURI(String prefix) {
                if ("tei".equals(prefix)) {
                    return "http://www.tei-c.org/ns/1.0";
                }

                return XMLConstants.NULL_NS_URI;
            }

            @Override
            public String getPrefix(String namespaceURI) {
                return null;
            }

            @Override
            public java.util.Iterator<String> getPrefixes(String namespaceURI) {
                return null;
            }
        });

        // Title
        String title = xpath.evaluate(
                "/tei:TEI/tei:teiHeader/tei:fileDesc/tei:titleStmt/tei:title[1]",
                document
        ).trim();

        // Authors
        NodeList authorNodes = (NodeList) xpath.evaluate(
                "/tei:TEI/tei:teiHeader/tei:fileDesc/tei:titleStmt/tei:author",
                document,
                XPathConstants.NODESET
        );

        List<String> authors = new ArrayList<>();

        for (int i = 0; i < authorNodes.getLength(); i++) {
            Node author = authorNodes.item(i);

            String name = author.getTextContent()
                    .replaceAll("\\s+", " ")
                    .trim();

            if (!name.isEmpty()) {
                authors.add(name);
            }
        }

        // Article text
        String grobidContent = xpath.evaluate(
                "/tei:TEI/tei:text/tei:body",
                document
        ).trim();

        if (grobidContent != null) {
            grobidContent = grobidContent.replaceAll("(?<=\\w)-(?:\\r?\\n|\\r)(?=\\w)", ""); //handles words split across lines:
            grobidContent = grobidContent.replaceAll("(?:\\r?\\n|\\r)(?=[a-z])", " "); //looks for a newline immediately followed by a lowercase letter and replaces the newline with a space
            grobidContent = grobidContent.replaceAll("[ \\t]+", " ")
                    .replaceAll("(\\n \\n)+", "\n")
                    .replaceAll("[\\r\\n]+", "\n")
                    .replaceAll("(\\n \\n)+", "\n")
                    .trim(); //condense whitespace
        }
        return new ParsedPdf(title, authors, grobidContent);
    }



}
