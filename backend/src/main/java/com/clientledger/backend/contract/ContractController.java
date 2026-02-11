package com.clientledger.backend.contract;

import com.clientledger.backend.client.Client;
import com.clientledger.backend.client.ClientRepository;
import com.clientledger.backend.user.UserProfile;
import com.clientledger.backend.user.UserProfileRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {
    private final ContractRepository contractRepository;
    private final ClientRepository clientRepository;
    private final UserProfileRepository userProfileRepository;

    public ContractController(ContractRepository contractRepository, ClientRepository clientRepository, UserProfileRepository userProfileRepository) {
        this.contractRepository = contractRepository;
        this.clientRepository = clientRepository;
        this.userProfileRepository = userProfileRepository;
    }

    // DTO Record
    public record ContractRequest(String title, BigDecimal totalValue, Long clientId, String currency) {}

    @PostMapping
    public Contract createContract(@RequestBody ContractRequest request, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject(); // Use getSubject() for consistency

        Client client = clientRepository.findById(request.clientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

        if (!client.getOwnerId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }

        Contract contract = new Contract();
        contract.setTitle(request.title());
        contract.setTotalValue(request.totalValue());

        // Handle currency default safely
        if (request.currency() == null || request.currency().equals("Default")) {
            contract.setCurrency(client.getDefaultCurrency());
        } else {
            contract.setCurrency(request.currency());
        }

        contract.setStatus(ContractStatus.DRAFT);
        contract.setOwnerId(userId);
        contract.setClient(client);

        return contractRepository.save(contract);
    }

    @GetMapping
    public Page<Contract> getMyContracts(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long clientId,
            @RequestParam(required = false) String search
    ) {
        String userId = jwt.getSubject();
        Pageable pageable = PageRequest.of(page, size);

        // 1. Convert String "PAID" -> Enum ContractStatus.PAID
        ContractStatus statusEnum = null;
        if (status != null && !status.isEmpty() && !status.equals("ALL")) {
            try {
                statusEnum = ContractStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
            }
        }

        return contractRepository.findContractsWithFilters(
                userId,
                statusEnum,
                clientId,
                search,
                pageable
        );
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

        // ✅ FIXED: Handle missing profile safely
        UserProfile profile = userProfileRepository.findByOwnerId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Please complete your Profile/Settings before generating an invoice."));

        PdfService pdfService = new PdfService();
        byte[] pdfBytes = pdfService.generateInvoice(contract, profile);

        String safeTitle = contract.getTitle().toLowerCase().replaceAll("[^a-zA-Z0-9_-]", "_");

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=invoice_" + safeTitle + ".pdf")
                .body(pdfBytes);
    }
}