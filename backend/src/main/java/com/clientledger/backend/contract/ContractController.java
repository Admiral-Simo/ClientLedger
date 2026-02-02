package com.clientledger.backend.contract;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractRepository contractRepository;

    public ContractController(ContractRepository contractRepository) {
        this.contractRepository = contractRepository;
    }

    // CREATE: We extract the 'sub' (User ID) from the JWT
    @PostMapping
    public Contract createContract(@RequestBody Contract contract, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("sub"); // The unique Cognito User ID
        contract.setOwnerId(userId);
        contract.setStatus(ContractStatus.DRAFT);
        return contractRepository.save(contract);
    }

    // READ: We only return contracts where ownerId matches the logged-in user
    @GetMapping
    public List<Contract> getMyContracts(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("sub");
        return contractRepository.findByOwnerId(userId);
    }
}