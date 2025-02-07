import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { QuestionService } from '../service/question/question.service';
import { QuestionDTO } from '../models/DTO/Question.DTO';
import { HttpErrorResponse } from '@angular/common/http';
import { Question } from '../models/questionBodies/Question.body';
import { MultipleChoiceQuestion } from '../models/questionBodies/mcQuestion.body';
import { codingQuestion } from '../models/questionBodies/codingQuestion.body';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Assessment } from '../models/assessmentBodies/Assessment.model';
import { AssessmentDTO } from '../models/DTO/Assessment.DTO';
import { AssessmentRequest } from '../models/requests/assessmentRequest.body';
import { response } from 'express';
import { AssessmentResponse } from '../models/responses/assessmentResponse.body';

@Component({
  selector: 'app-assessment-compilation',
  templateUrl: './assessment-compilation.component.html',
  styleUrl: './assessment-compilation.component.css',
  animations : [
    trigger('selected' , [
      state("off" ,
        style({

        })
      ),
      state("current",
        style({
          backgroundColor: 'rgb(0, 201, 0), ' ,
          'fontWeight': '700' ,
          'color': 'white'
        })
      ) ,

      state('choosen' ,
        style({
          'backgroundColor': 'rgb(255, 166, 0)',
          'fontWeight': '700'
      })),

      transition('off => current' , animate('0s') )

    ])
  ]
})
export class AssessmentCompilationComponent implements OnInit {

  positions = ['Java developer', 'Data analyst' , 'CyberSecurity Specialist']

  levels = ['Entry' , 'Junior' , "Mid-level" , "Senior"]

  currentTab = ''
  id

  loaded = false

  refresher = true

  position = ""

  level = ""


  questions : Question[] = []

  cQuestions : codingQuestion[] = []
  selectedCoding : boolean[] = []
  codingPdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64,")
  currentCoding = 0
  reviewCoding = []

  mcQuestions : MultipleChoiceQuestion[] = []
  selectedMChoices : boolean[] = []
  multiplePdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64,")
  currentMultiple = 0
  reviewMultiple = []

  wQuestions : Question[] = []
  selectedWritten : boolean[] = []
  writtenPdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64,")
  currentWritten = 0
  reviewWritten = []

  reviewPdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64,")
  reviewType = ""
  reviewQ : any


  constructor(private sanitizer : DomSanitizer , private questionService : QuestionService , private router : Router ){


  }

  addQuestion(type ){
    switch(type){
      case "coding" : {
                        if(!this.selectedCoding[this.currentCoding]){
                          this.reviewCoding.push(this.currentCoding)
                        }
                        this.selectedCoding[this.currentCoding] = true ;
                        break}
      case "multiple-choice" : {
                        if(!this.selectedMChoices[this.currentMultiple] ){
                          this.reviewMultiple.push(this.currentMultiple)
                        }
                        this.selectedMChoices[this.currentMultiple] = true ; break}
      case "written" : {
                        if(!this.selectedWritten[this.currentWritten] ){
                          this.reviewWritten.push(this.currentWritten)
                        }
                        this.selectedWritten[this.currentWritten] = true; break}
    }
  }

  changeQuestion(type , no)
  {
    switch(type){
      case "coding" : {
        this.currentCoding = no
        this.codingPdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + this.cQuestions[no].question)
        break ;
      }
      case "written" : {
        this.currentWritten = no
        this.writtenPdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + this.wQuestions[no].question)
        break ;
      }
      case "multiple-choice" : {
        this.currentMultiple = no
        this.multiplePdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + this.mcQuestions[no].question)
        break ;
      }


    }
  }

  ngOnInit(): void {



    this.questionService.getQuestions().subscribe(
      (response : QuestionDTO[]) => {
        response.forEach(r => {
          var question = JSON.parse(r.question)
          switch (r.type.toString()){
            case "WRITTEN" :{
              this.wQuestions.push(question as Question)
              this.selectedWritten.push(false)
              break ;
            }
            case "CODING" : {
              this.cQuestions.push(question as codingQuestion)
              this.selectedCoding.push(false)
              break ;
            }

            case "MULTIPLE_CHOICE":{
              var newArr : string[]=  []
              var mc  = question as MultipleChoiceQuestion
              for (var i = 0 ; i < mc.options.length ; i++){
                var flag = false
                  for (var j = 0 ; j < mc.correctOptions.length;  j++){
                    if (mc.options[i] === mc.correctOptions[j])
                      flag = true
                  }

                if (flag){
                  newArr.push(mc.options[i])
                }
                else{
                  newArr.push("")
                }
              }

              mc.correctOptions = newArr
              this.mcQuestions.push(mc)
              this.selectedMChoices.push(false)
              break ;
            }
          }
        })


        this.currentCoding = 0

        this.codingPdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + this.cQuestions[0].question);


        this.multiplePdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + this.mcQuestions[0].question)
        this.currentMultiple = 0

        this.writtenPdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + this.wQuestions[0].question)
      } ,

      (error : HttpErrorResponse) =>{
        alert(error)
      }
    )
  }


  reviewQuestion(type , no){

    this.reviewType = type

    switch(type){
      case "coding" : {
        this.reviewPdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + this.cQuestions[no].question)
        this.reviewQ = this.cQuestions[no]
        break;
      }
      case "multiple-choice" : {
        this.reviewPdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + this.mcQuestions[no].question)
        this.reviewQ = this.mcQuestions[no]
        break;
      }
      case "written" : {
        this.reviewPdf = this.sanitizer.bypassSecurityTrustResourceUrl("data:application/pdf;base64," + this.wQuestions[no].question)
        break;
      }
    }
  }


  setTab(tab){
    this.currentTab = tab
  }

  setID(id){
    this.id = id;
  }

  submitAssessment(){

    var assessment =new Assessment()

    var allQuestions :Question[] = []
    var duration = 0

    for(var i = 0 ; i < this.cQuestions.length ; i++){
      if (this.selectedCoding[i]){
        allQuestions.push(this.cQuestions[i])
      }
    }

    for(var i = 0 ; i < this.mcQuestions.length ; i++){
      if (this.selectedMChoices[i]){
        allQuestions.push(this.mcQuestions[i])
      }
    }

    for(var i = 0 ; i < this.wQuestions.length ; i++){
      if (this.selectedWritten[i]){
        allQuestions.push(this.wQuestions[i])
      }
    }

    if (typeof document !== "undefined"){
      var hours = document.getElementById("hour") as HTMLInputElement
      var minutes = document.getElementById('minute') as HTMLInputElement
      assessment.allocatedTime = `PT${hours.valueAsNumber}H${minutes.valueAsNumber}M`

    }

    assessment.questions = allQuestions

    assessment.level = this.level

    assessment.position = this.position

    var assessmentDTO = new AssessmentDTO()

    assessmentDTO.assessment= JSON.stringify(assessment)

    var request = new AssessmentRequest();

    request.assessment = assessmentDTO

    this.questionService.uploadAssessment(request).subscribe(
      (response : AssessmentResponse) => {
        alert(response.message)
      } ,

     ( error : HttpErrorResponse) => {
        alert(error)
     })
  }

  showHeight(value){

    var pages = ['coding' ,'multiplechoice' , 'written' , 'review']

    const header = value.toString() + "px"

    if(typeof document !== 'undefined'){
        var tab = document.getElementById(this.currentTab)
        tab.style.height = `calc(100vh - ${header} - 16px)`
        tab.style.width = "calc(100vw - 16px)"
    }
  }


}





