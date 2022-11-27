package ca.etsmtl.taf.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;
import ca.etsmtl.taf.payload.request.TestApiRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.concurrent.CompletableFuture;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/testapi")
public class TestApiController {
    @PostMapping("/checkApi")
    public void testApi(@Valid @RequestBody TestApiRequest testApiRequest) throws URISyntaxException, IOException, InterruptedException {

        System.out.println("Je suis la méthode testApi");
        var uri = new URI("http://localhost:8082/microservice/testapi/checkApi");
        ObjectMapper objectMapper = new ObjectMapper();

        String requestBody = objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(testApiRequest);

        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder(uri)
                .header("Content-Type", "application/json")
                .POST(BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response =
                client.send(request, BodyHandlers.ofString());

        System.out.println(response.body());
    }
}
