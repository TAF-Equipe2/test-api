package ca.etsmtl.taf.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/testapi")
public class TestApiController {

    @GetMapping("/all")
    public String allAccess() {
        return "Bienvenue au TAF.";
    }

    @PostMapping("/ronin")
    @ResponseBody
    public String testApi(HttpServletRequest request) {
        System.out.println(request);
        return "Bienvenue au TAF.";
    }

}
