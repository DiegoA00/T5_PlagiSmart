package com.anecacao.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AnecacaoApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnecacaoApiApplication.class, args);
	}
}
