ALTER TABLE IF EXISTS Applicant ADD COLUMN end_time TIMESTAMP(6) WITH TIME ZONE ;


ALTER TABLE IF EXISTS Result RENAME COLUMN result TO coding_result ;
ALTER TABLE IF EXISTS Result ADD COLUMN multiplechoice_result BIGINT;
ALTER TABLE IF EXISTS Result ADD COLUMN uuid VARCHAR(255) ;