import { Section } from "./section.enum";

export class Question{

    question : string ;

    questionFile = null ;

    section : Section ;

    hasFile : boolean ;

    uuid : string ;

    constructor(){
        this.hasFile = false ;
    }
}
