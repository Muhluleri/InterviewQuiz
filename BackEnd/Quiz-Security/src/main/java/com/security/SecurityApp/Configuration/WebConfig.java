package com.security.SecurityApp.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Arrays;

@Configuration
@EnableWebMvc
public class WebConfig {

  @Bean
  public CorsConfigurationSource corsConfigurationSource(){

    CorsConfiguration corsConfiguration = new CorsConfiguration() ;

    corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
    corsConfiguration.setAllowedMethods(Arrays.asList("POST" , "GET" ));
    corsConfiguration.setAllowedHeaders(Arrays.asList("authorization" , "content-type"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**" , corsConfiguration);

    return source ;
  }
}
