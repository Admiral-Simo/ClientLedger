package com.clientledger.backend.health;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    @GetMapping
    public String name() {
        return "Client Backend is Running!";
    }

    @GetMapping("/")
    public String health() {
        return "OK";
    }
}
