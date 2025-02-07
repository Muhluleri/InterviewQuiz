import { Inject, NgModule, OnInit, PLATFORM_ID } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminNavComponent } from './admin-nav/admin-nav.component';
import { QuestionUploadComponent } from './question-upload/question-upload.component';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerComponent } from './elements/pdf-viewer/pdf-viewer.component';
import { IdeComponent } from './elements/ide/ide.component';
import { AssessmentCompilationComponent } from './assessment-compilation/assessment-compilation.component';
import { AssessmentNavComponent } from './assessment-compilation/assessment-nav/assessment-nav.component';
import { DropDownComponent } from './elements/drop-down/drop-down.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuestionTrackerComponent } from './elements/question-tracker/question-tracker.component';
import { ExamRoomComponent } from './exam-room/exam-room.component';
import { DummyComponent } from './dummy/dummy.component';
import { ReviewPageComponent } from './review-page/review-page.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    AdminNavComponent,
    QuestionUploadComponent,
    PdfViewerComponent,
    IdeComponent,
    AssessmentCompilationComponent,
    AssessmentNavComponent,
    DropDownComponent,
    QuestionTrackerComponent,
    ExamRoomComponent,
    DummyComponent,
    ReviewPageComponent,
    AssessmentComponent,
    LoginComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule

  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule{ }




