package org.requests;

import io.restassured.http.Headers;
import io.restassured.response.Response;
import io.restassured.response.ResponseBody;
import org.junit.jupiter.api.Test;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public interface IRequest {

    public super apiUrl;


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

    @RequestMapping("/test/api/ronin")
    public default void testToReceiveData(){
        System.out.println("Test");
    }

}