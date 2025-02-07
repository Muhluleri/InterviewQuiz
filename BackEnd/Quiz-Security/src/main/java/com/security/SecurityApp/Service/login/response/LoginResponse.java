package com.security.SecurityApp.Service.login.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {

  private String jwt ;

  private long expiresIn ;
}
