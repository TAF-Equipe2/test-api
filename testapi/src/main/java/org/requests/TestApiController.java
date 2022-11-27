package org.requests;

import org.requests.methods.*;
import org.requests.payload.request.TestApiRequest;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.Serializable;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/microservice/testapi")
public class TestApiController {

    @PostMapping("/checkApi")
    public Serializable testApi(@Valid @RequestBody TestApiRequest testApiRequest) {
        System.out.println("Je suis le microservice");
        Serializable response = (redirectMethod(testApiRequest.getMethod(),
                testApiRequest.getApiUrl(),
                testApiRequest.getInput(),
                testApiRequest.getExceptedOutput(),
                testApiRequest.getStatusCode()));

        return response;
        //Later add return info

    }

    public Serializable redirectMethod(String method, String url, String input, String output, int statusCode){

        switch(method){
            case "post":
                 return (new Post().execute(url,input,output,statusCode));
            case "delete":
                (new Delete()).execute(url,input,output,statusCode);
                break;
            case "options":
                (new Options()).execute(url,input,output,statusCode);
                break;
            case "get":
                (new Get()).execute(url,input,output,statusCode);
                break;
            case "update":
                (new Update()).execute(url,input,output,statusCode);
                break;
        }
        return null;
    }
}
