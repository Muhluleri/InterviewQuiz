import { Component, Injectable, OnInit } from '@angular/core';
import { codingQuestion } from '../models/questionBodies/codingQuestion.body';
import { MultipleChoiceQuestion } from '../models/questionBodies/mcQuestion.body';
import { Question } from '../models/questionBodies/Question.body';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { read } from 'fs';
import { DomSanitizer } from '@angular/platform-browser';
import { QuestionService } from '../service/question/question.service';
import { response } from 'express';
import { delay } from 'rxjs';
import { QuestionRequest } from '../models/requests/questionRequest.body';
import { Section } from '../models/questionBodies/section.enum';
import { QuestionResponse } from '../models/responses/questionResponse.body';
import {type} from "node:os";


@Injectable({
  providedIn : 'root'
})
@Component({
  selector: 'question-upload',
  templateUrl: './question-upload.component.html',
  styleUrl: './question-upload.component.scss'
})
export class QuestionUploadComponent implements OnInit{

    currentTab = ''

    cQuestion = new codingQuestion();
    mcQuestion = new MultipleChoiceQuestion() ;
    wQuestion = new Question() ;

    scenarios : string[][] = []

    currentPdf = this.sanitizer.bypassSecurityTrustResourceUrl('')
    writingPdf = this.sanitizer.bypassSecurityTrustResourceUrl('')
    multiplechoicePdf = this.sanitizer.bypassSecurityTrustResourceUrl('')
    codingPdf = this.sanitizer.bypassSecurityTrustResourceUrl('')

    ide_height = ""

    showScenarios = false ;
    showResults = false ;

    subscription : any

    constructor(private sanitizer : DomSanitizer , private questionService : QuestionService ){

    }

    ngOnInit(): void {


      if(typeof document !== "undefined"){


        const rootStyle = document.documentElement
        this.ide_height = getComputedStyle(rootStyle).getPropertyValue("--code-editor-height")


        const files = document.getElementsByClassName("file")
        for (var i = 0  ; i < files.length ; i++){
          var temp = files[i] as HTMLInputElement
          temp.value = null
        }
      }

      this.mcQuestion.options = [] ;
      this.mcQuestion.correctOptions = [] ;
      this.cQuestion.scenarios = [] ;
    }

    addOptions(){
      this.mcQuestion.options.push('');
    }

    addScenarios(){
      this.scenarios.push([''])

    }

    addScenarioValue(i){
      this.scenarios[i].push('')
    }

    deleteValue(i , j){

      this.scenarios[i].splice(j , 1)

      if (this.scenarios[i].length === 0 ){
        this.scenarios.splice(i , 1)
      }
    }

    deleteValueSet(i ){

      this.scenarios.splice(i , 1)

    }

    executeCode(code : string ){

      this.cQuestion.testedOutputs = []
      console.log(this.cQuestion.scenarios)
      this.cQuestion.testedCode = code ;

      this.questionService.executeCode(code , this.scenarios ).subscribe(
        (response : string[]) => {

            for (var i = 0 ; i < response.length ; i++){
              this.cQuestion.testedOutputs.push(response[i])
            }

        } ,
        (error : HttpErrorResponse) => {
          alert(error.message)
        }
      )

    }

    onChange(event :any , question : string){

      var reader = new FileReader();

      if(event.target.files[0].type === "application/pdf"){
        switch(question){
          case 'coding' : {
            if(!this.cQuestion.hasFile){
              this.cQuestion.hasFile = true;
            }
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (r) => {
              this.codingPdf = this.sanitizer.bypassSecurityTrustResourceUrl(r.target.result.toString())
              this.currentPdf = this.codingPdf
              this.cQuestion.question = r.target.result.toString().replace("data:application/pdf;base64," , "")
            }


            break;

          }

          case 'multiple-choice' : {
            if(!this.mcQuestion.hasFile){
              this.mcQuestion.hasFile = true ;
            }
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (r) => {
              this.multiplechoicePdf = this.sanitizer.bypassSecurityTrustResourceUrl(r.target.result.toString())
              this.currentPdf = this.multiplechoicePdf
              this.mcQuestion.question = r.target.result.toString().replace("data:application/pdf;base64," , "")
            }
            break;
          }

          case 'writing' :{
            if(!this.wQuestion.hasFile){
              this.wQuestion.hasFile = true;
            }
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (r) => {
              this.writingPdf = this.sanitizer.bypassSecurityTrustResourceUrl(r.target.result.toString())
              this.currentPdf = this.writingPdf
              this.wQuestion.question = r.target.result.toString().replace("data:application/pdf;base64," , "")
            }
            break;
          }
        }
      }
      else{
        alert("Only pdf files are allowed")
      }




    }

