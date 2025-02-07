package com.enivro.quiz.service.code;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CodeServiceImpl implements CodeService {

    private final Gson gson ;

    public String[] executeScenarios(String answer , String[] parameters){

        var results = new ArrayList<String>();
        var arrResults = new String[0];

        for (var parameterSet : parameters){
            results.add(executeCode(answer , parameterSet.split(",")));
        }
        return results.toArray(arrResults);
    }

    public String executeCode(String answer , String[] parameters){

        var keyActions = compileMethod(answer , parameters);

        try{
            File file = new File("Main.java");

            try(FileWriter fileWriter = new FileWriter(file)){
                fileWriter.write( keyActions[0]);
            }

            //"javac Main.java"
            Process compile = Runtime.getRuntime().exec(keyActions[1]);
            compile.waitFor();


            if (compile.exitValue() != 0 ){
                BufferedReader outReader = new BufferedReader(new InputStreamReader(compile.getErrorStream()));
                var compileError = new String();
                var line = new String();

                while ( (line = outReader.readLine()) != null)
                    compileError = compileError.concat(line).concat("\n");

                return compileError;
            }

            String run = "java Main " ;

            Process runProcess = Runtime.getRuntime().exec(keyActions[2]);
            runProcess.waitFor() ;

            var outReader = new BufferedReader(new InputStreamReader(runProcess.getInputStream()));
            var errReader = new BufferedReader(new InputStreamReader(runProcess.getErrorStream()));

            var output = new String() ;
            String line ;

            while ((line = outReader.readLine()) != null)
                output = output.concat(line).concat("\n");

            while ((line = errReader.readLine()) != null)
                output = output.concat(line).concat("\n");

            return output;
        }catch (IOException | InterruptedException e){

            return "Compilation error"  ;
        }

    }

    private String[] compileMethod(String answer , String[] par) {

        var actions = new String[3] ;

        for (var i = 0 ; i < par.length ; i++){
            par[i] = par[i].replaceAll("©" , ",");
        }

        actions[1] = "javac Main.java";
        actions[2] = "java Main ";
        for (var parameter : par){
            if (parameter.split(" ").length > 1 && !parameter.contains("\""))
                actions[2] += "\"%s\" ".formatted(parameter);
            else{
                actions[2] += "%s ".formatted(parameter);
            }
        }
        var coverCode = "";

        if (answer.contains("public static void main")){
            actions[0] = """
                public class Main{
                    %s 
                }
                """.formatted(answer);
        }
        else{
            var methodParts = new String[0];
            var methodName = "";
            var methodWithPar = "" ;
            if (answer.length() > 0 ){
                methodParts = answer.substring(0 , answer.indexOf("(")).split(" ");
                methodName = methodParts[methodParts.length -1];

                if (answer.indexOf("(") > 0 && answer.indexOf(")") > 0 ){
                    var parameters = answer.substring(answer.indexOf("(") + 1, answer.indexOf(")")) ;

                    if(parameters.trim().length() > 0){
                        methodWithPar = par[0] ;
                        for (var i = 1 ; i < par.length ; i++){
                            methodWithPar += ", %s".formatted(par[i]);
                        }

                        methodWithPar = "%s(%s)".formatted(methodName , methodWithPar);
                    }
                    else{
                        methodWithPar = "%s()".formatted(methodName);
                    }
                }

                if (answer.contains("void")){
                    actions[0] = """
                    public class Main{
                        public static void main(String args[]){
                            new Main().%s ; 
                        }
                        
                        %s
                    }
                    """.formatted(methodWithPar , answer);
                }else {
                    actions[0] = """
                    public class Main{
                        public static void main(String args[]){
                            var i = new Main().%s ;
                            System.out.println(i) ; 
                        }
                        
                        %s
                    }
                    """.formatted(methodWithPar , answer);
                }


            }
            else {
                methodWithPar = "(Object) null" ;

                actions[0] = """
                    public class Main{
                        public static void main(String args[]){
                            var i = %s ;
                            System.out.println(i) ; 
                        }
                        
                        %s
                    }
                    """.formatted(methodWithPar , answer);
            }






        }



        return actions ;

    }
}
