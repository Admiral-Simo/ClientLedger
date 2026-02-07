package com.clientledger.backend.contract;

import com.clientledger.backend.client.Client;
import com.clientledger.backend.client.ClientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public record ContractRequest(String title, BigDecimal totalValue, Long clientId, String currency) {}

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

        Contract contract = new Contract();
        contract.setTitle(request.title());
        contract.setTotalValue(request.totalValue());
        if (request.currency().equals("Default")) {
            contract.setCurrency(client.getDefaultCurrency());
        } else {
            contract.setCurrency(request.currency());
        }
        contract.setStatus(ContractStatus.DRAFT);
        contract.setOwnerId(userId);
        contract.setClient(client); // <--- This fixes the "Column 'client_id' cannot be null" error

        return contractRepository.save(contract);
    }

    @GetMapping
    public List<Contract> getMyContracts(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return contractRepository.findByOwnerId(userId);
    }

    @DeleteMapping("/{id}")
    public void deleteContract(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contract not found"));
        if (!contract.getOwnerId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        contractRepository.deleteById(contract.getId());
    }

    @PutMapping("/{id}/status")
    public Contract updateContractStatus(@PathVariable Long id, @RequestParam ContractStatus status, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contract not found"));
        if (!contract.getOwnerId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        contract.setStatus(status);
        return contractRepository.save(contract);
    }

    @PutMapping("/{id}")
    public Contract updateContractDetails(@PathVariable Long id, @RequestBody ContractRequest request, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();

        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contract not found"));

        if (!contract.getOwnerId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        contract.setTitle(request.title());
        contract.setTotalValue(request.totalValue());

        return contractRepository.save(contract);
    }

    @GetMapping("{id}/pdf")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contract not found"));
        if (!contract.getOwnerId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        PdfService pdfService = new PdfService();
        byte[] pdfBytes = pdfService.generateInvoice(contract);

        String safeTitle = contract.getTitle().toLowerCase().replaceAll("[^a-zA-Z0-9_-]", "_");


        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=invoice_" + safeTitle + ".pdf")
                .body(pdfBytes);
    }
}