import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

@Component({
  selector: 'code-ide',
  templateUrl: './ide.component.html',
  styleUrl: './ide.component.scss'

})
export class IdeComponent implements OnInit {
  @Input() storedCode = ''

  @Input() scenarios = false
  @Input() results = false;

  showConsole = false;
  currentConsole = "" ;
  @Output() showConsoleChange = new EventEmitter<{show : boolean , console : string}>();

  textValue : string= ""
  lines : string[] = [""]

  tabLevel = 0 ;
  setWidth = 700 - 8 ;
  linePos = 0
  cursPos = 0

  @Output('code') codeEmitter = new EventEmitter<String>()

  ngOnInit() {
    this.textValue = this.storedCode

    if (typeof document !== 'undefined') {
      //Works. Use this to set values for the ide
      // const rootStyle = document.documentElement;
      //
      // console.log(getComputedStyle(rootStyle).getPropertyValue("--fire"));
      }

    if (typeof document !== 'undefined') {
      let input = document.getElementById('textIn') as HTMLTextAreaElement ;
      this.textValue = input.value;

      let output = document.getElementById('textOut') as HTMLDivElement;
      this.lines = input.value.split("\n");
      this.getIdeWidth() ;
      input.value = this.textValue
      this.determineLineNo(input.value);
      this.resize(input.value);
      this.lines = this.syntaxHighlighting(this.lines)

      output.innerHTML = "";
      for (var i = 0 ; i< this.lines.length ; i++){
        if (this.lines[i] != "") {
          output.innerHTML += `<p class="line">${this.lines[i]}</p>`;
        }
        else{
          output.innerHTML += `<p class="line">&ensp;</p>`;
        }
      }
    }
    this.findCursorPosition()
  }

  getIdeWidth(){
    if (typeof document !== 'undefined') {
      let input = document.getElementById('textIn') as HTMLTextAreaElement ;
      input.value = ""
      let input2 = document.getElementById('textIn') ;
      this.setWidth = input2.offsetWidth - 8 ;

    }

  }

  determineLineNo(value : string){
    if ( typeof document !== 'undefined') {
      var line = document.getElementById('lineBody')
      var input = document.getElementById('textIn') as HTMLTextAreaElement ;

      var currentLine = input.value.substring(0 , input.selectionStart).split('\n').length - 1;
      line.innerHTML = ''
      for (var i = 0 ; i < value.split('\n').length ; i++){
        line.innerHTML += `<div class = "lineNo">${i + 1}</div>`
      }
    }

  }

  findCursorPosition(){
    if(typeof document !== 'undefined') {
      let input = document.getElementById('textIn') as HTMLTextAreaElement ;
      let cursorPosition = input.selectionStart;

      this.determineLineNo(input.value);

      let statLines = input.value.substring(0 , cursorPosition).split("\n");
      this.linePos = statLines.length - 1
      this.cursPos = statLines[this.linePos].length ;
    }
  }

  updateCursorPosition(e){

    switch(e.keyCode){
      case "ArrowDown":{
        this.linePos++
      }
      case "ArrowUp":{
        this.linePos--
      }
      case "ArrowLeft":{
        this.cursPos--
      }
      case "ArrowRight":{
        this.cursPos++
      }
    }

  }

  onTab(event){
    if (typeof document !== 'undefined') {
      event.preventDefault();
      let input = document.getElementById('textIn') as HTMLTextAreaElement ;
      let cursorPosition = input.selectionStart + 1;

      let code = input.value.substring(0 , input.selectionStart) + "\t" + input.value.substring(input.selectionEnd)
      input.value = code;
      input.selectionStart = cursorPosition;
      input.selectionEnd = cursorPosition;
      this.onInput(code)

    }
  }

  onInput(value: string): void {
    if (typeof document !== 'undefined') {
      this.determineLineNo(value)
      this.findCursorPosition()
      let output = document.getElementById('textOut') as HTMLDivElement;

      this.lines = value.split("\n");
      this.resize(value)
      this.lines = this.syntaxHighlighting(this.lines)

      output.innerHTML = "";
      for (var i = 0 ; i< this.lines.length ; i++){

        if (this.lines[i] != "") {
          output.innerHTML += `<p class="line">${this.lines[i]}</p>`;
        }
        else{
          output.innerHTML += `<p class="line">&ensp;</p>`;
        }
      }
    }
  }

  resize(value){

    let max = 0 ;
    let characterWidth = 28.9/3.0 ;

    if (typeof document !== 'undefined') {
      let input = document.getElementById('textIn') as HTMLTextAreaElement ;
      let output = document.getElementById('textOut') as HTMLDivElement;
      let code = input.value
      let lines = code.split("\n");

      for(let i = 0 ; i < lines.length ; i++){
        if (lines[i].length * characterWidth > max){
          max = lines[i].length * characterWidth;
        }
      }

      if (max > this.setWidth){
        let textArea = document.getElementById('textIn') as HTMLTextAreaElement ;
        textArea.style.width = `${max}px`
        output.style.width = `${max}px`
      }
      else{
        let textArea = document.getElementById('textIn') as HTMLTextAreaElement ;
        textArea.style.width = `${this.setWidth}px`
        output.style.width = `${this.setWidth}px`
      }
    }
  }

