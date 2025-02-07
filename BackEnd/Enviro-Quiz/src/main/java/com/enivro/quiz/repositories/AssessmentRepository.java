package com.enivro.quiz.repositories;

import com.enivro.quiz.model.Applicant;
import com.enivro.quiz.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment , Long> {

    @Query(value = "SELECT * FROM assessment where position = ? and level = ? " , nativeQuery = true)
    public List<Assessment> findAssessmentByPositionAndLevel(String position , String Level);
}
