package com.enivro.quiz.mapping;

import com.enivro.quiz.dto.ResultDTO;
import com.enivro.quiz.model.Result;
import com.google.gson.Gson;
import org.springframework.stereotype.Component;

@Component
public class ResultMapper {

    public Result mapResultToDomain(ResultDTO resultDTO){

        Gson gson = new Gson();
        Result result = gson.fromJson(resultDTO.getResult() , Result.class) ;

        return result ;
    }

    public ResultDTO mapResultToDTO(Result result){

        Gson gson = new Gson();

        ResultDTO resultDTO = new ResultDTO() ;

        resultDTO.setResult(gson.toJson(result));

        return resultDTO ;
    }
}
