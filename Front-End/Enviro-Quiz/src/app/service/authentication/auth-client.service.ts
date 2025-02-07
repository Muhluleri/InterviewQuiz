import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoginResponse} from "../../models/responses/login-response.model";

import {environment} from '../../assets/environment.development';
import {response} from 'express';

@Injectable({
  providedIn: 'root'
})
export class AuthClientService {

  apiUrl = environment.securityApiBaseUrl
  constructor(private http: HttpClient) {

  }

  public login(payload : string) : Observable<LoginResponse>{
    const httpOptions = {
      headers : new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload, httpOptions); ;
  }

  public validateJwt(jwt : string) : Observable<boolean>{

    return this.http.post<boolean>(`${this.apiUrl}/checkJwt` , jwt);

  }

  public check() : Observable<string>{
    return this.http.get<string>(`${this.apiUrl}/home`);
  }
}
