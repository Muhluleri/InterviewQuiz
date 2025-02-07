package com.enivro.quiz.service.file;

import jakarta.xml.bind.DatatypeConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements  FileService {


    @Override
    public File convertBase64ToFile(String base64 , String fileName) {

        byte[] data = Base64.getDecoder().decode(base64);

        File file = new File(fileName);

        try(BufferedOutputStream outputStream = new BufferedOutputStream(new FileOutputStream(file))){
            outputStream.write(data);

        }catch (IOException e){
            e.printStackTrace();
        }

        return file;
    }

    @Override
    public String convertFileToBase64(File file) {

        byte[] data =  null ;

        try(BufferedInputStream inputStream = new BufferedInputStream(new FileInputStream(file))){
            data = inputStream.readAllBytes() ;
        }catch (IOException e){
            e.printStackTrace();
        }



        String base64 = Base64.getEncoder().encodeToString(data);

        return base64;
    }
}
