package com.enivro.quiz.model.questions.types;

import com.enivro.quiz.model.questions.Questions;
import com.google.gson.annotations.Expose;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@DiscriminatorValue("Multiple Choice")
public class MultipleChoiceQuestions extends Questions {

    @Expose
    private List<String> options ;

    @Expose
    private List<String> correctOptions ;

}
