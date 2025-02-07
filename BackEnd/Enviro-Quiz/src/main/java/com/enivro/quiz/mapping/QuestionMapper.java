package com.enivro.quiz.mapping;

import com.enivro.quiz.dto.QuestionsDTO;
import com.enivro.quiz.model.questions.Questions;
import com.enivro.quiz.model.questions.Section;
import com.enivro.quiz.model.questions.types.CodingQuestions;
import com.enivro.quiz.model.questions.types.MultipleChoiceQuestions;
import com.enivro.quiz.model.questions.types.WrittenQuestions;
import com.enivro.quiz.repositories.QuestionRepository;
import com.enivro.quiz.service.file.FileService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class QuestionMapper {

    private final FileService fileService ;
    private final QuestionRepository questionRepository ;

    public QuestionsDTO mapQuestionsToDTO(Questions question){

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create() ;

        QuestionsDTO questionsDTO = new QuestionsDTO() ;

        question.setQuestion(fileService.convertFileToBase64(question.getQuestionFile()));
        question.setQuestionFile(null);

        switch(question){
            case CodingQuestions cQ ->{
                questionsDTO.setType(Section.CODING);
                questionsDTO.setQuestion(gson.toJson(cQ));
            }
            case MultipleChoiceQuestions mcQ -> {
                questionsDTO.setType(Section.MULTIPLE_CHOICE);
                questionsDTO.setQuestion(gson.toJson(mcQ));
            }
            case WrittenQuestions wQ -> {
                questionsDTO.setType(Section.WRITTEN);
                questionsDTO.setQuestion(gson.toJson(wQ));
            }
            default -> throw new RuntimeException("Invalid question for mapping submitted");
        }

        return questionsDTO;

    }

    public Questions mapQuestionsToDomain(QuestionsDTO questionsDTO){

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create() ;

        var Question = switch (questionsDTO.getType()){

            case CODING -> {
                CodingQuestions question = gson.fromJson(questionsDTO.getQuestion() , CodingQuestions.class);
                question.setSection(Section.CODING);
                yield question ;}
            case MULTIPLE_CHOICE-> {
                MultipleChoiceQuestions question = gson.fromJson(questionsDTO.getQuestion() , MultipleChoiceQuestions.class);
                question.setSection(Section.MULTIPLE_CHOICE);
                yield question ; }
            case WRITTEN -> {
                WrittenQuestions question = gson.fromJson(questionsDTO.getQuestion() , WrittenQuestions.class);
                question.setSection(Section.WRITTEN);
                yield question;
            }

        };

        while (true){
            var uuid = UUID.randomUUID().toString() ;
            if(questionRepository.getQuestionByUUID(uuid).isEmpty()){
                Question.setUuid(uuid);
                break;
            }
        }

        Question.setQuestionFile(fileService.convertBase64ToFile(
                                                                Question.getQuestion() ,
                                    Question.getSection() + Question.getUuid() + ".pdf"));



        Question.setQuestion(null);

        return Question ;


    }


    public Questions mapQuestionFromFileToString(Questions question){

        question.setQuestion(fileService.convertFileToBase64(question.getQuestionFile()));
        question.setQuestionFile(null);

        return question ;
    }



}
