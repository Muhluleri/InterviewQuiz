package com.enivro.quiz.dto;

import com.enivro.quiz.model.questions.Section;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionsDTO
{
    private Section type ;

    private String question;

}
