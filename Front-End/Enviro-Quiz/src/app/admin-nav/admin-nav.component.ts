import { AfterViewInit, Component, OnInit, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.scss'
})
export class AdminNavComponent implements OnInit , AfterViewInit{

  currentTab = 'coding'

  @Output('tab') activeTab = new EventEmitter<any>();

  @Output('height') height = new EventEmitter<number>()

  ngOnInit(): void {

    this.activeTab.emit('coding')
  }

  ngAfterViewInit(): void {

    if(typeof document !== "undefined"){
      const height = document.getElementById('nav-bar')
      this.height.emit(height.offsetHeight)
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

if(typeof window !== 'undefined' && window.location.href.includes("upload")){

  window.onload = function() {
    const nextbutton = document.getElementById('codingButton')
    nextbutton.classList.toggle('selected')
    const nexticon = document.getElementById('codingicon')
    nexticon.classList.toggle('on')
    const nextselectedicon = document.getElementById('selectedcoding')
    nextselectedicon.classList.toggle('on')
  }

}







