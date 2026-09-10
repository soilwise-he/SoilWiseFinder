package nl.soilwise.repo;

import nl.soilwise.repo.pdf.PdfLoaderService;
import nl.soilwise.repo.service.ServiceSolrIngestion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@Profile("cli")
public class IngestionCliRunner implements CommandLineRunner {

    private final ConfigurableApplicationContext context;
    private final ServiceSolrIngestion serviceSolrIngestion;
    private final PdfLoaderService pdfLoaderService;

    public IngestionCliRunner(ConfigurableApplicationContext context, ServiceSolrIngestion serviceSolrIngestion, PdfLoaderService pdfLoaderService ) {
        this.context = context;
        this.serviceSolrIngestion = serviceSolrIngestion;
        this.pdfLoaderService = pdfLoaderService;
    }

    @Override
    public void run(String... args) throws Exception {

        boolean rematerialize_view = Arrays.asList(args).contains("--rematerialize-view");
        if (rematerialize_view) {
            serviceSolrIngestion.rematerializeView();
        }
        boolean reindex = Arrays.asList(args).contains("--reindex");
        if (reindex) {
            serviceSolrIngestion.doFullReindex(false);
        }
        boolean reindex_mockup = Arrays.asList(args).contains("--reindex-mockup");
        if (reindex_mockup) {
            serviceSolrIngestion.doFullReindex(true);
        }
        boolean extract_pdf_with_tika = Arrays.asList(args).contains("--extract-pdf-with-tika");
        if (extract_pdf_with_tika) {
            pdfLoaderService.processUncheckedPdfs(null);
        }

        SpringApplication.exit(context, () -> 0);
    }
}