  onSpecialInput(e) {
    if( typeof document !== 'undefined') {

      let input = document.getElementById('textIn') as HTMLTextAreaElement ;
      let output = document.getElementById('textOut') as HTMLDivElement;
      let cursorPosition = input.selectionStart;
      let pair = ""

      if (e.key.length == 1){
        switch (e.key){
          case "{" : pair = "}" ; break;
          case "[" : pair = "]" ; break;
          case "(" : pair = ")" ; break;
          case "'" : pair = "'" ; break;
          case '"' : pair = '"' ; break;
          case "`" : pair = "`" ; break;
        }

        if(pair != ""){
          let code = input.value.substring(0 , input.selectionStart ) + pair  + input.value.substring(input.selectionEnd )
          input.value = code;
          input.selectionStart = cursorPosition;
          input.selectionEnd = cursorPosition;
          this.onInput(code)
        }
        else
        if (/(\)|]|})/m.test(e.key) && /(\)|]|})/m.test(input.value.charAt(cursorPosition )) && e.key == input.value.charAt(cursorPosition )){
          let code = input.value.substring(0 , input.selectionStart) +  input.value.substring(input.selectionEnd + 1)
          input.value = code;
          input.selectionStart = cursorPosition;
          input.selectionEnd = cursorPosition;
          this.onInput(code)
        }
      }
      else{
      }
    }
  }

  syntaxHighlighting(lines : string[]) : string[]{
    let numberRegex = /\b(?<![.=])(\d+(\_?\d+)*)(\.\d+(\_?\d+)*)?([FfLl])?(?![.=])\b/g
    let primitiveRegex = /\b(byte|short|char|int|long|float|double|boolean)\b/g
    let accessRegex = /\b(public|private|protected|static|final)\b/g

    for (let i = 0 ; i < lines.length ; i++ ){

      lines[i] = lines[i].replace("&" , "&amp;")
      let line = lines[i].split(/[ \s\t{}()\[\]\,\;]/g)

      let divHolders = []

      for (let j = 0 ; j < line.length ; j++ ){
        if (/\b(?<![.])(\d+(\_?\d+)*)(\.\d+(\_?\d+)*)?([FfLl])?(?![.])\b/g.test(line[j])){
          divHolders.push(`<strong class = "number">${line[j]}</strong>`)
        }
        else
        if (/\b(byte|short|char|int|long|float|double|boolean)\b/g.test(line[j])){
          divHolders.push(`<strong class = "primitive">${line[j]}</strong>`)

        }
        else
        if (/\b(public|private|protected|static|final)\b/g.test(line[j])){
          divHolders.push(`<strong class = "access">${line[j]}</strong>`)

        }
      }

      lines[i] = lines[i].replaceAll( accessRegex, `&div&`);
      lines[i] = lines[i].replaceAll( primitiveRegex , `&div&`);
      lines[i] = lines[i].replaceAll( numberRegex , `&div&`);

      lines[i] = lines[i].replaceAll(/(\t)/gm , "&nbsp;&nbsp;&nbsp;&nbsp;")
      lines[i] = lines[i].replaceAll(/[\s]/gm , "&nbsp;")

      for (let j = 0 ; j < divHolders.length ; j++ ){
        lines[i] = lines[i].replace("&div&" , divHolders[j])
      }
    }

    return lines
  }

  indent(e){
    if (typeof document !== 'undefined') {
      e.preventDefault();
      let input = document.getElementById('textIn') as HTMLTextAreaElement ;
      let cursorPosition = input.selectionStart + 1;
      let code = input.value.substring(0 , input.selectionStart).split("\n")


      let lastLine = code[code.length - 1]
      if (/[\S]/m.test(lastLine)){
        lastLine = lastLine.trimEnd();
      }


      this.tabLevel = lastLine.split("\t").length - 1 ;

      console.log(lastLine.charAt(lastLine.length-1))
      if (lastLine.charAt(lastLine.length-1) == "{"){
        this.tabLevel++
      }

      let tabs = ""
      for (let i = 0 ; i < this.tabLevel ; i++ ){
        tabs += "\t"
      }
      if (input.value.charAt(input.selectionStart) == '}'){
        input.value = input.value.substring(0 , input.selectionStart )  + "\n"+tabs + "\n" + tabs.substring(0 , tabs.length - 1)+input.value.substring(input.selectionEnd );
      }
      else{
        input.value = input.value.substring(0 , input.selectionStart )  + "\n"+tabs + input.value.substring(input.selectionEnd );

      }
      input.selectionStart = cursorPosition + this.tabLevel ;
      input.selectionEnd = cursorPosition + this.tabLevel;

      this.onInput(input.value)
      this.determineLineNo(input.value)

    }
  }

  sendCode(){
    this.codeEmitter.emit(this.textValue)
  }

  toggleConsole(consoleTab : string){
    if (this.currentConsole == ""){
      this.currentConsole = consoleTab;
      const show = true;
      const console = this.currentConsole;
      this.showConsoleChange.emit({ show , console});
    }
    else{
      if (consoleTab != this.currentConsole){
        this.currentConsole = consoleTab;
        const show = true;
        const console = this.currentConsole;
        this.showConsoleChange.emit({ show , console});
      }
      else{
        this.currentConsole = "" ;
        const show = false;
        const console = this.currentConsole;
        this.showConsoleChange.emit({ show , console});
      }
    }
  }
}

if(typeof document !== 'undefined'){
  document.addEventListener('DOMContentLoaded' ,
    () => {
      const textInArea = document.getElementById('textIn')
      const textOutArea = document.getElementById('textOut')
      const lineBody = document.getElementById('lineBody')

      if (textInArea != null){
        textInArea.addEventListener('scroll' , () => {
          textOutArea.scrollTop = textInArea.scrollTop
          textOutArea.scrollLeft = textInArea.scrollLeft
          lineBody.scrollTop = textOutArea.scrollTop
        })
      }
    })
}
