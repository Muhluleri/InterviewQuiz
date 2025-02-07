package com.enivro.quiz.service.assessment;

import com.enivro.quiz.dto.AnswerDTO;
import com.enivro.quiz.dto.ApplicantDTO;
import com.enivro.quiz.dto.AssessmentDTO;
import com.enivro.quiz.service.assessment.request.AssessmentRequest;
import com.enivro.quiz.service.assessment.response.AssessmentResponse;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

public interface AssessmentService {

    AssessmentResponse compileAssessment(AssessmentRequest assessmentRequest) ;

    List<String> assignAssessment(String position , String level , String firstName , String lastName);

    ApplicantDTO getApplicantAssessment(String uuid);

    String setTimeForApplicant(String uuid , ZonedDateTime start);

    String saveAssessmentState(ApplicantDTO applicantDTO );
}
