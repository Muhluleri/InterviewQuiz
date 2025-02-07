package com.enivro.quiz.service.file;

import java.io.File;

public interface FileService {

    public File convertBase64ToFile(String base64 , String fileName);

    public String convertFileToBase64(File file);
}
