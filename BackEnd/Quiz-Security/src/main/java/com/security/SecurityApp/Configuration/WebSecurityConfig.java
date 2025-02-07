package com.security.SecurityApp.Configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

  private final WebConfig webConfig ;
  private final AuthExceptionHandler authExceptionHandler ;
  private final JwtValidationFilter jwtValidationFilter ;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http.cors(cors -> cors.configurationSource(webConfig.corsConfigurationSource()))

      .csrf(crsf -> crsf.disable())

      .exceptionHandling(handle ->
                                      handle.authenticationEntryPoint(authExceptionHandler))

      .addFilterBefore(jwtValidationFilter , UsernamePasswordAuthenticationFilter.class)

      .sessionManagement( session ->
                                      session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

      .authorizeHttpRequests(auth ->
                                      auth.requestMatchers("/home" , "/" , "/login" , "/checkJwt")
                                          .permitAll()
                                          .anyRequest()
                                          .authenticated())

      .logout( logout ->
                        logout.permitAll());

    return http.build();
  }
}
