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
    private final SpecificationHeaderController headerTestController;
    
    public TestApiController(SpecificationHeaderController headerTestController) {
        this.headerTestController = headerTestController;
    }

    @PostMapping("/checkApi")
    public Serializable testApi(@Valid @RequestBody TestApiRequest testApiRequest) {
        return (redirectMethod(testApiRequest));
    }

    @PostMapping("/checkHeaders")
    public Map<String, Object> checkHeaders(@Valid @RequestBody TestApiRequest testApiRequest) {
        return headerTestController.testHeaders(testApiRequest.getApiUrl(), testApiRequest.getExpectedHeaders());
    }

    public Serializable redirectMethod(TestApiRequest request) {
        return new RequestController(request).getAnswer();
    }


    
}
