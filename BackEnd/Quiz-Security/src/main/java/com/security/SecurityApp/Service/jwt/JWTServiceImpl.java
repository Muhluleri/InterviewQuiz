package com.security.SecurityApp.Service.jwt;

import com.security.SecurityApp.model.User;
import com.security.SecurityApp.repositories.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.text.ParseException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.Objects;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JWTServiceImpl implements JWTService{

  @Value("${rsa.key.private}")
  private String privateKeyPEM;

  private RSAPrivateKey privateKey ;

  @Value("${rsa.key.public}")
  private String publicKeyPEM;

  private RSAPublicKey publicKey ;

  private final UserRepository userRepository ;

  @PostConstruct
  private void getKeyPairs(){

    var privateKeyString = "" ;
    File privateFile = new File(privateKeyPEM);

    var publicKeyString = "" ;
    File publicFile = new File(publicKeyPEM) ;

    try{
      publicKeyString = new String(Files.readAllBytes(publicFile.toPath()), Charset.defaultCharset())
        .replace("-----BEGIN PUBLIC KEY-----", "")
        .replaceAll(System.lineSeparator(), "")
        .replace("-----END PUBLIC KEY-----", "");

      publicKey = readX509PublicKey(publicKeyString);

      privateKeyString = new String(Files.readAllBytes(privateFile.toPath()), Charset.defaultCharset())
                          .replace("-----BEGIN PRIVATE KEY-----", "")
                          .replaceAll(System.lineSeparator(), "")
                          .replace("-----END PRIVATE KEY-----", "");


      privateKey = readPKCS8PrivateKey(privateKeyString);


    }catch (IOException e){
      e.printStackTrace();
    }catch (NoSuchAlgorithmException | InvalidKeySpecException e){
    e.printStackTrace();
    }
  }

  private RSAPrivateKey readPKCS8PrivateKey(String key) throws NoSuchAlgorithmException, InvalidKeySpecException {

    byte[] encoded = Base64.getDecoder().decode(key);

    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);

    return (RSAPrivateKey) keyFactory.generatePrivate(keySpec);

  }

  private RSAPublicKey readX509PublicKey(String key) throws NoSuchAlgorithmException, InvalidKeySpecException {

    byte[] encoded = Base64.getDecoder().decode(key) ;

    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    X509EncodedKeySpec keySpec = new X509EncodedKeySpec(encoded);

    return (RSAPublicKey) keyFactory.generatePublic(keySpec);

  }

  @Override
  public String generateJWT(String username) throws ParseException {

    Date date = new Date();
    Date date1 = new Date() ;
    date1.setMinutes(date1.getMinutes() + 6);

    JwtBuilder jwts = Jwts.builder()
      .setIssuer("Enviro-Quiz")
      .setSubject(username)
      .setIssuedAt(date)
      .setExpiration(date1)
      .signWith(privateKey) ;

    return jwts.compact();
  }

  @Override
  public boolean validateJWT(String jwt) {

    String username = extractUsername(jwt) ;
    User user = userRepository.findByUsername(username).orElseThrow();

    return isTokenValid(jwt , user) ;

  }

  public String extractUsername(String jwt){
    return extractClaim(jwt , Claims::getSubject );
  }

  public Date extractExpiration(String jwt){
    return extractClaim(jwt , Claims::getExpiration) ;
  }

  public boolean isTokenValid(String jwt , UserDetails userDetails){
    final String username = extractUsername(jwt);
    return (username.equals(userDetails.getUsername())) && !isTokenExpired(jwt);
  }

  private boolean isTokenExpired(String jwt){
    return extractClaim(jwt , Claims::getExpiration).before(new Date());
  }

  public <T> T extractClaim(String jwt , Function<Claims , T> claimsResolver){
    final Claims claims = extractAllClaims(jwt) ;
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String jwt){
    return Jwts
              .parserBuilder()
              .setSigningKey(privateKey)
              .build()
              .parseClaimsJws(jwt)
              .getBody();
  }


}
