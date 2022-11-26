package org.requests.payload.request;

import javax.validation.constraints.NotBlank;

public class TestApiRequest {
    @NotBlank
    private String apiUrl;
    @NotBlank
    private String method;
    private String exceptedOutput;
    private String input;

    private int statusCode;

    public String getApiUrl() { return this.apiUrl; }
    public void setApiUrl(String apiUrl) { this.apiUrl = apiUrl; }

    public String getMethod() { return this.method; }
    public void setMethod(String method) { this.method = method; }

    public String getExceptedOutput() { return this.exceptedOutput; }
    public void setExceptedOutput(String exceptedOutput) { this.exceptedOutput = exceptedOutput; }

    public String getInput() { return this.input; }
    public void setInput(String input) { this.input = input; }

    public void setStatusCode(int statusCode){this.statusCode = statusCode;}
    public int getStatusCode(){return this.statusCode;}
}


