package com.clientledger.backend.stats;

import com.clientledger.backend.client.ClientRepository;
import com.clientledger.backend.contract.ContractRepository;
import com.clientledger.backend.contract.ContractStatus;
import com.clientledger.backend.stats.dto.StatsSummaryDTO;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
    private final ClientRepository clientRepository;
    private final ContractRepository contractRepository;
    StatsController(ClientRepository clientRepository, ContractRepository contractRepository) {
        this.clientRepository = clientRepository;
        this.contractRepository = contractRepository;
    }
    @GetMapping("/summary")
    public StatsSummaryDTO getStatsSummary(@AuthenticationPrincipal Jwt jwt) {
        String ownerId = jwt.getSubject();
        return new StatsSummaryDTO(
                clientRepository.countByOwnerId(ownerId), // totalClients
                contractRepository.countByOwnerId(ownerId), // totalContracts
                contractRepository.sumTotalValueByOwnerIdAndStatus(ownerId, ContractStatus.DRAFT) + contractRepository.sumTotalValueByOwnerIdAndStatus(ownerId, ContractStatus.ACTIVE), // totalPendingAmount
                contractRepository.sumTotalValueByOwnerIdAndStatus(ownerId, ContractStatus.PAID), // totalPaidAmount
                contractRepository.sumTotalValueByOwnerIdAndStatus(ownerId, ContractStatus.OVERDUE) // totalOverdueAmount
        );
    }
}
