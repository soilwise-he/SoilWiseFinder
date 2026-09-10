package nl.soilwise.repo.pdf;

import nl.soilwise.repo.service.SolrViewRepository;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PdfLoaderServiceTest {
    public final static Logger log = LoggerFactory.getLogger(PdfLoaderServiceTest.class);

    @Autowired
    private PdfLoaderService pdfLoaderService;

    @Test
    public void readTestResource() {
        pdfLoaderService.processUncheckedPdfs(20);
    }

}