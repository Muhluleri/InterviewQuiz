import { Injectable } from "@angular/core";
import { environment } from "../../assets/environment.development";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Question } from "../../models/questionBodies/Question.body";
import { QuestionRequest } from "../../models/requests/questionRequest.body";
import { QuestionResponse } from "../../models/responses/questionResponse.body";
import { QuestionDTO } from "../../models/DTO/Question.DTO";
import { AssessmentRequest } from "../../models/requests/assessmentRequest.body";
import { AssessmentResponse } from "../../models/responses/assessmentResponse.body";
import {AssessmentDTO} from "../../models/DTO/Assessment.DTO";
import {ApplicantDTO} from "../../models/DTO/Applicant.DTO";
import * as http from "node:http";
import {Applicant} from "../../models/applicantBodies/Applicant.model";
import {Answer} from "../../models/answerBodies/Answer.model";
import {AnswerDTO} from "../../models/DTO/Answer.DTO";
import {SubmitRequest} from "../../models/requests/submit-request.model";
import {SubmitResponse} from "../../models/responses/submit-response.model";



@Injectable({
    providedIn: 'root'
  })
  export class QuestionService{

        apiBaseUrl = environment.apiBaseUrl ;

        constructor (private http : HttpClient){
        }

        public setStartTime(uuid : string , date : Date) : Observable<any>{
          return this.http.post<any>(`${this.apiBaseUrl}/${uuid}/start` , date)
        }

        public getApplicantAssessment(name : string , lastName : string , uuid : string ) : Observable<ApplicantDTO>{
          return this.http.get<ApplicantDTO>(`${this.apiBaseUrl}/${name}/${lastName}/${uuid}`) ;
        }

        public assignAssessment(name : string , lastname : string , position : string , level : string ) : Observable<string[]> {
            return this.http.get<string[]>(`${this.apiBaseUrl}/${name}/${lastname}/${position}/${level}`)
        }

        public executeApplicantCode(answer : string , parameters : string[] ) : Observable<String[]>{

          var allParameters = ""

          for (var j = 0 ; j < parameters.length ; j++){

            var parametersString = parameters[j]

            if (j !== parameters.length-1){
              allParameters += parametersString + "®"
            }
            else{
              allParameters += parametersString
            }

          }

          const body = new HttpParams()
            .set('answer' , answer.toString())
            .set('parameters' , allParameters)

          return this.http.get<string[]>(`${this.apiBaseUrl}/execute` , {params : body})
        }

        public executeCode(answer : string , parameters : string[][]) : Observable<string[]>{


            var allParameters = ""

            for (var j = 0 ; j < parameters.length ; j++){

                var parametersString = ""


                for (var i = 0 ; i < parameters[j].length ; i++){
                    parameters[j][i] = parameters[j][i] .replaceAll("," , "©")
                    if (i !== 0){
                        parametersString += "," + parameters[j][i]
                    }
                    else{
                        parametersString += parameters[j][i]
                    }

                }

                if (j !== parameters.length-1){
                    allParameters += parametersString + "®"
                }
                else{
                    allParameters += parametersString
                }

            }

            const body = new HttpParams()
            .set('answer' , answer.toString())
            .set('parameters' , allParameters)



            return this.http.get<string[]>(`${this.apiBaseUrl}/execute` , {params : body})
        }

        public uploadQuestion(question : QuestionRequest) : Observable<QuestionResponse>{

            return this.http.post<QuestionResponse>(`${this.apiBaseUrl}/upload/question` , question)
        }

        public getQuestions() : Observable<QuestionDTO[]>{

            return this.http.get<QuestionDTO[]>(`${this.apiBaseUrl}/getQuestions`)
        }

        public uploadAssessment(assessment : AssessmentRequest) : Observable<AssessmentResponse>{

            return this.http.post<AssessmentResponse>(`${this.apiBaseUrl}/upload/assessment` , assessment)
        }

        public saveAssessment(applicant : Applicant) : Observable<string>{

          let applicantDTO = new ApplicantDTO()
          applicantDTO.firstName = applicant.firstName
          applicantDTO.lastName = applicant.lastName
          applicantDTO.uuid  = applicant.uuid
          applicantDTO.start = applicant.start
          applicantDTO.assessmentDTO = new AssessmentDTO()
          applicantDTO.assessmentDTO.assessment = JSON.stringify(applicant.assessment)
          applicantDTO.assessmentDTO.duration = applicant.assessment.duration

          let answerDTO = new AnswerDTO()
          applicant.answers.forEach(answer => {
            answerDTO.answers.push(JSON.stringify(answer))
          })


          applicantDTO.answerDTO = answerDTO


          return this.http.post<string>(`${this.apiBaseUrl}/save/assessment`, applicantDTO )
        }

        public submitAssessment(applicant : Applicant ) : Observable<SubmitResponse>{

          let submitRequest = new SubmitRequest()

          let applicantDTO = new ApplicantDTO()
          applicantDTO.firstName = applicant.firstName
          applicantDTO.lastName = applicant.lastName
          applicantDTO.uuid  = applicant.uuid
          applicantDTO.start = applicant.start
          applicantDTO.end = applicant.end
          applicantDTO.assessmentDTO = new AssessmentDTO()
          applicantDTO.assessmentDTO.assessment = JSON.stringify(applicant.assessment)
          applicantDTO.assessmentDTO.duration = applicant.assessment.duration

          let answerDTO = new AnswerDTO()
          applicant.answers.forEach(answer => {
            answerDTO.answers.push(JSON.stringify(answer))
          })


          applicantDTO.answerDTO = answerDTO

          submitRequest.applicantDTO = applicantDTO

          return this.http.post<SubmitResponse>(`${this.apiBaseUrl}/submit`, submitRequest)
        }




  }
