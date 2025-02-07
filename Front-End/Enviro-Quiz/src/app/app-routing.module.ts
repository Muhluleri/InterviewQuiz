import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionUploadComponent } from './question-upload/question-upload.component';
import { AssessmentCompilationComponent } from './assessment-compilation/assessment-compilation.component';
import { ExamRoomComponent } from './exam-room/exam-room.component';
import { DummyComponent } from './dummy/dummy.component';
import {ReviewPageComponent} from "./review-page/review-page.component";
import {AssessmentComponent} from "./assessment/assessment.component";
import {LoginComponent} from "./login/login.component";
import {WelcomeComponent} from "./welcome/welcome.component";

const routes: Routes = [
  {path: "" , component: WelcomeComponent},
  {path : "login" , component: LoginComponent},
  {path : "assessment" , redirectTo : "assessment/upload"} ,
  {path :"assessment" , component : AssessmentComponent , children:[
      {path : "upload" , component : QuestionUploadComponent} ,
      {path : "compile" , component : AssessmentCompilationComponent}

    ]} ,

  {path : ":name/:surname/:uuid/:level/:position/:questionNo", component : ExamRoomComponent},
  {path : ":name/:surname/:position/:level" , component : DummyComponent},
  {path : ":name/:surname/:uuid/exam/review" , component : ReviewPageComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
