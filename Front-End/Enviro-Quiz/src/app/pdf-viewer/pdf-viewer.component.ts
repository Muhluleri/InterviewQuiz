import { Component, OnInit } from '@angular/core';
import { PdfService } from './service/pdf.service';

@Component({
  selector: 'pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css'
})
export class PdfViewerComponent{

  pdfData: Blob

  constructor(private pdfService : PdfService){

  }



}
