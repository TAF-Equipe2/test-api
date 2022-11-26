package ca.etsmtl.taf.payload.request;

import javax.validation.constraints.NotBlank;

public class TestApiRequest {


    public String apiUrl;
    public String exceptedOutput;
    public String input;
    public String method;
    public int statusCode;

}
