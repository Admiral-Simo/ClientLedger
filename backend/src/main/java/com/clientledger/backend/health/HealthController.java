package com.clientledger.backend.health;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    @GetMapping
    public String healthcheck1() {
        return "OK";
    }

    @GetMapping("/health")
    public String healthcheck2() {
        return "OK";
    }
}
