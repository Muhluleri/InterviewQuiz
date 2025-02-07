import {Injectable} from '@angular/core';
import {AuthClientService} from './auth-client.service';
import {Router} from '@angular/router';
import {LoginResponse} from "../../models/responses/login-response.model";
import * as http from 'node:http';


@Injectable({
  providedIn: 'root'
  }
)
export class AuthService {

  private tokenKey = "token"
  private expireTime = "expires_at"
  private tokenDuration = "token_duration"

  constructor(private authService: AuthClientService , private router: Router) {
  }

  public login(payload : LoginResponse) : void{
    this.authService.validateJwt(payload.jwt).subscribe(
      (response) => {
        if (response == true && payload.expirationDate.getDate() < new Date().getTime()) {
          if (typeof localStorage !== 'undefined' && typeof window !== 'undefined') {
            let toVisit = localStorage.getItem('toVisit');
            localStorage.clear();
            localStorage.setItem(this.tokenKey , payload.jwt)
            localStorage.setItem(this.expireTime , payload.expirationDate.toUTCString())
            localStorage.setItem(this.tokenDuration , payload.expiresIn.toString())
            console.log(localStorage.getItem(this.expireTime));

            if (toVisit != null){
              this.router.navigate([toVisit])
            }
            else{
              window.location.href = window.location.origin + "/assessment";
            }

          }
        }

      }
    )

  }

  private getMonth(month : string): number{
    switch (month) {
      case "Jan" : return 0 ; break ;
      case "Feb" : return 1 ; break ;
      case "Mar" : return 2 ; break ;
      case "Apr" : return 3 ; break ;
      case "May" : return 4 ; break ;
      case "Jun" : return 5; break ;
      case "Jul" : return 6; break ;
      case "Aug" : return 7; break ;
      case "Sep" : return 8; break ;
      case "Oct" : return 9; break ;
      case "Nov" : return 10; break ;
      case "Dec" : return 11; break ;
    }
  }

  countdown(count , toVisit){
    let x = setInterval(() => {
      count--
      if (count == 0){
        if (typeof localStorage !== 'undefined'){
          localStorage.clear()
          localStorage.setItem("toVisit" , toVisit );
          this.navigateToLogin()
          return ;
        }
      }
    } , 1000)
  }

  public isTokenStillValid() : boolean{
    if (typeof localStorage !== 'undefined'){
      let time = new Date();
      console.log(localStorage.getItem(this.expireTime).split(" "));
      let timeParts = localStorage.getItem(this.expireTime).split(" ");

      time.setDate(parseInt(timeParts[1]));
      time.setMonth(this.getMonth(timeParts[2]));
      time.setFullYear(parseInt(timeParts[3]));
      time.setHours(parseInt(timeParts[4].split(":")[0]) + 2);
      time.setMinutes(parseInt(timeParts[4].split(":")[1]));
      time.setSeconds(parseInt(timeParts[4].split(":")[2]));

      console.log(time.toUTCString())
      if(time.getTime() > new Date().getTime()){
        this.updateExpirationDate(new Date())
        return true;
      }
      else {
        localStorage.clear()
        this.router.navigate(["/login"]);
        return false;
      }
    }
  }

  public updateExpirationDate(date : Date){
    if (typeof localStorage !== 'undefined'){
      let seconds = Number.parseInt(localStorage.getItem(this.tokenDuration))
      date.setSeconds(date.getSeconds() + seconds);
      localStorage.setItem(this.expireTime , date.toUTCString())
    }
  }

  // public navigateToHome() : void{
  //   if(typeof window !== 'undefined'){
  //     this.router.navigate(['/home'])
  //   }
  // }

  public navigateToLogin() : void{
    if(typeof window !== 'undefined'){
      this.router.navigate(['/login'])
    }
  }

  public isLoggedIn() : boolean{
    if (typeof localStorage !== 'undefined'){
      let token = localStorage.getItem(this.tokenKey);
      return token != null && token.length > 0
    }
  }
}
