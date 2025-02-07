package com.security.SecurityApp.Service.jwt;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import java.text.ParseException;
import java.util.Date;
import java.util.function.Function;

public interface JWTService {

  String generateJWT(String username) throws ParseException ;

  boolean validateJWT(String jwt)  ;

  boolean isTokenValid(String jwt , UserDetails userDetails) ;

  <T> T extractClaim(String jwt , Function<Claims, T> claimsResolver);

  Date extractExpiration(String jwt);

  String extractUsername(String jwt) ;
}
