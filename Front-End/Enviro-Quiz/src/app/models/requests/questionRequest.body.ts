import { QuestionDTO } from "../DTO/Question.DTO";
import { Question } from "../questionBodies/Question.body";

export class QuestionRequest{

    question : QuestionDTO

    constructor() {

        this.question = new QuestionDTO()
    }
}