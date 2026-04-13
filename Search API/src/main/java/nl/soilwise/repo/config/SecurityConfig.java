package nl.soilwise.repo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.stream.Stream;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Value("${repo.cors.url}")
    private List<String> corsUrls;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(httpSecurityCorsConfigurer -> corsConfigurationSource());

        http.authorizeHttpRequests(authz -> {
            authz
                    .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                    .requestMatchers("/", "/search", "/index.html", "/logoWUR.png", "/schema.png", "/styles.css", "/favicon.ico").permitAll()
                    .requestMatchers("/swagger-ui/**", "/docs/**", "/swagger-ui.html", "/webjars/**").permitAll()
                    .requestMatchers("/solr/search","/api/search").permitAll()
                    .requestMatchers(HttpMethod.GET, "/**").permitAll()
                    .anyRequest().authenticated();
        });
        http.httpBasic(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Stream.concat(corsUrls.stream(), Stream.of("null")).toList());
        config.setAllowedMethods(List.of("GET", "POST", "HEAD", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    InMemoryUserDetailsManager inMemoryUserDetailsManager(@Value("${repo.security.ingestion.user}") String username, @Value("${repo.security.ingestion.password}") String password) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        return new InMemoryUserDetailsManager(User.withUsername(username)
                .password(encoder.encode(password)).roles("USER").build());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
