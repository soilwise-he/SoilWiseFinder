package nl.soilwise.repo.config;

import java.security.cert.X509Certificate;

import javax.net.ssl.SSLContext;

import org.apache.hc.client5.http.config.ConnectionConfig;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.DefaultRedirectStrategy;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.io.HttpClientConnectionManager;
import org.apache.hc.client5.http.ssl.DefaultClientTlsStrategy;
import org.apache.hc.client5.http.ssl.TlsSocketStrategy;
import org.apache.hc.core5.ssl.SSLContexts;
import org.apache.hc.core5.ssl.TrustStrategy;
import org.apache.hc.core5.util.Timeout;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestClientConfig {
    private int responseTimeout = 600000;

    @Bean
    public RestTemplate restTemplate() throws Exception {
        TrustStrategy trustStrategy = (X509Certificate[] chain, String authType) -> true;
        SSLContext sslContext = SSLContexts.custom().loadTrustMaterial(null, trustStrategy).build();
        TlsSocketStrategy tlsStrategy = new DefaultClientTlsStrategy(sslContext);
        ConnectionConfig connConfig = ConnectionConfig.custom()
                .setConnectTimeout(Timeout.ofMilliseconds(responseTimeout))
                .build();
        HttpClientConnectionManager connectionManager = PoolingHttpClientConnectionManagerBuilder.create()
                .setDefaultConnectionConfig(connConfig)
                .setTlsSocketStrategy(tlsStrategy)
                .build();
        RequestConfig requestConfig = RequestConfig.custom()
                .setResponseTimeout(Timeout.ofMilliseconds(responseTimeout))
                .setConnectionRequestTimeout(Timeout.ofMilliseconds(responseTimeout))
                .build();
        CloseableHttpClient httpClient = HttpClients.custom()
                .setConnectionManager(connectionManager)
                .setDefaultRequestConfig(requestConfig)
                .setRedirectStrategy(new DefaultRedirectStrategy())
                .build();
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);
        requestFactory.setConnectTimeout(responseTimeout);
        requestFactory.setConnectionRequestTimeout(responseTimeout);
        requestFactory.setReadTimeout(responseTimeout);
        return new RestTemplate(requestFactory);
    }

    @Bean
    public RestTemplate solrRestTemplate(RestTemplateBuilder builder, @Value("${repo.solr.user}") String solrUser, @Value("${repo.solr.password}") String solrPassword){
        return builder
                .basicAuthentication(solrUser, solrPassword)
                .build();
    }
}