    onInput(option ){



      if (typeof document !== 'undefined'){


        this.mcQuestion.options[option] = (document.getElementsByClassName('optionBox')[option].
                                          getElementsByClassName('optionAnswer')[0] as HTMLTextAreaElement).value

        var lines = this.mcQuestion.options[option].split("\n").length ;

        var textArea =(document.getElementsByClassName('optionBox')[option].
        getElementsByClassName('optionAnswer')[0] as HTMLTextAreaElement)



        // if(this.mcQuestion.options[option + 1] !== null){
        //   (document.getElementsByClassName('optionBox')[option].
        //   getElementsByClassName('optionAnswer')[0] as HTMLTextAreaElement).value = '' ;

        // }

        // textArea.style.height = `${textArea.scrollHeight}px`
      }

    }

    onRemove(fileType){

      switch(fileType){
        case 'coding' :{
          if(this.cQuestion.hasFile){
            this.cQuestion.question = null ;
            this.cQuestion.hasFile = false;
          }
          this.codingPdf = this.sanitizer.bypassSecurityTrustResourceUrl('')
          break;
        }

        case 'multiple-choice' :{
          if(this.mcQuestion.hasFile){
            this.mcQuestion.question = null ;
            this.mcQuestion.hasFile = false ;
          }
          this.multiplechoicePdf = this.sanitizer.bypassSecurityTrustResourceUrl('')
          break;
        }

        case 'writing':{

          if(this.wQuestion.hasFile){
            this.wQuestion.question = null ;
            this.wQuestion.hasFile = false;
          }
          this.writingPdf = this.sanitizer.bypassSecurityTrustResourceUrl('')
          break;
        }

      }
    }

    onScenarioInput(i , j){
      if( typeof document !== "undefined"){
        this.scenarios[i][j] = (document.getElementsByClassName('scenario')[i].getElementsByClassName('scenarioValue')[j] as HTMLInputElement).value
      }

      if(this.scenarios[i].length > 1 && this.scenarios[i][j + 1] !== null){
          (document.getElementsByClassName('scenario')[i].
          getElementsByClassName('scenarioValue')[j] as HTMLInputElement).value = ''
      }
    }

    removeOption(option){
          this.mcQuestion.options.splice(option , 1)
    }

    setTab(tab){

      this.currentPdf = this.sanitizer.bypassSecurityTrustResourceUrl('')

      this.currentTab = tab
      switch(this.currentTab){
        case 'coding' :{
          this.currentPdf = this.codingPdf;
          break;
        }
        case 'multiplechoice' :{
          this.currentPdf = this.multiplechoicePdf;
          break;
        }
        case 'written' : {
          this.currentPdf = this.writingPdf;
          break;
        }

      }
    }

    changeIDEHeight(event) {
      if ( typeof document !== 'undefined'){

        if(event.show){
          document.documentElement.style.setProperty('--code-editor-height', `calc( ${this.ide_height} - 400px`);

          switch (event.console){
            case "scenarios" : {
              this.showResults = false;
              this.showScenarios = true;
              break;
            }
            case "results" : {
              this.showResults = true;
              this.showScenarios = false;
              break;
            }
          }
        }
        else{
          document.documentElement.style.setProperty('--code-editor-height', `calc( ${this.ide_height}`);
          this.showResults = false;
          this.showScenarios = false;
        }
      }
    }

