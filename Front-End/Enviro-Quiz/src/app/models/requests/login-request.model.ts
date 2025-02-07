import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginRequest {
  username: string;
  password: string;

  constructor() {
    this.username = "";
    this.password = "";
  }
}
