package org.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;


@SpringBootApplication
public class BackendApplication  implements Runnable{

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void run() {
        System.out.println("Hello World");
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}
