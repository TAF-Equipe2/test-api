package org.requests.methods;

import org.junit.jupiter.api.Test;
import org.requests.IRequest;

import static io.restassured.RestAssured.given;

public class Post implements IRequest {
    @Test
    public void authPreenpt(){
        given().auth().preemptive().basic("eve.holt@reqres.in","Password")
                .when().get("https://reqres.in/api/login")
                        .then().log().body();
    }
    @Test
    public void authBasic(){
        given().auth().basic("eve.holt@reqres.in","Password")
                .when().get("https://reqres.in/api/login")
                .then().log().body();
    }
    @Test
    @Override
    public void execute(){

    }
}
