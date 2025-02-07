package com.enivro.quiz.service.result;

import com.enivro.quiz.service.result.request.SubmitRequest;
import com.enivro.quiz.service.result.response.SubmitResponse;

import java.util.List;
import java.util.Map;

public interface ResultService {

    public SubmitResponse calculateResult(SubmitRequest submitRequest);
}
