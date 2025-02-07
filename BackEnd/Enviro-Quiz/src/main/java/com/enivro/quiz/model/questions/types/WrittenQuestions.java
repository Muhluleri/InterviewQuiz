package com.enivro.quiz.model.questions.types;

import com.enivro.quiz.model.questions.Questions;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
@DiscriminatorValue("Written")
public class WrittenQuestions extends Questions {


}