package com.bazar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // Tarea programada para solicitudes periódicas
public class MarketZujocyl2Application {

	public static void main(String[] args) {
		SpringApplication.run(MarketZujocyl2Application.class, args);
	}

}
