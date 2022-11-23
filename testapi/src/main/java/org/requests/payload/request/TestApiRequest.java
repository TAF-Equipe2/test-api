package org.requests.payload.request;

import javax.validation.constraints.NotBlank;

public class TestApiRequest {
    @NotBlank
    private String apiUrl;
    @NotBlank
    private String method;
    private String exceptedOutput;
    private String input;


    public String getApiUrl() { return apiUrl; }
    public void setApiUrl(String apiUrl) { this.apiUrl = apiUrl; }

    public String getMethod() { return method; }

    public void setMethod(String method) { this.method = method; }

    public String getExceptedOutput() { return exceptedOutput; }

    public void setExceptedOutput(String exceptedOutput) { this.exceptedOutput = exceptedOutput; }

    public String getInput() { return input; }

    public void setInput(String input) { this.input = input; }
}


