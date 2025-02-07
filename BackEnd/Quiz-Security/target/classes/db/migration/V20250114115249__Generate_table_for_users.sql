DROP TABLE IF EXISTS users CASCADE ;
DROP sequence IF EXISTS user_id_gen ;
CREATE sequence user_id_gen START WITH 1 INCREMENT BY 50 ;
CREATE TABLE users (id BIGINT NOT NULL UNIQUE , PRIMARY KEY(id),
                    username VARCHAR(255) NOT NULL , email VARCHAR(255) NOT NULL UNIQUE ,
                    password VARCHAR(255) NOT NULL , full_name VARCHAR(255) NOT NULL ,
                    created_at TIMESTAMP(6) , account_verified BOOLEAN NOT NULL)

