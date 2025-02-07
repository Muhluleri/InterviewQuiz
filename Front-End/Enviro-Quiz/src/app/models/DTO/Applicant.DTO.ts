import {AssessmentDTO} from "./Assessment.DTO";
import {AnswerDTO} from "./Answer.DTO";
import {ResultDTO} from "./ResultDTO.model";

export class ApplicantDTO{
  uuid : string;

  firstName : string;

  lastName : string;

  start : Date = null ;

  end : Date = null ;

  assessmentDTO : AssessmentDTO ;

  answerDTO : AnswerDTO ;

  resultDTO : ResultDTO ;
}
