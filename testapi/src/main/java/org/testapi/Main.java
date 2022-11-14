package org.testapi;

import io.restassured.RestAssured;
import io.restassured.http.Headers;
import io.restassured.http.Method;
import io.restassured.response.Response;
import io.restassured.response.ResponseBody;
import io.restassured.specification.RequestSpecification;
public class Main {
    public static void main(String[] args) {
        RestAssured.baseURI = "https://reqres.in/";
        RequestSpecification httpRequest = RestAssured.given();

        Response response = httpRequest.request(Method.GET, "api/users?page=2");

        int statusCode = response.getStatusCode();
         Headers header = response.getHeaders();
        ResponseBody body = response.getBody();

        System.out.println("La réponse ets "+statusCode);
        System.out.println("Headers ets "+header);
        System.out.println("Body ets "+body.prettyPrint());

    }
}