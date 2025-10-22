package com.github.theopitsihue.stise_springroll;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController //makes this class a restAPI controller
public class StiseSpringrollApplication {

	public static void main(String[] args) {
		SpringApplication.run(StiseSpringrollApplication.class, args);
	}

	@GetMapping("/root")
	public String apiRoot(){
		return "hello world!";
	}
}
