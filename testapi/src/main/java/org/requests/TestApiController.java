package org.requests;

import org.requests.methods.*;
import org.requests.payload.request.TestApiRequest;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/microservice/testapi")
public class TestApiController {

    @PostMapping("/checkApi")
    public void testApi(@Valid @RequestBody TestApiRequest testApiRequest) {
        redirectMethod(testApiRequest.getMethod(),
                       testApiRequest.getApiUrl(),
                       testApiRequest.getInput(),
                       testApiRequest.getExceptedOutput());
        //Later add return info
    }

    public void redirectMethod(String method, String url, String input, String output){

        switch(method){
            case "post":
                (new Post()).execute(url,input,output);
                break;
            case "delete":
                (new Delete()).execute(url,input,output);
                break;
            case "options":
                (new Options()).execute(url,input,output);
                break;
            case "get":
                (new Get()).execute(url,input,output);
                break;
            case "update":
                (new Update()).execute(url,input,output);
                break;
        }
    }
}
