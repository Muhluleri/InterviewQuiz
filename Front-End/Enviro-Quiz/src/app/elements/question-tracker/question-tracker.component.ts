import { Component, effect, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'question-tracker',
  templateUrl: './question-tracker.component.html',
  styleUrl: './question-tracker.component.css'
})
export class QuestionTrackerComponent implements OnInit{

  @Input() questions = []
  @Input() selected = []
  @Input() current = 0

  @Output('questionNo') question = new EventEmitter<number>()

  constructor(){

  }

  ngOnInit(): void {

  }

  changeQuestion(no){

    if (no !== this.current){
      this.current = no
      this.question.emit(no)
    }
  }


}


