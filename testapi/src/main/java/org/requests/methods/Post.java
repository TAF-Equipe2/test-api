package org.requests.methods;

import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.requests.IRequest;

import java.io.Serializable;

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
    public Serializable execute(String url, String input, String output, int statusCode){

        try {
            RequestSpecification httpRequest = given();
            Response response = httpRequest
                    .body(input)
                    .expect()
                    .statusCode(statusCode)
                    .when()
                    .post(url);

            if(output != null && !output.isEmpty()){
                System.out.println(IRequest.super.equalBody(String.valueOf(response.getBody()),output));
            }
        } catch(AssertionError ae){
            return false;
        }
        return true;
    }

}

