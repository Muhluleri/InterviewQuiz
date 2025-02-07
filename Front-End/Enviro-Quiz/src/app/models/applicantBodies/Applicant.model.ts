import {Assessment} from "../assessmentBodies/Assessment.model";
import {Answer} from "../answerBodies/Answer.model";
import {Result} from "../results/result.model";

export class Applicant{

  uuid : string = "";

  firstName : string = "";

  lastName : string ="";

  start : Date = null;

  end : Date = null;

  assessment : Assessment=  new Assessment() ;

  answers : Answer[]= [];

  result : Result = new Result() ;

  constructor() {
  }
}
