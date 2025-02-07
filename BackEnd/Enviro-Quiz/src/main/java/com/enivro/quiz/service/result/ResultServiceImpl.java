package com.enivro.quiz.service.result;

import com.enivro.quiz.mapping.ApplicantMapper;
import com.enivro.quiz.model.Answers;
import com.enivro.quiz.model.Applicant;
import com.enivro.quiz.model.Result;
import com.enivro.quiz.model.questions.types.CodingQuestions;
import com.enivro.quiz.model.questions.types.MultipleChoiceQuestions;
import com.enivro.quiz.repositories.ApplicantRepository;
import com.enivro.quiz.repositories.QuestionRepository;
import com.enivro.quiz.repositories.ResultRepository;
import com.enivro.quiz.service.code.CodeService;
import com.enivro.quiz.service.result.request.SubmitRequest;
import com.enivro.quiz.service.result.response.SubmitResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService{

    private final ApplicantMapper applicantMapper ;
    private final CodeService codeService ;
    private final QuestionRepository questionRepository ;
    private final ResultRepository resultRepository ;
    private final ApplicantRepository applicantRepository ;

    @Override
    public SubmitResponse calculateResult(SubmitRequest submitRequest) {

        SubmitResponse submitResponse = new SubmitResponse() ;

        Applicant applicant = applicantMapper.mapApplicantToDomain(submitRequest.getApplicantDTO());

        var codingTotal = 0.0 ;
        var codingGained = 0.0 ;

        var multiTotal = 0.0 ;
        var multiGained = 0.0 ;


        List<Answers> answers =  applicant.getAnswers();

        for(var answer : answers){
            switch (answer.getQuestion().getSection()){
                case CODING -> {
                    var cq = (CodingQuestions) questionRepository.getQuestionByUUID(answer.getQuestion().getUuid()).get();
                    codingTotal += cq.getScenarios().size() ;

                    var scenarios = cq.getScenarios().toArray(new String[cq.getScenarios().size()]);
                    var applicantAnswers = (String[]) null ;
                    if (answer.getAnswer().size() > 0)
                        applicantAnswers = codeService.executeScenarios(answer.getAnswer().get(0) , scenarios);
                    var testedAnswers = cq.getTestedOutputs().toArray(new String[scenarios.length]);

                    if (Objects.nonNull(applicantAnswers))
                        for (var i = 0 ; i < cq.getScenarios().size() ; i++)
                            if (applicantAnswers[i].equals(testedAnswers[i]))
                                codingGained += 1 ;
                }

                case MULTIPLE_CHOICE -> {
                    var mcq = (MultipleChoiceQuestions) questionRepository.getQuestionByUUID(answer.getQuestion().getUuid()).get() ;

                    multiTotal++ ;

                    var totalOptions = mcq.getCorrectOptions().size() ;
                    var totalCorrect = 0 ;

                    for (var option : answer.getAnswer())
                        if (mcq.getCorrectOptions().contains(option))
                            totalCorrect += 1 ;

                    if (totalOptions == totalCorrect)
                        multiGained++ ;


                }

                default -> {
                    //Do nothing
                }
            }
        }

        Result result = new Result() ;

        submitResponse.setCodingResult(codingGained/codingTotal);
        submitResponse.setMultiplechoiceResult(multiGained/multiTotal);

        UUID uuid = UUID.randomUUID() ;

        result.setUuid(uuid.toString()) ;
        result.setCodingResult(submitResponse.getCodingResult());
        result.setMultiplechoiceResult(submitResponse.getMultiplechoiceResult());

        var applicantToSave = applicantRepository.findApplicantByUUID(applicant.getUuid()).get();

        if (Objects.nonNull(applicantToSave.getResult()))
            return submitResponse ;

        applicantToSave.setResult(result);
        applicantToSave.setEnd(applicant.getEnd());

        resultRepository.save(result) ;
        applicantRepository.save(applicantToSave);

        return submitResponse;
    }
}
