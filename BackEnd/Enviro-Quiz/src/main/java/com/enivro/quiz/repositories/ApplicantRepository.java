package com.enivro.quiz.repositories;

import com.enivro.quiz.model.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant , Long> {

    @Query(value = "SELECT * FROM Applicant WHERE UUID = ?" , nativeQuery = true)
    public Optional<Applicant> findApplicantByUUID(String UUID);
}
