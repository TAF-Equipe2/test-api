package org.testapi;

<<<<<<< HEAD
import io.restassured.RestAssured;
import io.restassured.http.Headers;
import io.restassured.http.Method;
import io.restassured.response.Response;
import io.restassured.response.ResponseBody;
import io.restassured.specification.RequestSpecification;
=======

>>>>>>> 0077bd23798bb0ebeda253d25bd7f51d43ab7d8d
public class Main {
    public static void main(String[] args) {

<<<<<<< HEAD
        Response response = httpRequest.request(Method.GET, "api/users?page=2");

        int statusCode = response.getStatusCode();
         Headers header = response.getHeaders();
        ResponseBody body = response.getBody();

        System.out.println("La réponse ets "+statusCode);
        System.out.println("Headers ets "+header);
        System.out.println("Body ets "+body.prettyPrint());

=======
>>>>>>> 0077bd23798bb0ebeda253d25bd7f51d43ab7d8d
    }
}
