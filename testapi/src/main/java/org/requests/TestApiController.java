package org.requests;

import org.requests.payload.request.TestApiRequest;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/microservice/testapi")
public class TestApiController {

    @PostMapping("/checkApi")
    public String testApi(@Valid @RequestBody TestApiRequest testApiRequest) {
        System.out.println(testApiRequest.apiUrl);
        return testApiRequest.apiUrl;
        //Later add return info
    }
}
