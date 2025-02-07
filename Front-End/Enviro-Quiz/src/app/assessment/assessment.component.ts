import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../service/authentication/auth.service";
import {AuthClientService} from "../service/authentication/auth-client.service";

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.css'
})
export class AssessmentComponent implements OnInit {

  menuOpen = false;

  tabs = ["compile" , "upload" ]

  currentTab: string;


  constructor(private route : Router , private authService : AuthService , private authClient : AuthClientService ) {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('token') != null) {
        if (authService.isTokenStillValid()){
          authService.countdown(Number.parseInt(localStorage.getItem("token_duration")) , "/hello")
        }else {
          authService.navigateToLogin()
        }
      }
      else{
        authService.navigateToLogin()
      }


    }
  }

  ngOnInit() {
    if ( typeof document != 'undefined' && typeof window != 'undefined') {
      let page = window.location.href.split("/");
      this.currentTab = page[page.length-1]

      if (this.tabs.includes(this.currentTab)){
        document.getElementById(`menu-item-${this.currentTab}`).classList.toggle('selected');
      }

      this.menuOpen = false;
    }
  }

  menuToggle(){
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen == true){
      if ( typeof document !== 'undefined' ) {
        let menu = document.getElementById('side-menu');
        menu.classList.add('open')
      }
    }
    else {
      if ( typeof document !== 'undefined' ) {
        let menu = document.getElementById('side-menu');
        menu.classList.remove('open')
      }
    }

  }

  navigateTo(location){

    if( this.currentTab != location && typeof window != 'undefined' ) {
      window.location.href = window.location.href.replace(this.currentTab ,location);

    }

  }

  logout(){
    if (typeof localStorage !== 'undefined' && typeof window != 'undefined') {
      localStorage.clear()
      window.location.reload();
    }
  }
}
