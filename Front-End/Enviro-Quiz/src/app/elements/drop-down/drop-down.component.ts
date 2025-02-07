import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'drop-down',
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.css'
})
export class DropDownComponent implements OnInit{

  @Input() id : number
  topic : string 

  selectedOption = ""

  @Input() options = []

  default ;

  inside =false

  @Output() value = new EventEmitter<any>()

  constructor(){
    this.inside = false


  }

  ngOnInit(): void {
    if(typeof document !== "undefined"){
      var option = document.getElementById("option") 
      option.classList.toggle("default")
    }

    this.default = true 
  }

  dropMenu(){
    if (typeof document !== "undefined"){
      var button = document.getElementsByName("button")[this.id]
      button.classList.toggle("down")
      button = null;

      var list =document.getElementsByName("list")[this.id]
      list.classList.toggle("open")
    }
  }

  selectOption(option){
    if (typeof document !== "undefined"){
      var selectedOption = document.getElementsByName("content")[this.id]
      selectedOption.innerHTML = this.options[option]

      if(this.default == true)
      {
        this.default = false
        selectedOption = document.getElementsByName("optionSelected")[this.id]
        selectedOption.classList.toggle("default")
      }

      selectedOption = document.getElementsByName("list")[this.id]
      selectedOption.classList.toggle("open")

      var button = document.getElementsByName("button")[this.id]
      button.classList.toggle("down")

    }

    this.value.emit(this.options[option])
  }

}
