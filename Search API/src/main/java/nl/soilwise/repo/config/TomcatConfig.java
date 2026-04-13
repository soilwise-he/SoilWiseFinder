package nl.soilwise.repo.config;

import org.apache.tomcat.util.buf.EncodedSolidusHandling;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomcatConfig {
  @Bean
  public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatCustomizer() {
    return factory -> factory.addConnectorCustomizers(connector -> {
      // allow %2F in path segments
      connector.setEncodedSolidusHandling(EncodedSolidusHandling.DECODE.getValue());
    });
  }
}
