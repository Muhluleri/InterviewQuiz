package com.enivro.quiz.model;

import com.enivro.quiz.model.questions.Questions;
import com.google.gson.annotations.Expose;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity(name = "Answers")
@Getter
@Setter
public class Answers {

    @Id
    @SequenceGenerator(name = "answer_id" , sequenceName = "answer_id_gen")
    @GeneratedValue(generator = "answer_id_gen")
    private long id ;

    @Expose
    @ManyToOne
    private Questions question ;

    @Expose
    private List<String> answer ;


}
