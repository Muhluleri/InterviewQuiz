package com.enivro.quiz.mapping;

import com.enivro.quiz.dto.ApplicantDTO;
import com.enivro.quiz.model.Applicant;
import com.enivro.quiz.model.Assessment;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class ApplicantMapper {

    private final AssessmentMapper assessmentMapper ;
    private final QuestionMapper questionMapper ;
    private final AnswerMapper answerMapper ;
    private final ResultMapper resultMapper ;

    public Applicant mapApplicantToDomain(ApplicantDTO applicantDTO){

        Applicant applicant = new Applicant();

        applicant.setFirstName(applicantDTO.getFirstName());
        applicant.setLastName(applicantDTO.getLastName());
        applicant.setUuid(applicantDTO.getUuid());
        applicant.setStart(applicantDTO.getStart());
        applicant.setEnd(applicantDTO.getEnd());
        applicant.setAssessment(assessmentMapper.mapAssessmentToDomain(applicantDTO.getAssessmentDTO()));
        applicant.setAnswers(answerMapper.mapAnswersToDomain(applicantDTO.getAnswerDTO()));
        if(Objects.nonNull(applicant.getResult()))
            applicant.setResult(resultMapper.mapResultToDomain(applicantDTO.getResultDTO()));

        return applicant ;
    }

    public ApplicantDTO mapApplicantToDTO(Applicant applicant) {

        ApplicantDTO  applicantDTO = new ApplicantDTO();
        
        applicantDTO.setFirstName(applicant.getFirstName());
        applicantDTO.setLastName(applicant.getLastName());
        applicantDTO.setUuid(applicant.getUuid());
        applicantDTO.setStart(applicant.getStart());
        applicantDTO.setEnd(applicant.getEnd());
        applicant.getAssessment().getQuestions().forEach(question -> questionMapper.mapQuestionFromFileToString(question));

        applicantDTO.setAssessmentDTO(assessmentMapper.mapAssessmentToDTO(applicant.getAssessment()));
        applicantDTO.setAnswerDTO(answerMapper.mapAnswersToDTO(applicant.getAnswers()));
        applicantDTO.setResultDTO(resultMapper.mapResultToDTO(applicant.getResult()));

        return applicantDTO ;

    }

}
