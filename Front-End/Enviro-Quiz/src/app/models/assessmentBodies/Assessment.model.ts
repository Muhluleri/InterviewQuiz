import { Answer } from "../answerBodies/Answer.model";
import { Question } from "../questionBodies/Question.body";

export class Assessment{

    position : string ;

    level : string ;

    allocatedTime : string ;

    duration : number ;


    questions : Question[] = [] ;

    result : number ;

    constructor(){

    }


}
