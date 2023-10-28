package org.requests;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@RestController
public class SpecificationHeaderController {

    public Map<String, Object> testHeaders(
        @RequestParam String apiUrl,
        @RequestParam Map<String, String> expectedHeaders
        ) {

        String apiUrl = request.getApiUrl();

        Map<String, String> expectedHeaders = request.getExpectedHeaders();

        RequestSpecification requestSpec = RestAssured.given();

        Response response = requestSpec.get(apiUrl);

        int statusCode = response.getStatusCode();
        boolean statusCodeMatched = statusCode == HttpStatus.OK.value();

        Map<String, String> responseHeaders = response.getHeaders().asMap();
        boolean headersMatched = expectedHeaders.entrySet().stream()
                .allMatch(expected -> responseHeaders.containsKey(expected.getKey())
                        && responseHeaders.get(expected.getKey()).equals(expected.getValue()));

        Map<String, Object> result = new HashMap<>();
        result.put("statusCodeMatched", statusCodeMatched);
        result.put("headersMatched", headersMatched);

        return result;
    }
}