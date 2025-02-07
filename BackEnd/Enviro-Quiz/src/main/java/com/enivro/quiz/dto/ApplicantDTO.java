package com.enivro.quiz.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Getter
@Setter
public class ApplicantDTO {

    private String uuid ;

    private String firstName ;

    private String lastName ;

    private ZonedDateTime start ;

    private ZonedDateTime end ;

    private AssessmentDTO assessmentDTO ;

    private AnswerDTO answerDTO ;

    private ResultDTO resultDTO ;

}
