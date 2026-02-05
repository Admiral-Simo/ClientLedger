package com.clientledger.backend.client;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientRepository clientRepository;

    public ClientController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    // 1. DTO: What data do we need to create a client?
    public record ClientRequest(String name, String email, String country, String defaultCurrency) {}

    // CREATE: Add a new client for the logged-in user
    @PostMapping
    public Client createClient(@RequestBody ClientRequest request, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject(); // The Cognito User ID

        Client client = new Client();
        client.setName(request.name());
        client.setEmail(request.email());
        client.setCountry(request.country());
        client.setDefaultCurrency(request.defaultCurrency());

        // CRITICAL: Stamp the owner ID so this client belongs to YOU
        client.setOwnerId(userId);

        return clientRepository.save(client);
    }

    // READ: Get only MY clients
    @GetMapping
    public List<Client> getMyClients(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return clientRepository.findByOwnerId(userId);
    }
}