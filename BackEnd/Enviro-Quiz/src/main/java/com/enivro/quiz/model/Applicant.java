package com.enivro.quiz.model;


import com.google.gson.annotations.Expose;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Applicant {

    @Id
    @SequenceGenerator(name = "applicant_id" , sequenceName = "applicant_id_gen")
    @GeneratedValue(generator = "applicant_id_gen")
    private long id ;

    private String uuid ;

    private String firstName ;

    private String lastName ;

    private ZonedDateTime start  ;

    @Column(name = "end_time")
    private ZonedDateTime end ;

    @ManyToOne
    private Assessment assessment ;

    @ManyToMany
    private List<Answers> answers ;

    @OneToOne
    private Result result ;




}
