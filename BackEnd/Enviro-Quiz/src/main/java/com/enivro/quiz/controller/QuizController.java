package com.enivro.quiz.controller;

import com.enivro.quiz.dto.ApplicantDTO;
import com.enivro.quiz.dto.QuestionsDTO;
import com.enivro.quiz.service.assessment.AssessmentService;
import com.enivro.quiz.service.assessment.request.AssessmentRequest;
import com.enivro.quiz.service.assessment.response.AssessmentResponse;
import com.enivro.quiz.service.code.CodeService;
import com.enivro.quiz.service.questions.QuestionService;
import com.enivro.quiz.service.questions.request.QuestionRequest;
import com.enivro.quiz.service.questions.response.QuestionResponse;
import com.enivro.quiz.service.result.ResultService;
import com.enivro.quiz.service.result.request.SubmitRequest;
import com.enivro.quiz.service.result.response.SubmitResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class QuizController {

    private final AssessmentService assessmentService ;
    private final QuestionService questionService ;
    private final CodeService codeService ;
    private final ResultService resultService ;

    @PostMapping("save/assessment")
    public String saveStateOfAssessment(@RequestBody ApplicantDTO applicantDTO){
        return assessmentService.saveAssessmentState(applicantDTO );
    }

    @PostMapping("/{uuid}/start")
    public String setStartTimeForApplicant(@PathVariable String uuid , @RequestBody ZonedDateTime start){
        return assessmentService.setTimeForApplicant(uuid , start) ;
    }

    @GetMapping("/{name}/{lastName}/{uuid}")
    public ResponseEntity<ApplicantDTO> getApplicantAssessment(@PathVariable String uuid){
        return new ResponseEntity<>(assessmentService.getApplicantAssessment(uuid) , HttpStatus.OK);
    }

    @GetMapping("/{firstName}/{lastName}/{position}/{level}")
    public ResponseEntity<List<String>> assignAssesssment( @PathVariable String position , @PathVariable String level ,
                                                                 @PathVariable String firstName , @PathVariable String lastName){
        return new ResponseEntity<>(assessmentService.assignAssessment(position , level , firstName ,lastName) , HttpStatus.OK);
    }

    @PostMapping("/upload/question")
    public QuestionResponse uploadQuestionToStorage(@RequestBody QuestionRequest questionRequest){
        return questionService.uploadQuestions(questionRequest);
    }

    @PostMapping("/upload/assessment")
    public AssessmentResponse uploadAssessmentToStorage(@RequestBody AssessmentRequest assessment){
        return assessmentService.compileAssessment(assessment) ;
    }

    @GetMapping("/getQuestions")
    public List<QuestionsDTO> getQuestions(){
        return questionService.getAllQuestions() ;
    }

    @GetMapping("/execute")
    public String[] executeCode(@RequestParam String answer , @RequestParam String parameters){
        return codeService.executeScenarios(answer , parameters.split("®"));
    }

    @PostMapping("/submit")
    public ResponseEntity<SubmitResponse> submitApplicantAssessment(@RequestBody SubmitRequest submitRequest){
        return ResponseEntity.ok(resultService.calculateResult(submitRequest));
    }

}
