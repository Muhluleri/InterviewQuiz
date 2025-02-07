package com.enivro.quiz.repositories;

import com.enivro.quiz.model.questions.Questions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Questions , Long> {

    @Query(value = "SELECT * FROM questions WHERE section = ?" , nativeQuery = true)
    public List<Questions> getQuestionsBySection(int section) ;

    @Query(value = "SELECT * FROM questions WHERE uuid = ?" , nativeQuery = true)
    public Optional<Questions> getQuestionByUUID(String UUID);
}
