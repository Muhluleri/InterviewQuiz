import {Component, HostListener} from '@angular/core';
import {QuestionService} from "../service/question/question.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Answer} from "../models/answerBodies/Answer.model";
import {Applicant} from "../models/applicantBodies/Applicant.model";
import {ApplicantDTO} from "../models/DTO/Applicant.DTO";
import {Assessment} from "../models/assessmentBodies/Assessment.model";
import {Question} from "../models/questionBodies/Question.body";
import {SubmitResponse} from "../models/responses/submit-response.model";
import {Result} from "../models/results/result.model";

@Component({
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrl: './review-page.component.css'
})
export class ReviewPageComponent {

  applicant : Applicant = new Applicant() ;
  allQuestions: Question[] = [] ;
  allAnswers : Answer[] = [] ;
  timeLeft : string = " 00 : 00 : 00"

  start = ""
  end = ""



  submitResponse : SubmitResponse = new SubmitResponse() ;

  endTime = new Date()
  currentTime = new Date()

  constructor(private service : QuestionService , private route : ActivatedRoute ) {
     route.paramMap.subscribe(params => {

       service.getApplicantAssessment(params.get("name") , params.get("surname") , params.get("uuid")).subscribe(
         (result : ApplicantDTO) => {
           this.applicant.firstName= result.firstName
           this.applicant.lastName = result.lastName
           this.applicant.uuid = result.uuid;
           let date = new Date(result.start);
           this.applicant.start = date;
           this.start = this.applicant.start.toLocaleTimeString()
           date = new Date(result.end);
           this.applicant.end = date;
           this.end = this.applicant.end.toLocaleTimeString() ;
           this.applicant.assessment = JSON.parse(result.assessmentDTO.assessment ) as Assessment
           this.applicant.assessment.duration = result.assessmentDTO.duration
           this.applicant.assessment.questions.forEach(question => {
             if(question.section.toString() == "MULTIPLE_CHOICE")
               this.allQuestions.push(question)
           })
           this.applicant.assessment.questions.forEach(question => {
             if(question.section.toString() === "WRITTEN")
               this.allQuestions.push(question)
           })
           this.applicant.assessment.questions.forEach(question => {
             if(question.section.toString() === "CODING")
               this.allQuestions.push(question)
           })


           result.answerDTO.answers.forEach(answer =>{
             this.allAnswers.push(JSON.parse(answer) as Answer)
           });

           let answers : Answer[] = []
           for (let i = 0 ; i < this.allQuestions.length; i++ ) {
             for (let j = 0 ; j < this.allAnswers.length; j++) {
               if (this.allQuestions[i].uuid == this.allAnswers[j].question.uuid) {
                 answers.push(this.allAnswers[j])
               }
             }
           }

           this.applicant.answers = answers;

           if(result.resultDTO.result != "null"){
             this.applicant.result = JSON.parse(result.resultDTO.result) as Result
           }

           this.endTime = new Date(this.applicant.start.valueOf() + (this.applicant.assessment.duration * 1000))

           let endTimeAsNumber = (this.endTime.getHours() * 3600 ) + (this.endTime.getMinutes() * 60) + (this.endTime.getSeconds() );
           let currentTimeAsNumber = (this.currentTime.getHours() * 3600) + (this.currentTime.getMinutes() * 60) + (this.currentTime.getSeconds() );

           let timeRemaining = endTimeAsNumber - currentTimeAsNumber;

           if (this.applicant.end > new Date()){
             let hours = Math.floor(timeRemaining / 3600);
             if (hours <= 9 && hours >= 0 ){
               this.timeLeft = `0${hours} : `
             }
             else {
               this.timeLeft = `${hours} : `
             }

             let minutes = Math.floor((timeRemaining - (hours * 3600)) / 60);
             if (minutes <= 9 && minutes >= 0 ){
               this.timeLeft += `0${minutes} : `
             }
             else {
               this.timeLeft += `${minutes} : `
             }

             let seconds = Math.floor((timeRemaining - (hours * 3600) - (minutes * 60)));
             if (seconds <= 9 && seconds >= 0 ){
               this.timeLeft += `0${seconds}`
             }else{
               this.timeLeft += `${seconds}`
             }
           }
           else{
             this.timeLeft = "00 : 00 : 00"
           }


         }
       );



     })
  }

  @HostListener('window:load', ['$event'])
  onLoad(){
    if (this.applicant.end > new Date()){
      let x = setInterval(function(){
        let timer = document.getElementById("timer");

        if (timer.innerHTML !== "00 : 00 : 00" ){
          let time = timer.innerHTML.split(":");

          let seconds = Number.parseInt(time[2]);
          let minutes = Number.parseInt(time[1]);
          let hours = Number.parseInt(time[0]);

          if (seconds != 0 ){
            seconds--
          }
          else{
            seconds = 59 ;
            if (minutes != 0 ){
              minutes--
            }
            else{
              minutes = 59
              hours--
            }
          }

          const padNumber = (n, l) => `${n}`.padStart(l, '0');

          timer.innerHTML = `${padNumber(hours,2)} : ${padNumber(minutes,2)} : ${padNumber(seconds,2)}`;
          this.timeLeft = `${padNumber(hours,2)} : ${padNumber(minutes,2)} : ${padNumber(seconds,2)}`;

        }
        else{
          if(this.applicant.result == "null"){
            this.submitAssessment()
          }
          clearInterval(x);
        }
      } , 1000)
    }





  }

  goToQuestion( no : number){
    if (typeof window !== "undefined"){
      window.location.href = `${window.location.origin}/${this.applicant.firstName}/${this.applicant.lastName}/${this.applicant.uuid}/${this.applicant.assessment.level}/${this.applicant.assessment.position}/${(no + 1)}` ;
    }
  }



  submitAssessment(){

    let end = new Date()

    if(typeof document !== "undefined"){
      document.getElementById("timer").innerHTML = "00 : 00 : 00"
    }

    if (end < this.applicant.end){
      console.log("There is still time")
      this.end = new Date().toLocaleTimeString()
      this.applicant.end = new Date() ;
    }

    this.service.submitAssessment(this.applicant).subscribe(
      (response : SubmitResponse)=>{
        this.applicant.result = new Result()
        this.applicant.result.multiplechoiceResult = response.multiplechoiceResult;
        this.applicant.result.codingResult = response.codingResult;
      }

    )

  }

}
