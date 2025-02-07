package com.security.SecurityApp.Service.user;

import com.security.SecurityApp.Service.login.response.LoginResponse;
import com.security.SecurityApp.Service.verification.response.VerificationResponse;

public interface UserService {

  LoginResponse authenticate(String loginRequest) ;
}
