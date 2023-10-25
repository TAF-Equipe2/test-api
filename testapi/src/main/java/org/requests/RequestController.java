package org.requests;

import org.requests.payload.request.Answer;
import org.requests.payload.request.TestApiRequest;
import io.restassured.specification.RequestSpecification;
import io.restassured.response.Response;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;

public class RequestController {
    private final TestApiRequest request;
    private final RequestSpecification httpRequest;
    private Response response;
    private final List<String> messages = new ArrayList<>();

    public RequestController(TestApiRequest request) {
        this.request = request;
        this.httpRequest = given()
                .header("Content-Type", "application/json")
                .body(this.request.getInput());
    }

    public Answer getAnswer() {
        this.execute();
        Answer answer = new Answer();
        answer.expectedStatusCode = this.request.getStatusCode();
        answer.statusCode = this.response.getStatusCode();
        answer.expectedOutput = this.request.getExpectedOutput();
        answer.output = this.response.getBody().asPrettyString();
        answer.answer = this.checkStatusCode() && this.checkOutput() && this.checkResponseTime() && this.checkResponseHeaders();
        answer.messages = this.messages;
        return answer;
    }

    private void execute() {
        this.response = this.request.getMethod().execute(this.httpRequest, this.request.getApiUrl());
    }

    private boolean checkStatusCode() {
        return this.request.getStatusCode() == this.response.getStatusCode();
    }

    private boolean checkOutput() {
        if(!this.request.getExpectedOutput().isEmpty()){
            return this.request.getExpectedOutput().equals(this.response.getBody().asPrettyString());
        }
        return true;
    }

    private boolean checkResponseTime() {
        return response.getTime() < request.getResponseTime();
    }

    private boolean checkResponseHeaders() {
        boolean ok = true;

        for (Map.Entry<String, String> expected : request.getExpectedHeaders().entrySet()) {
            String foundValue = response.header(expected.getKey());
            if (foundValue == null) {
                messages.add(String.format("Required header %s wasn't set in response", expected.getKey()));
                continue;
            }

            if (!foundValue.equals(expected.getValue())) {
                messages.add(String.format("Header %s should have had the value \"%s\", found \"%s\"", expected.getKey(), expected.getValue(), foundValue));
                ok = false;
            }
        }

        return ok;
    }
}
