package org.requests.methods;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.requests.IRequest;

import static io.restassured.RestAssured.given;

public class Post implements IRequest {

    public void authPreenpt(){
        given().auth().preemptive().basic("eve.holt@reqres.in","Password")
                .when().get("https://reqres.in/api/login")
                        .then().log().body();
    }
    public void authBasic(){
        given().auth().basic("eve.holt@reqres.in","Password")
                .when().get("https://reqres.in/api/login")
                .then().log().body();
    }
    @Override
    public void execute(){
        RestAssured.baseURI = "https://reqres.in/";

        String payload = "{\n" +
                "    \"email\": \"eve.holt@reqres.in\",\n" +
                "    \"password\": \"pistol\"\n" +
                "}";
        RequestSpecification httpRequest = given();
        Response response = httpRequest.body(payload).post("api/register");
        IRequest.super.getResponse(response);
    }


   
}
