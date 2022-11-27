package org.requests;

import org.requests.Method;
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
        Serializable response = (redirectMethod(testApiRequest));
        return response;
        // Later add return info
    }

    public Serializable redirectMethod(TestApiRequest request) {
        return new RequestController(request).getAnswer();
    }
}
