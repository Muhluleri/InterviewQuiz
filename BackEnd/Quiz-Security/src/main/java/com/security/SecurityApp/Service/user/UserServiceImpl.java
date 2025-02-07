package com.security.SecurityApp.Service.user;

import com.google.gson.Gson;
import com.security.SecurityApp.Service.authentication.AuthenticationService;
import com.security.SecurityApp.Service.jwt.JWTService;
import com.security.SecurityApp.Service.login.request.LoginRequest;
import com.security.SecurityApp.Service.login.response.LoginResponse;
import com.security.SecurityApp.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final JWTService jwtService ;
  private final AuthenticationService authenticationService ;

  @Override
  public LoginResponse authenticate(String loginRequestString) {

    Gson gson = new Gson() ;

    LoginRequest loginRequest = gson.fromJson(loginRequestString , LoginRequest.class);

    try{
      String jwt = jwtService.generateJWT(loginRequest.getUsername());
      User user = authenticationService.authenticate(loginRequest);

      if (Objects.isNull(user))
        throw new Exception("No user present");

      LoginResponse loginResponse = new LoginResponse();

      loginResponse.setJwt(jwt);
      var date1 = jwtService.extractExpiration(jwt) ;
      var date2 = new Date() ;
      long totalTimeLeft = ((date1.getHours() - date2.getHours()) * 3600) +
                            ((date1.getMinutes() - date2.getMinutes()) * 60) +
                            ((date1.getSeconds() - date2.getSeconds()))   ;
      loginResponse.setExpiresIn(totalTimeLeft);
      return loginResponse;
    }
    catch (ParseException e){
      return null ;
    }
    catch (Exception e) {
      return null ;
    }




  }
}
