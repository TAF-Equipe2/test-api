package org.requests;

import org.requests.payload.request.TestApiRequest;
import io.restassured.specification.RequestSpecification;
import io.restassured.response.Response;

import static io.restassured.RestAssured.given;

public class RequestController {
    private TestApiRequest request;
    private RequestSpecification httpRequest;
    private Response response;

    public RequestController(TestApiRequest request) {
        this.request = request;
        this.httpRequest = given()
                .header("Content-Type", "application/json")
                .body(this.request.getInput());
    }

    public boolean getAnswer() {
        this.execute();
        return this.checkStatusCode() && this.checkBody();
    }

    private void execute() {
        this.response = this.request.getMethod().execute(this.httpRequest, this.request.getApiUrl());
    }

    private boolean checkStatusCode() {
        return this.request.getStatusCode() == this.response.getStatusCode();
    }

    private boolean checkBody() {
        return this.request.getExpectedOutput().equals(this.response.getBody().asPrettyString());
    }
}
