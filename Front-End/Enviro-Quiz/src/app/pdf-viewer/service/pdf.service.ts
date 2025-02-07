import { HttpClient } from "@angular/common/http";
import { HtmlParser } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { blob } from "stream/consumers";

@Injectable({
    providedIn : 'root'
})
export class PdfService{

    constructor(private http : HttpClient){

    }

    getPDF(url) : Promise<Blob>{
        return this.http.get(url , {responseType : 'blob'}).toPromise()
    }
}