package com.enivro.quiz.service.assessment;

import com.enivro.quiz.dto.ApplicantDTO;
import com.enivro.quiz.mapping.AnswerMapper;
import com.enivro.quiz.mapping.ApplicantMapper;
import com.enivro.quiz.mapping.AssessmentMapper;
import com.enivro.quiz.model.Applicant;
import com.enivro.quiz.model.Assessment;
import com.enivro.quiz.repositories.AnswerRepository;
import com.enivro.quiz.repositories.ApplicantRepository;
import com.enivro.quiz.repositories.AssessmentRepository;
import com.enivro.quiz.service.assessment.request.AssessmentRequest;
import com.enivro.quiz.service.assessment.response.AssessmentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AssessmentServiceImpl implements AssessmentService{

    private final AssessmentRepository assessmentRepository ;
    private final AssessmentMapper assessmentMapper ;
    private final ApplicantRepository applicantRepository ;
    private final ApplicantMapper applicantMapper ;
    private final AnswerMapper answerMapper ;
    private final AnswerRepository answerRepository ;


    @Override
    public AssessmentResponse compileAssessment(AssessmentRequest assessmentRequest) {


        AssessmentResponse assessmentResponse = new AssessmentResponse();

        Assessment assessment = null;

        try{
            assessment = assessmentMapper.mapAssessmentToDomain(assessmentRequest.getAssessment()) ;
            assessment = assessmentRepository.save(assessment) ;
        }catch (RuntimeException e){
            e.printStackTrace();
            assessmentResponse.setMessage("Something went wrong with the upload");
            assessmentResponse.setId(-2);
            return assessmentResponse ;

        }

        assessmentResponse.setMessage("Assessment successfully uploaded to database");
        assessmentResponse.setId(assessment.getId());


        return assessmentResponse;
        
    }

    @Override
    public List<String> assignAssessment(String position, String level,
                                         String firstName, String lastName) {

        Applicant applicant = new Applicant() ;

        applicant.setFirstName(firstName);
        applicant.setLastName(lastName);

        UUID uuid = UUID.randomUUID();

        if (applicantRepository.findApplicantByUUID(uuid.toString()).isEmpty())
            applicant.setUuid(uuid.toString());

        applicant.setAssessment(assessmentRepository.findAssessmentByPositionAndLevel(position , level).get(0));

        applicant = applicantRepository.save(applicant) ;

        List<String> applicantDetails = new ArrayList<>();


        applicantDetails.add(applicant.getFirstName());
        applicantDetails.add(applicant.getLastName());
        applicantDetails.add(applicant.getUuid());
        applicantDetails.add(applicant.getAssessment().getLevel());
        applicantDetails.add(applicant.getAssessment().getPosition());


        return applicantDetails;
    }

    @Override
    public ApplicantDTO getApplicantAssessment(String uuid) {

        Applicant applicant = applicantRepository.findApplicantByUUID(uuid).orElseThrow() ;
        return applicantMapper.mapApplicantToDTO(applicant);
    }

    @Override
    public String setTimeForApplicant(String uuid, ZonedDateTime start) {

        try{
            Applicant applicant = applicantRepository.findApplicantByUUID(uuid).get();
            if (Objects.isNull(applicant.getStart())){
                applicant.setStart(start);
                applicant.setEnd(start.plus(applicant.getAssessment().getAllocatedTime()));
                applicantRepository.save(applicant);
            }
            else return "Timer already set" ;


        }catch (RuntimeException e){
            return "Failed to set start" ;
        }

        return "Successfully set start";
    }

    @Override
    public String saveAssessmentState(ApplicantDTO applicantDTO) {

        Applicant applicant = applicantMapper.mapApplicantToDomain(applicantDTO);
        Applicant applicantToSave = applicantRepository.findApplicantByUUID(applicant.getUuid()).get();

        if (applicantToSave.getAnswers().isEmpty()){
            applicantToSave.setAnswers(applicant.getAnswers());
            answerRepository.saveAll(applicant.getAnswers());
        }
        else{
            for( var i = 0 ; i < applicantToSave.getAnswers().size() ; i++){
                for (var j = 0 ; j < applicant.getAnswers().size() ; j++)
                    if (applicantToSave.getAnswers().get(i).getQuestion().getUuid()
                            .equals(applicant.getAnswers().get(j).getQuestion().getUuid()))
                        applicantToSave.getAnswers().get(i).setAnswer(applicant.getAnswers().get(j).getAnswer());
            }
            answerRepository.saveAll(applicantToSave.getAnswers());
        }

        applicantRepository.save(applicantToSave);

        return "Saved Current Answers";
    }


}
