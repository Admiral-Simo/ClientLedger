package com.clientledger.backend.contract;

import com.clientledger.backend.client.Client;
import com.clientledger.backend.client.ClientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractRepository contractRepository;
    private final ClientRepository clientRepository;

    public ContractController(ContractRepository contractRepository, ClientRepository clientRepository) {
        this.contractRepository = contractRepository;
        this.clientRepository = clientRepository;
    }

    // 1. The DTO (Data Transfer Object)
    // This tells Spring: "Expect JSON with title, value, and clientId"
    public record ContractRequest(String title, BigDecimal totalValue, Long clientId) {}

    @PostMapping
    public Contract createContract(@RequestBody ContractRequest request, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("sub");

        // 2. Find the Client
        Client client = clientRepository.findById(request.clientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

        // 3. SECURITY CHECK: Does this client belong to the logged-in user?
        // If we skip this, User A could add a contract to User B's client!
        if (!client.getOwnerId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        // 4. Create and Save
        Contract contract = new Contract();
        contract.setTitle(request.title());
        contract.setTotalValue(request.totalValue());
        contract.setStatus(ContractStatus.DRAFT);
        contract.setOwnerId(userId);
        contract.setClient(client); // <--- This fixes the "Column 'client_id' cannot be null" error

        return contractRepository.save(contract);
    }

    @GetMapping
    public List<Contract> getMyContracts(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("sub");
        return contractRepository.findByOwnerId(userId);
    }
}