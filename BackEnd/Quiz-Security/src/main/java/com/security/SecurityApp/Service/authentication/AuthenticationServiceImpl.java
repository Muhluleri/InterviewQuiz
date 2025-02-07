package com.security.SecurityApp.Service.authentication;

import com.security.SecurityApp.Configuration.AppConfiguration;
import com.security.SecurityApp.Service.login.request.LoginRequest;
import com.security.SecurityApp.Service.login.response.LoginResponse;
import com.security.SecurityApp.model.User;
import com.security.SecurityApp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService{


  private final AppConfiguration appConfiguration ;
  private final UserRepository userRepository ;



  @Override
  public User authenticate(LoginRequest loginRequest) {
    try{
      AuthenticationManager manager = appConfiguration.authenticationManager(new AuthenticationConfiguration());

      User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow() ;
      manager.authenticate(
        new UsernamePasswordAuthenticationToken(
          loginRequest.getUsername(), loginRequest.getPassword())
      );

      return user;
    }
    catch (Exception e){
      e.printStackTrace();
      return null ;
    }
    }

}
