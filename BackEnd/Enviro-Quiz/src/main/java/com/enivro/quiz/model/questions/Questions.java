package com.enivro.quiz.model.questions;

import com.google.gson.annotations.Expose;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.File;

@Entity(name = "Questions")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Getter
@Setter
public class Questions {

    @Id
    @SequenceGenerator(name = "question_id"  , sequenceName = "question_id_gen")
    @GeneratedValue(generator = "question_id_gen")
    @Expose
    private long id ;


    //Make Section an Object
    @Expose
    @Enumerated(EnumType.STRING)
    private Section section ;

    @Expose
    private String question ;

    private File questionFile ;

    @Expose
    private String uuid ;




}

