package org.testapi;

import io.restassured.RestAssured;
import io.restassured.specification.RequestSpecification;
import io.restassured.RestAssured;
import io.restassured.specification.RequestSpecification;
import io.restassured.http.Method;
import io.restassured.response.Response;
public class Main {
    public static void main(String[] args) {
        RestAssured.baseURI = "https://reqres.in/";
        RequestSpecification httpRequest = RestAssured.given();

        Response response = httpRequest.request(Method.GET, "api/users?page=2");

        int statusCode = response.getStatusCode();
        System.out.println("La réponse ets ");
    }
}