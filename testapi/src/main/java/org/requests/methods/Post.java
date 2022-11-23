package org.requests.methods;

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
    public void execute(String url, String input, String output){

        RequestSpecification httpRequest = given();
        Response response = httpRequest.body(input).post(url);

        IRequest.super.getResponse(response);
    }


   
}
