package com.enivro.quiz.mapping;


import com.enivro.quiz.dto.AnswerDTO;
import com.enivro.quiz.model.Answers;
import com.enivro.quiz.repositories.QuestionRepository;
import com.enivro.quiz.service.questions.QuestionService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AnswerMapper {

    public List<Answers> mapAnswersToDomain(AnswerDTO answerDTO){

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
        List<Answers> answers = new ArrayList<>() ;

        for( var answer : answerDTO.getAnswers())
            answers.add(gson.fromJson((String) answer, Answers.class));

        return answers ;

    }

    public AnswerDTO mapAnswersToDTO(List<Answers> answers){

        AnswerDTO answerDTO = new AnswerDTO() ;

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

        List<String> answerList = new ArrayList<>() ;

        for(var answer : answers)
            answerList.add(gson.toJson(answer));

        answerDTO.setAnswers(answerList);

        return answerDTO ;

    }
}
