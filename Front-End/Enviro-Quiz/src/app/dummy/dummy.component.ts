import { Component, HostListener, OnInit } from '@angular/core';
import { QuestionService } from '../service/question/question.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from "@angular/router";

@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
  styleUrl: './dummy.component.css'
})
export class DummyComponent implements OnInit{

  constructor(private service : QuestionService , private router : Router){

  }

  ngOnInit(): void {

    if (typeof window !== "undefined"){
      var location = window.location.href.split("/")
      for (var i = 3 ; i < location.length ; i++){
        if (location[i].indexOf("%20") >= 0)
        {
          location[i].replaceAll("%20" , " ")
        }
      }

      this.service.assignAssessment(location[3] , location[4] , location[5] , location[6]).subscribe(
        (response : string[]) => {

          this.router.navigate([response[0] , response[1] , response[2], response[3], response[4] , "1"]);
          // if (typeof window !== "undefined"){
          //   window.location.href = `${window.location.host}/${response[0]}/${response[1]}/${response[2]}/${response[3]}/${response[4]}/1`;
          // }
          // console.log(response);
        } ,

       ( error : HttpErrorResponse) => {
          alert(error)
       })
}
    }




}
