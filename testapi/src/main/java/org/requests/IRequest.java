package org.requests;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import io.restassured.http.Headers;
import io.restassured.response.Response;


public interface IRequest {

    void execute(String url, String input, String output, int statusCode);
    public default void getResponse(Response response, String output) {
        int statusCode = response.getStatusCode();
        Headers header = response.getHeaders();
        String body = response.getBody().asString();

        JsonElement expected = JsonParser.parseString(output).getAsJsonObject();
        JsonElement actual = JsonParser.parseString((body)).getAsJsonObject();


        System.out.println(expected.equals(actual));
    }



}