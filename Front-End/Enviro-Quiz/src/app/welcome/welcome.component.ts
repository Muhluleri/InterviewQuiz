import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  goToAssessment(){
    if (typeof window !== 'undefined') {
      window.location.href = window.location.href + '/assessment';
    }
  }

}
