package com.security.SecurityApp.Service.authentication;

import com.security.SecurityApp.Service.login.request.LoginRequest;
import com.security.SecurityApp.model.User;

public interface AuthenticationService {

  public User authenticate(LoginRequest loginRequest) ;
}
