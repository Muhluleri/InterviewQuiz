package com.enivro.quiz.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "Result")
@Getter
@Setter
public class Result {


    @Id
    @SequenceGenerator(name = "result_id" , sequenceName = "result_id_gen")
    @GeneratedValue(generator = "result_id_gen")
    private long id ;

    private String uuid ;

    private double codingResult ;

    private double multiplechoiceResult ;


}
