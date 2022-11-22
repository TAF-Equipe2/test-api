package org.requests;

import io.restassured.http.Headers;
import io.restassured.response.Response;
import io.restassured.response.ResponseBody;
import org.junit.jupiter.api.Test;


public interface IRequest {

    void execute();

    @Test
    public default void getResponse(Response response) {
        int statusCode = response.getStatusCode();
        Headers header = response.getHeaders();
        ResponseBody body = response.getBody();

        System.out.println("La réponse ets " + statusCode);
        System.out.println("Headers ets " + header);
        System.out.println("Body ets " + body.prettyPrint());
    }



}