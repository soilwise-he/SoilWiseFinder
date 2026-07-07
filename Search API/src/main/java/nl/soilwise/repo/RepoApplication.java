package nl.soilwise.repo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.Arrays;

@SpringBootApplication
public class RepoApplication {

    public static void main(String[] args) {

        boolean cli = Arrays.asList(args).contains("--cli");

        SpringApplication app = new SpringApplication(RepoApplication.class);

        if (cli) {
            app.setAdditionalProfiles("cli");
            app.setWebApplicationType(WebApplicationType.NONE);
        }
        ConfigurableApplicationContext ctx = app.run(args);
    }
}
