package com.enivro.quiz.service.questions;

import com.enivro.quiz.dto.QuestionsDTO;
import com.enivro.quiz.model.questions.Questions;
import com.enivro.quiz.service.questions.request.QuestionRequest;
import com.enivro.quiz.service.questions.response.QuestionResponse;

import java.util.List;

public interface QuestionService {

    public List<QuestionsDTO> getAllQuestions() ;

    public List<QuestionsDTO> getSectionQuestions(int section) ;

    public QuestionResponse uploadQuestions(QuestionRequest questionRequest) ;


}
