FROM openjdk:17-jdk as builder

WORKDIR /code
COPY . .

RUN ./mvnw package -pl gatling

FROM openjdk:17-jdk-alpine as runner

WORKDIR /code

ARG JAR_FILE=target/gatling-1.0.0-SNAPSHOT.jar

COPY --from=builder /code/gatling/${JAR_FILE} /code/app.jar

ENTRYPOINT ["java","-jar","/code/app.jar"]