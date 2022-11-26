package org.requests;

import org.requests.methods.*;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import org.requests.payload.request.TestApiRequest;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/microservice/testapi")
public class TestApiController {

    @PostMapping("/checkApi")
    public void testApi(@Valid @RequestBody TestApiRequest testApiRequest) {
        System.out.println("Je suis le microservice");
        redirectMethod(testApiRequest.getMethod(),
                       testApiRequest.getApiUrl(),
                       testApiRequest.getInput(),
                       testApiRequest.getExceptedOutput(),
                       testApiRequest.getStatusCode());
        //Later add return info
    }

    public void redirectMethod(String method, String url, String input, String output, int statusCode){

        switch(method){
            case "post":
                (new Post()).execute(url,input,output,statusCode);
                break;
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
    }
}
