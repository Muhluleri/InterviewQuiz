package com.enivro.quiz.model.questions.types;

import com.enivro.quiz.model.questions.Questions;
import com.google.gson.annotations.Expose;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@DiscriminatorValue("Coding")
public class CodingQuestions extends Questions {

    @Expose
    private List<String> scenarios;

    @Expose
    private String testedCode ;

    @Expose
    private List<String> testedOutputs ;

    @Expose
    private List<Boolean> passed ;


}
