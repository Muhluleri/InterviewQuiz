package com.enivro.quiz.repositories;

import com.enivro.quiz.model.Answers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerRepository extends JpaRepository<Answers , Long> {

}
