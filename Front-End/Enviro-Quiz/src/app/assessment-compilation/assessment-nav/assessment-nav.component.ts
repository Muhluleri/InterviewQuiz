import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'assessment-nav',
  templateUrl: './assessment-nav.component.html',
  styleUrl: './assessment-nav.component.css'
})
export class AssessmentNavComponent implements OnInit , AfterViewInit , OnDestroy{
  currentTab = 'coding'

  
  @Output('tab') activeTab = new EventEmitter<any>(); 

  @Output('height') height = new EventEmitter<number>()

  ngOnInit(): void {
  
    this.currentTab = "coding"
    this.activeTab.emit("coding")

    if(typeof document !== "undefined"){
      if(this.currentTab !== "")
      {
        const button = document.getElementById(this.currentTab + 'Button')
        
        button.classList.toggle('selected')
        const icon = document.getElementById(this.currentTab + 'icon')
        icon.classList.toggle('on')
        const selectedicon = document.getElementById('selected' + this.currentTab)
        selectedicon.classList.toggle('on')
      }
    }

  }

  ngAfterViewInit(): void {

    if(typeof document !== "undefined"){
      const height = document.getElementById('nav-bar')
      this.height.emit(height.offsetHeight)
    }


  }

  ngOnDestroy(): void {

    if(typeof document !== "undefined"){
          if(this.currentTab !== "")
      {
        const button = document.getElementById(this.currentTab + 'Button')
        button.classList.toggle('selected')
        const icon = document.getElementById(this.currentTab + 'icon')
        icon.classList.toggle('on')
        const selectedicon = document.getElementById('selected' + this.currentTab)
        selectedicon.classList.toggle('on')
      }
    }

  }



  changeState(type : string){

    if(this.currentTab !== type){

      if(this.currentTab !== "")
      {
        const button = document.getElementById(this.currentTab + 'Button')
        button.classList.toggle('selected')
        const icon = document.getElementById(this.currentTab + 'icon')
        icon.classList.toggle('on')
        const selectedicon = document.getElementById('selected' + this.currentTab)
        selectedicon.classList.toggle('on')
      }


      const nextbutton = document.getElementById(type + 'Button')
      nextbutton.classList.toggle('selected')
      const nexticon = document.getElementById(type + 'icon')
      nexticon.classList.toggle('on')
      const nextselectedicon = document.getElementById('selected' + type)
      nextselectedicon.classList.toggle('on')

      this.currentTab = type

      this.activeTab.emit(this.currentTab)
    }

}
}


