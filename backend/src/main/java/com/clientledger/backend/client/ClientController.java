package com.clientledger.backend.client;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientRepository clientRepository;

    public ClientController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public record ClientRequest(String name, String email, String country, String defaultCurrency) {}

    @PostMapping
    public Client createClient(@RequestBody ClientRequest request, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();

        Client client = new Client();
        client.setName(request.name());
        client.setEmail(request.email());
        client.setCountry(request.country());
        client.setDefaultCurrency(request.defaultCurrency());

        client.setOwnerId(userId);

        return clientRepository.save(client);
    }

    @GetMapping
    public List<Client> getMyClients(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return clientRepository.findByOwnerId(userId);
    }

    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        if (!client.getOwnerId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        clientRepository.delete(client);
    }

    @PutMapping("/{id}")
    public Client updateClient(@PathVariable Long id, @RequestBody ClientRequest request, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        if (!client.getOwnerId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        client.setName(request.name());
        client.setEmail(request.email());
        client.setCountry(request.country());
        client.setDefaultCurrency(request.defaultCurrency());
        return clientRepository.save(client);
    }
}