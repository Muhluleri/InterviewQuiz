package com.security.SecurityApp.Controller;


import com.security.SecurityApp.Service.jwt.JWTService;
import com.security.SecurityApp.Service.login.response.LoginResponse;
import com.security.SecurityApp.Service.user.UserService;
import com.security.SecurityApp.Service.verification.response.VerificationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;


@RestController
@CrossOrigin
@RequiredArgsConstructor
public class SecurityController {

  private final UserService userService ;
  private final JWTService jwtService ;

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@RequestBody String loginRequest)  {
    System.out.println("Hello");
    return ResponseEntity.ok(userService.authenticate(loginRequest)) ;
  }

  @GetMapping("/home")
  public String check(){
    System.out.println("We are connected");
    return null ;
  }

  @GetMapping("/hello")
  public String secondCheck(){
    System.out.println("We are connected");
    return null ;
  }

  @PostMapping("/checkJwt")
  public boolean checkJwt(@RequestBody String jwt){
    return jwtService.validateJWT(jwt) ;
  }


}
