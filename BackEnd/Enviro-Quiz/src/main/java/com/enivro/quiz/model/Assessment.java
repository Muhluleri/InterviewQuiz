package com.enivro.quiz.model;


import com.enivro.quiz.model.questions.Questions;
import com.google.gson.annotations.Expose;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.File;
import java.time.Duration;
import java.util.List;

@Entity(name = "Assessment")
@Getter
@Setter
public class Assessment {

    @Id
    @SequenceGenerator(name = "assessment_id" , sequenceName = "assessment_id_gen")
    @GeneratedValue(generator = "assessment_id_gen")
    @Expose
    private long id ;

    @Expose
    private String position ;

    @Expose
    private String level ;

    private Duration allocatedTime ;


    @Expose
    @ManyToMany
    private List<Questions> questions ;




}
