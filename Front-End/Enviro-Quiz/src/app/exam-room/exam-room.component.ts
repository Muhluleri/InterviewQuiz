import {Component, HostListener, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {QuestionService} from "../service/question/question.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Applicant} from "../models/applicantBodies/Applicant.model";
import {ApplicantDTO} from "../models/DTO/Applicant.DTO";
import {Assessment} from "../models/assessmentBodies/Assessment.model";
import {Question} from "../models/questionBodies/Question.body";
import {Answer} from "../models/answerBodies/Answer.model";
import {codingQuestion} from "../models/questionBodies/codingQuestion.body";
import {MultipleChoiceQuestion} from "../models/questionBodies/mcQuestion.body";


@Component({
  selector: 'app-exam-room',
  templateUrl: './exam-room.component.html',
  styleUrl: './exam-room.component.scss'
})
export class ExamRoomComponent implements OnInit {
  currentPdf = this.sanitizer.bypassSecurityTrustResourceUrl('')

  applicant : Applicant = new Applicant() ;

  timeLeft = "00 : 00 : 00"

  allQuestions : Question[] = [];
  allQuestionsAsBoolean : boolean[] = []
  current : number = 0;

  currentCode = ''
  currentTime = new Date() ;
  section : string = ""
  endTime : Date ;

  tests : string[] = []

  ide_height = ""
  showResults = false;

  open = false
  menuOpen = false
  contentWidth = ""
  navWidth = ""

  textDisabled = false
  ideDisabled : boolean = false;

  protected readonly Math = Math;

  constructor(private sanitizer : DomSanitizer , private service : QuestionService , private route : ActivatedRoute , private router : Router) {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--code-editor-height', `calc(var(--exam-content-height) - var(--info-height) - (18px * 2))`);
      document.documentElement.style.setProperty('--text-area-width' , 'calc( (var(--exam-content-page-width) / 2) - (18px * 2) - var(--line-area-width))')
      const rootStyle = document.documentElement
      this.ide_height = getComputedStyle(rootStyle).getPropertyValue("--code-editor-height")
      this.contentWidth = getComputedStyle(rootStyle).getPropertyValue("--exam-content-page-width");
      this.navWidth = getComputedStyle(rootStyle).getPropertyValue("--navigation-width");
    }

  }

  ngOnInit()  {

    console.log("ngOnInit()");

    let start = new Date()
    this.currentTime = start ;
    this.applicant.start = start;

    this.route.paramMap.subscribe(params => {

      this.current = Number.parseInt(params.get("questionNo")) - 1;

      this.service.setStartTime(params.get("uuid") ,start).subscribe(
        (result: string ) => {
          console.log(result);
        },
        (error: HttpErrorResponse) => {
          console.log("Problem over here");
        }
      )

      this.service.getApplicantAssessment(params.get("name"), params.get("surname"), params.get("uuid")).subscribe(
        (result: ApplicantDTO) => {

          this.applicant.firstName= result.firstName
          this.applicant.firstName= result.firstName
          this.applicant.lastName = result.lastName
          this.applicant.uuid = result.uuid;

          if(result.start != null){
            let date = new Date(result.start);
            this.applicant.start = date;
          }

          if(result.end != null){
            let date = new Date(result.end);
            this.applicant.end = date;
          }

          this.applicant.assessment = JSON.parse(result.assessmentDTO.assessment ) as Assessment
          let answers : Answer[] = []
          result.answerDTO.answers.forEach(answer =>{
            answers.push(JSON.parse(answer) as Answer)
          });

          this.applicant.answers = answers;

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

          if (this.allQuestions.length > 0) {
            if (this.applicant.answers.length == 0) {
              this.applicant.answers = []
              this.allQuestions.forEach(question => {
                let answer = new Answer()
                answer.question = question
                this.applicant.answers.push(answer)
              })
            }

            let answers : Answer[] = []
            if (this.allQuestions.length != this.allQuestionsAsBoolean.length) {
              for (let i = 0 ; i < this.allQuestions.length; i++ ) {
                this.allQuestionsAsBoolean.push(false)

                for (let j = 0 ; j < this.applicant.answers.length; j++) {
                  if (this.allQuestions[i].uuid == this.applicant.answers[j].question.uuid) {
                    answers.push(this.applicant.answers[j])
                  }
                }
              }
            }
            this.applicant.answers = answers;
            this.section = this.allQuestions[this.current].section.toString()
            this.currentPdf = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${this.allQuestions[this.current].question}`)
          }

          this.endTime = new Date(this.applicant.start.valueOf() + (this.applicant.assessment.duration * 1000))

          let endTimeAsNumber = (this.endTime.getHours() * 3600 ) + (this.endTime.getMinutes() * 60) + (this.endTime.getSeconds() );
          let currentTimeAsNumber = (this.currentTime.getHours() * 3600) + (this.currentTime.getMinutes() * 60) + (this.currentTime.getSeconds() );

          let timeRemaining = endTimeAsNumber - currentTimeAsNumber;

          if (this.applicant.start == new Date() || this.applicant.end > new Date()){
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

          switch (this.applicant.answers[this.current].question.section.toString()){
            case "CODING": {
              if ( this.applicant.answers[this.current].answer[0] != null){
                this.currentCode = this.applicant.answers[this.current].answer[0]
              }
              break;
            }
          }
          this.isTextDisabled();
        },

        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
    });
  }

  isTextDisabled()  {
    this.textDisabled = new Date() > this.applicant.end
    this.ideDisabled = this.textDisabled ;
  }

  executeCode(code : string ){

    if(new Date() > this.applicant.end){
      return ;
    }

    let question = this.allQuestions[this.current] as codingQuestion

    let answer = new Answer()

    answer.question = question
    answer.answer = []
    answer.answer.push(code)

    this.applicant.answers[this.current] = answer

    this.service.saveAssessment(this.applicant ).subscribe(
      (result) => {
        console.log(result)
      },

      (error) => {
        console.log(error);
      }
    )

    this.service.executeApplicantCode(code , question.scenarios ).subscribe(
      (response : string[]) => {

        this.tests = response

      } ,
      (error : HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  changeQuestion(type , no) {
    this.current = no

    if (typeof window !== "undefined") {
      let url = window.location.href
      if(url.substring(  url.lastIndexOf("/") + 1) != (no + 1)){
        url = url.substring(0 ,  url.lastIndexOf("/") + 1)
        window.location.href = url + (no + 1)
      }
    }
  }

  toggleCorrect(option){
    if (new Date() > this.applicant.end){
      return ;
    }

    if(typeof document !== "undefined"){
      let items = document.getElementsByClassName('optionBox')
      let question = this.allQuestions[this.current] as MultipleChoiceQuestion
      let max = question.correctOptions.length

      let answers = this.applicant.answers[this.current].answer

      if (answers.length < max ){
        answers.push(question.options[option])
        items[option].classList.toggle('selected')
      }else{
        if (answers.includes(question.options[option])){
          answers.splice(answers.indexOf(question.options[option]) , 1)
          items[option].classList.toggle('selected')
        }else{
          alert(`Can't select more than ${max} question/s`)
        }
      }

      this.applicant.answers[this.current].answer = answers

      this.service.saveAssessment(this.applicant ).subscribe(
        (result) => {
          console.log(result)
        },

        (error) => {
          console.log(error);
        }
      )
    }
  }

  openTests(event){
    if ( typeof document !== 'undefined'){

      if(event.show){
        document.documentElement.style.setProperty('--code-editor-height', `calc( ${this.ide_height} - 400px`);
        this.showResults = true;
      }
      else{
        document.documentElement.style.setProperty('--code-editor-height', `calc( ${this.ide_height}`);
        this.showResults = false;
      }
    }
  }

  openMenu(){
    if(typeof document !== "undefined"){
      this.menuOpen = !this.menuOpen
      if ( this.menuOpen){
        document.documentElement.style.setProperty("--exam-content-page-width" , `calc(${this.contentWidth} - 300px)`);
        document.documentElement.style.setProperty("--navigation-width" , `calc(${this.navWidth} + 300px)`);
      }
      else{
        document.documentElement.style.setProperty("--exam-content-page-width" , `calc(${this.contentWidth})`);
        document.documentElement.style.setProperty("--navigation-width" , `calc(${this.navWidth})`)
      }
    }
  }

  @HostListener('window:load', ['$event'])
  onLoad(){
    setTimeout(() => {
      console.log("onLoad");
      switch (this.applicant.answers[this.current].question.section.toString()){
        case "MULTIPLE_CHOICE" : {
          console.log("MULTIPLE_CHOICE")
          if (typeof document != "undefined") {
            let items = document.getElementsByClassName('optionBox')

            for (let i = 0 ; i < this.applicant.answers.length; i++ ) {

              let option = this.applicant.answers[this.current].answer[i]
              let question = this.allQuestions[this.current] as MultipleChoiceQuestion

              if ( question.options.includes(option) ) {
                items[question.options.indexOf(option)].classList.toggle('selected')
              }
            }

          }
          break;
        }
        case "WRITTEN": {
          if (typeof document != "undefined") {
            let text = document.getElementById("writtenAnswer") as HTMLTextAreaElement
            if(this.applicant.answers[this.current].answer[0] != null){
              text.value = this.applicant.answers[this.current].answer[0]
            }

          }
          break;
        }
      }
    })

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
          clearInterval(x);
        }
      } , 1000)


    //

  }

  setWrittenAnswer(){
    if (typeof document !== "undefined"){
      let answer = document.getElementById("writtenAnswer") as HTMLTextAreaElement
      this.applicant.answers[this.current].answer[0] = answer.value

      this.service.saveAssessment(this.applicant ).subscribe(
        (result) => {
          console.log(result)
        },

        (error) => {
          console.log(error);
        }
      )
    }
  }

  sendToReviewPage(){
    if (typeof window !== "undefined"){
      window.location.href = `${window.location.origin}/${this.applicant.firstName}/${this.applicant.lastName}/${this.applicant.uuid}/exam/review` ;
    }
  }

  previous(){
      if (this.current != 0){
        this.current--
        if (typeof window !== "undefined") {
          let url = window.location.href
          url = url.substring(0 ,  url.lastIndexOf("/") + 1)
          window.location.href = url + (`${this.current + 1}`)
        }
      }

  }

  next(){
    if (this.current != this.allQuestions.length - 1){
      this.current++
      if (typeof window !== "undefined") {
        let url = window.location.href
        url = url.substring(0 ,  url.lastIndexOf("/") + 1)
        window.location.href = url + (`${this.current + 1}`)
      }

      this.currentPdf = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${this.allQuestions[this.current].question}&zoom=100`)
      this.section = this.allQuestions[this.current].section.toString()
    }
  }

  protected readonly console = console;
}






