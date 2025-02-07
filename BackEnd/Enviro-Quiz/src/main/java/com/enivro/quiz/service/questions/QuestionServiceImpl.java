package com.enivro.quiz.service.questions;

import com.enivro.quiz.dto.QuestionsDTO;
import com.enivro.quiz.mapping.QuestionMapper;
import com.enivro.quiz.model.questions.Questions;
import com.enivro.quiz.repositories.QuestionRepository;
import com.enivro.quiz.service.questions.request.QuestionRequest;
import com.enivro.quiz.service.questions.response.QuestionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService{

    private final QuestionRepository questionRepository ;
    private final QuestionMapper questionMapper ;

    @Override
    public List<QuestionsDTO> getAllQuestions() {

        List<Questions> questions = questionRepository.findAll() ;

        List<QuestionsDTO> questionsDTOS = new ArrayList<>();

        questions.forEach((question) -> questionsDTOS.add(questionMapper.mapQuestionsToDTO(question)));

        return questionsDTOS;
    }

    @Override
    public List<QuestionsDTO> getSectionQuestions(int section) {

        List<Questions> questions = questionRepository.getQuestionsBySection(section);

        List<QuestionsDTO> questionsDTOS = new ArrayList<>();

        questions.forEach((question) -> questionsDTOS.add(questionMapper.mapQuestionsToDTO(question)));

        return questionsDTOS ;
    }

    @Override
    public QuestionResponse uploadQuestions(QuestionRequest questionRequest) {

        QuestionResponse questionResponse = new QuestionResponse();

        QuestionsDTO questionsDTO = questionRequest.getQuestion();

        Questions questions ;

        try{
            questions = questionMapper.mapQuestionsToDomain(questionsDTO);
            questions = questionRepository.save(questions) ;
        }
        catch(RuntimeException e){
            e.printStackTrace();
            questionResponse.setMessage("Something went wrong when uploading questions");
            questionResponse.setId(1);
            return questionResponse;
        }

        questionResponse.setId(questions.hashCode());
        questionResponse.setMessage("Successfully uploaded question to database");
        return questionResponse ;

    }

}
