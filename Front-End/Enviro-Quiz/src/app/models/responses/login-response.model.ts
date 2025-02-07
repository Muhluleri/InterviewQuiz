export class LoginResponse {
  jwt! : string;
  expiresIn! : number;
  expirationDate : Date

  constructor( jwt : string , expiration : number ) {

    this.jwt = jwt;
    this.expiresIn = expiration;
    this.expirationDate = new Date();
    console.log( this.expirationDate );
    this.expirationDate.setSeconds(this.expirationDate.getSeconds() + expiration)
    console.log( this.expirationDate );
  }
}