     toggleCorrect(option){

      if(this.mcQuestion.options[option] === '')
      {
        alert('There needs to be an value')
        return
      }

      if(typeof document !== "undefined"){
        var items = document.getElementsByClassName('optionBox')
        var correct = items[option].getElementsByClassName('optionAnswer')[0] as HTMLInputElement

        for ( var i = 0 ; i < items.length ; i++){

          var current   = items[i].getElementsByClassName('optionAnswer')[0] as HTMLInputElement

          if (items.length > 1 && i !== option )
          {
            if(correct.value === current.value){
              alert("Cannot have duplicate options")
              return ;
            }
          }
        }

        items[option].classList.toggle('selected')

        if (!this.mcQuestion.correctOptions.includes(correct.value)){
          correct.disabled = true
          this.mcQuestion.correctOptions.push(correct.value)
        }
        else{
          correct.disabled = false
          var i = this.mcQuestion.correctOptions.indexOf(correct.value)
          this.mcQuestion.correctOptions.splice(i ,1)
        }
      }
    }

    uploadQuestion(type : string){

      var missing = ""

      switch(type){
        case 'coding' : {

          if (!this.cQuestion.hasFile){
            missing += "- The question file has not been uploaded\n"
          }

          if (typeof this.cQuestion.testedOutputs === "undefined" && (typeof this.cQuestion.testedCode === "undefined") ){
            missing += "- The code has not been run or there is no code available"
          }

          if (missing.length > 0 ){
            alert("The following has not been addressed \n" + missing)
            return ;
          }

          this.cQuestion.scenarios = [""]

          for ( var i = 0 ; i < this.scenarios.length ; i++){

            for(var j = 0 ; j < this.scenarios[i].length;  j++){
              if (j === 0){
                this.cQuestion.scenarios[i] += this.scenarios[i][j]
              }
              else{
                this.cQuestion.scenarios[i] += ", " + this.scenarios[i][j]
              }
            }

            if(i < (this.scenarios.length - 1)){
              this.cQuestion.scenarios.push("");
            }


          }

          this.cQuestion.section = Section.CODING

          var question = new QuestionRequest()

          question.question.type = Section.CODING
          question.question.question = JSON.stringify(this.cQuestion)

          this.questionService.uploadQuestion(question).subscribe(
            (response : QuestionResponse ) => {
              alert(response.message)
            },
            (error :HttpErrorResponse) =>{
              alert(error);
            }
          )

          break;
        }

        case 'multiple-choice' : {
          if (!this.mcQuestion.hasFile){
            missing += "- The question file has not been uploaded\n"
          }

          if ( (typeof this.mcQuestion.options === "undefined") || !(this.mcQuestion.options.length > 0) ){
            missing += "- There are no options availible for the question\n"
          }

          if ( (typeof this.mcQuestion.correctOptions === "undefined") || !(this.mcQuestion.correctOptions.length > 0)){
            missing += "- There are no correct options selected for the question\n"
          }

          if (missing.length > 0 ){
            alert("The following has not been addressed \n" + missing)
            return ;
          }

          var question = new QuestionRequest()

          question.question.type = Section.MULTIPLE_CHOICE
          question.question.question = JSON.stringify(this.mcQuestion)

          this.questionService.uploadQuestion(question).subscribe(
            (response : QuestionResponse ) => {
              alert(response.message)
            },
            (error :HttpErrorResponse) =>{
              alert(error);
            }
          )

          break ;

        }
        case 'written': {
          if (!this.wQuestion.hasFile){
            missing += "- The question file has not been uploaded\n"
          }

          if (missing.length > 0 ){
            alert("The following has not been addressed \n" + missing)
            return ;
          }

          var question = new QuestionRequest()

          question.question.type = Section.WRITTEN
          question.question.question = JSON.stringify(this.wQuestion)

          this.questionService.uploadQuestion(question).subscribe(
            (response : QuestionResponse ) => {
              alert(response.message)
            },
            (error :HttpErrorResponse) =>{
              alert(error);
            }
          )

          break ;
        }
      }
    }


  protected readonly console = console;
}




