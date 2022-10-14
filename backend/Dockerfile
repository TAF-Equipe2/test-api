FROM openjdk:17-jdk-alpine
WORKDIR /code
ARG JAR_FILE=target/backend-1.0.0-SNAPSHOT.jar
COPY ${JAR_FILE} /code/app.jar
ENTRYPOINT ["java","-jar","/code/app.jar"]