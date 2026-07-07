package nl.soilwise.repo;

import nl.soilwise.repo.service.ServiceSolrIngestion;
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

    public IngestionCliRunner(ConfigurableApplicationContext context, ServiceSolrIngestion serviceSolrIngestion) {
        this.context = context;
        this.serviceSolrIngestion = serviceSolrIngestion;
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



        SpringApplication.exit(context, () -> 0);
    }
}
