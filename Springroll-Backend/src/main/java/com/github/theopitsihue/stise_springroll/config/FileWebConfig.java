package com.github.theopitsihue.stise_springroll.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileWebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get(System.getProperty("user.dir"), "media");
        String uploadPath = uploadDir.toUri().toString();

        // Serve files under URL path /media/**
        registry.addResourceHandler("/media/**")
                .addResourceLocations(uploadPath);
    }
}