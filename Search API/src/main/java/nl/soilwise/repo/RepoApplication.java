package nl.soilwise.repo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RepoApplication {

	public static void main(String[] args) {
		System.setProperty("jdk.tls.maxHandshakeMessageSize", "65536");
		SpringApplication.run(RepoApplication.class, args);
		
	}
}
