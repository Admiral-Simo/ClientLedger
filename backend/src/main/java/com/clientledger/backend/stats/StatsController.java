package com.clientledger.backend.stats;

import com.clientledger.backend.client.ClientRepository;
import com.clientledger.backend.contract.Contract;
import com.clientledger.backend.contract.ContractRepository;
import com.clientledger.backend.contract.ContractStatus;
import com.clientledger.backend.stats.dto.MonthlyRevenue; // Ensure this is a Class or Record, not an Interface now
import com.clientledger.backend.stats.dto.StatsSummaryDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
                clientRepository.countByOwnerId(ownerId),
                contractRepository.countByOwnerId(ownerId),
                contractRepository.sumTotalValueByOwnerIdAndStatus(ownerId, ContractStatus.DRAFT) +
                        contractRepository.sumTotalValueByOwnerIdAndStatus(ownerId, ContractStatus.ACTIVE),
                contractRepository.sumTotalValueByOwnerIdAndStatus(ownerId, ContractStatus.PAID),
                contractRepository.sumTotalValueByOwnerIdAndStatus(ownerId, ContractStatus.OVERDUE)
        );
    }

    @GetMapping("/revenue-over-time")
    public ResponseEntity<List<MonthlyRevenue>> getRevenueOverTime(@AuthenticationPrincipal Jwt jwt) {
        String ownerId = jwt.getSubject();

        List<Contract> paidContracts = contractRepository.findByOwnerIdAndStatus(ownerId, ContractStatus.PAID);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");

        Map<String, Double> revenueByMonth = paidContracts.stream()
                .collect(Collectors.groupingBy(
                        // Format the date to "Jan", "Feb"
                        contract -> contract.getCreatedAt().format(formatter),
                        // Explicitly convert BigDecimal to double for the chart
                        Collectors.summingDouble(contract -> contract.getTotalValue().doubleValue())
                ));

        List<MonthlyRevenue> chartData = revenueByMonth.entrySet().stream()
                .map(entry -> new MonthlyRevenue(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(chartData);
    }
}