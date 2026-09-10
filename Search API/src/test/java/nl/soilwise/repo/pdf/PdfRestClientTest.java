package nl.soilwise.repo.pdf;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PdfRestClientTest {
    public final static Logger log = LoggerFactory.getLogger(PdfRestClientTest.class);

    @Autowired
    private PdfRestClient pdfRestClient;

    @Test
    public void readTestResource() {
        PdfItemBase flut = new PdfItemBase();
        flut.setPdfurl("https://link.springer.com/content/pdf/10.1007/978-3-030-32029-4_22");
        pdfRestClient.fetchPdfAsStream(flut);
    }

}