package ca.etsmtl.taf.controller;

import org.springframework.web.bind.annotation.*;
import ca.etsmtl.taf.payload.request.TestApiRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/testapi")
public class TestApiController {
    @PostMapping("/checkApi")
    public void testApi(@Valid @RequestBody TestApiRequest testApiRequest) throws URISyntaxException, IOException, InterruptedException {

        var client = HttpClient.newHttpClient();
        var uri = new URI("http://localhost:8082/api/microservice/checkApi");

        var request = HttpRequest.newBuilder(uri).
                POST(BodyPublishers.ofString(testApiRequest.toString()))
                .header("Content-type", "application/json").
                build();
        //Later add return info from microservice testapi
    }
}
