package com.enivro.quiz.model.questions;

public enum Section {

    MULTIPLE_CHOICE("Multiple-choice") , CODING("Coding") , WRITTEN("Written") ;

    private String section ;

    Section(String section){
        this.section = section ;
    }

    @Override
    public String toString() {
        return section ;
    }
}
