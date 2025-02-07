import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/authentication/auth.service";
import {AuthClientService} from '../service/authentication/auth-client.service';
import {LoginResponse} from "../models/responses/login-response.model";
import {HttpErrorResponse} from '@angular/common/http';
import {response} from 'express';
import {LoginRequest} from "../models/requests/login-request.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{


  request : LoginRequest = new LoginRequest();
  response: LoginResponse;
  message: string = "";

  constructor(private authService : AuthService , private authClient : AuthClientService) {

  }

  ngOnInit() {


  }

  login(){
    this.message = ""

    if (typeof document !== 'undefined') {
      this.request.username = (document.getElementById("username") as HTMLInputElement).value;
      this.request.password = (document.getElementById("password") as HTMLInputElement).value;
    }
    this.authClient.login(JSON.stringify(this.request)).subscribe(
      (loginResponse : LoginResponse) => {

        if (loginResponse != null){
          this.response = new LoginResponse(loginResponse.jwt , loginResponse.expiresIn)
          this.authService.login(this.response)
        }
        else{
          let x = setTimeout(() =>{this.message = "Login failed due to incorrect credentials";} , 1000)

        }


      } ,

      (error: HttpErrorResponse) => {

      });
  }

}
