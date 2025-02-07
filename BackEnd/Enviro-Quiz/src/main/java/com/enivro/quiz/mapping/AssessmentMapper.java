package com.enivro.quiz.mapping;

import com.enivro.quiz.dto.AssessmentDTO;
import com.enivro.quiz.model.Assessment;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
@Component
@RequiredArgsConstructor
public class AssessmentMapper {

    public Assessment mapAssessmentToDomain(AssessmentDTO assessmentDTO){

        Assessment assessment = new Assessment();

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

        assessment = gson.fromJson(assessmentDTO.getAssessment() , Assessment.class);

        var assessmentString = assessmentDTO.getAssessment();
        if (assessmentString.indexOf("allocatedTime") > 0){
            var time = assessmentString.substring(assessmentString.indexOf("allocatedTime"));
            time = time.substring(time.indexOf("PT") , time.indexOf("M") + 1);
            assessment.setAllocatedTime(Duration.parse(time));
        }



        return assessment ;
    }

    public AssessmentDTO mapAssessmentToDTO(Assessment assessment ){

        AssessmentDTO assessmentDTO = new AssessmentDTO();

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

        assessmentDTO.setAssessment(gson.toJson(assessment));
        assessmentDTO.setDuration(assessment.getAllocatedTime().get(ChronoUnit.SECONDS));

        return assessmentDTO ;
    }
}
