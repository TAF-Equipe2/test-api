package org.requests;

import org.requests.Method;
import org.requests.payload.request.TestApiRequest;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.Serializable;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import org.requests.Method;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/microservice/testapi")
public class TestApiController {

    @PostMapping("/checkApi")
    public Serializable testApi(@Valid @RequestBody TestApiRequest testApiRequest) {

        Method method = testApiRequest.getMethod();
        String apiUrl = testApiRequest.getApiUrl();
        Map<String, String> expectedHeaders = testApiRequest.getExpectedHeaders();

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();

        for (Map.Entry<String, String> entry : expectedHeaders.entrySet()) {
            headers.set(entry.getKey(), entry.getValue());
        }

        HttpEntity<?> entity = new HttpEntity<>(headers);
        String methodAsString = convertMethodToString(method);

        String response = restTemplate.exchange(apiUrl,  HttpMethod.resolve(methodAsString), entity, String.class).getBody();

        System.out.println(response);

        return (redirectMethod(testApiRequest));
    }

    public Serializable redirectMethod(TestApiRequest request) {
        return new RequestController(request).getAnswer();
    }

    private String convertMethodToString(Method method) {
        switch (method) {
            case GET:
                return "GET";
            case POST:
                return "POST";
            case PUT:
                return "PUT";
            case DELETE:
                return "DELETE";
            default:
                return "GET"; 
        }
    }


    
}
