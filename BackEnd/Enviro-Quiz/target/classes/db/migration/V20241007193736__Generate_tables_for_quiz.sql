--ENTITY TABLES (BEGIN)
------------------------------------------------------------------------------------------------------
--Applicant Table
ALTER TABLE IF EXISTS Applicant DROP CONSTRAINT IF EXISTS FK_ApplicantResult ;
ALTER TABLE IF EXISTS Applicant DROP CONSTRAINT IF EXISTS FK_ApplicantAssessment ;
DROP TABLE IF EXISTS Applicant CASCADE ;
DROP sequence IF EXISTS applicant_id_gen ;
CREATE sequence applicant_id_gen START WITH 1 INCREMENT BY 50 ;

CREATE TABLE Applicant ( id BIGINT NOT NULL , uuid VARCHAR(255) , first_name VARCHAR(255) ,
                         last_name VARCHAR(255) , start TIMESTAMP(6) WITH TIME ZONE ,
                         assessment_id BIGINT NOT NULL , result_id BIGINT UNIQUE ,
                         PRIMARY KEY(id));

--End of Applicant Table

--Assessment Table
DROP TABLE IF EXISTS Assessment CASCADE ;
DROP sequence IF EXISTS assessment_id_gen ;
CREATE sequence assessment_id_gen START WITH 1 INCREMENT BY 50 ;

CREATE TABLE Assessment ( id BIGINT NOT NULL  , level VARCHAR(255) , position VARCHAR(255) ,
                          allocated_time NUMERIC(21 , 0), PRIMARY KEY(id)) ;

--End of Assessment Table

--Answer Table
ALTER TABLE IF EXISTS Answers DROP CONSTRAINT IF EXISTS FK_AnswerQuestion ;
DROP TABLE IF EXISTS Answers CASCADE ;
DROP sequence IF EXISTS answer_id_gen ;
CREATE sequence answer_id_gen START WITH 1 INCREMENT BY 50 ;

CREATE TABLE Answers ( id BIGINT NOT NULL , question_id BIGINT NOT NULL ,
                       answer text array , PRIMARY KEY(id)) ;

--End of Answer Table

--Result Table
DROP TABLE IF EXISTS Result CASCADE ;
DROP sequence IF EXISTS result_id_gen ;
CREATE sequence result_id_gen START WITH 1 INCREMENT BY 50 ;

CREATE TABLE Result ( id BIGINT NOT NULL , result NUMERIC(3,2) ,  PRIMARY KEY(id)) ;

--End Result Table

--Question Table
DROP TABLE IF EXISTS Questions CASCADE ;
DROP sequence IF EXISTS question_id_gen ;
CREATE sequence question_id_gen START WITH 1 INCREMENT BY 50;

CREATE TABLE Questions ( -- Parent Class / Written Questions
                        id BIGINT NOT NULL , question TEXT , question_file BYTEA ,
                        section VARCHAR(255) CHECK ( section IN ('MULTIPLE_CHOICE' , 'CODING' ,'WRITTEN'))
                        , uuid VARCHAR(255) , PRIMARY KEY(id) ,

                        --Classifying column
                         dtype VARCHAR(31) NOT NULL ,

                         -- Coding Questions
                         scenarios TEXT ARRAY , tested_code TEXT , tested_outputs TEXT ARRAY ,
                         passed BOOLEAN ,

                         -- Multiple-Choice Questions
                         options TEXT ARRAY , correct_options TEXT ARRAY
                         ) ;

--End of Question Table

-- (END)
------------------------------------------------------------------------------------------------------

-- ENTITY-RELATION TABLES (BEGIN)
-------------------------------------------------------------------------------------------------------

-- Assessment <-> Question Table
ALTER TABLE IF EXISTS Assessment_Questions DROP CONSTRAINT IF EXISTS FK_AssessmentsQuestions ;
ALTER TABLE IF EXISTS Assessment_Questions DROP CONSTRAINT IF EXISTS FK_QuestionsAssessments ;
DROP TABLE IF EXISTS Assessment_Questions CASCADE ;

CREATE TABLE Assessment_Questions (assessment_id BIGINT NOT NULL , questions_id BIGINT NOT NULL) ;

-- Applicant <-> Answer Table
ALTER TABLE IF EXISTS Applicant_Answers DROP CONSTRAINT IF EXISTS FK_ApplicantsAnswers ;
ALTER TABLE IF EXISTS Applicant_Answers DROP CONSTRAINT IF EXISTS FK_AnswersApplicants ;
DROP TABLE IF EXISTS Applicant_Answers CASCADE ;

CREATE TABLE Applicant_Answers ( applicant_id BIGINT NOT NULL , answers_id BIGINT NOT NULL ) ;


-- (END)
-------------------------------------------------------------------------------------------------------

-- ADD FOREIGN KEYS CONSTRAINTS (BEGIN )
-------------------------------------------------------------------------------------------------------

-- Applicant Table
ALTER TABLE Applicant ADD CONSTRAINT FK_ApplicantResult
                      FOREIGN KEY (result_id)
                      REFERENCES Result ;

ALTER TABLE Applicant ADD CONSTRAINT FK_ApplicantAssessment
                      FOREIGN KEY (assessment_id)
                      REFERENCES Assessment ;

-- Answer Table
ALTER TABLE Answers ADD CONSTRAINT FK_AnswerQuestion
                   FOREIGN KEY (question_id)
                   REFERENCES Questions ;

-- Assessment <-> Question Table
ALTER TABLE Assessment_Questions ADD CONSTRAINT FK_QuestionsAssessments
                                 FOREIGN KEY (questions_id)
                                 REFERENCES Questions ;

ALTER TABLE Assessment_Questions ADD CONSTRAINT FK_AssessmentsQuestions
                                 FOREIGN KEY (assessment_id)
                                 REFERENCES Assessment ;

-- Applicant <-> Answer Table
ALTER TABLE Applicant_Answers ADD CONSTRAINT FK_ApplicantsAnswers
                                 FOREIGN KEY (applicant_id)
                                 REFERENCES Applicant ;

ALTER TABLE Applicant_Answers ADD CONSTRAINT FK_AnswersApplicants
                                 FOREIGN KEY (answers_id)
                                 REFERENCES Answers ;

-- (END)
--------------------------------------------------------------------------------------------------------