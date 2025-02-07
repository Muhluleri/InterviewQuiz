package com.enivro.quiz.service.code;

public interface CodeService {
    public String executeCode(String answer , String[] parameters) ;

    public String[] executeScenarios(String answer , String[] parameters);
}
