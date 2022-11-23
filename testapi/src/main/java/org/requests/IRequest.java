package org.requests;

import io.restassured.http.Headers;
import io.restassured.response.Response;
import io.restassured.response.ResponseBody;


public interface IRequest {

    void execute(String url, String input, String output);
    public default void getResponse(Response response) {
        int statusCode = response.getStatusCode();
        Headers header = response.getHeaders();
        ResponseBody body = response.getBody();

        //Print to debug
        System.out.println("La réponse est " + statusCode);
        System.out.println("Headers est " + header);
        System.out.println("Body est " + body.prettyPrint());
    }



}