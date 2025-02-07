import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css'
})
export class PdfViewerComponent {

  @Input() pdfInfo :string ;
  temp = 'https://ptgmedia.pearsoncmg.com/images/9780137993642/samplepages/9780137993642_Sample.pdf'
  pdfData :any

  constructor(private sanitizer : DomSanitizer){
    if (this.pdfInfo !== undefined){

      this.pdfData = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfInfo)
    }
    else
    {
      this.pdfData = this.sanitizer.bypassSecurityTrustResourceUrl('')
    }


    console.log('over here : ' + this.pdfInfo)
  }


}
