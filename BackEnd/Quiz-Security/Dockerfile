FROM maven:3.9.9-eclipse-temurin-22 as build
LABEL authors="bsoan"
LABEL maintainer="hdhumazi@gmail.com"

WORKDIR /app
COPY mvnw pom.xml ./
COPY src ./src


RUN mvn clean package -DskipTest

FROM azul/zulu-openjdk:22.0.1

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
COPY src/main/resources/keys/public.pem ./src/main/resources/keys/public.pem
COPY src/main/resources/keys/private.pem ./src/main/resources/keys/private.pem


EXPOSE 8082

ENTRYPOINT ["java" , "-jar" , "app.jar"]
