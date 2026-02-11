package com.clientledger.backend.contract;

import com.clientledger.backend.client.Client;
import com.clientledger.backend.client.ClientRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ContractRepositoryTest {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Test
    void shouldFilterByClientId() {
        // --- 1. Setup Data ---
        String userId = "test-user-123";

        // Create Client A (Target)
        Client clientA = new Client();
        clientA.setName("Client A");
        clientA.setEmail("a@test.com");
        clientA.setOwnerId(userId);
        clientA = clientRepository.save(clientA);

        // Create Client B (Noise)
        Client clientB = new Client();
        clientB.setName("Client B");
        clientB.setEmail("b@test.com");
        clientB.setOwnerId(userId);
        clientB = clientRepository.save(clientB);

        // Create Contract for Client A
        Contract contractA = new Contract();
        contractA.setTitle("Target Contract");
        contractA.setTotalValue(BigDecimal.TEN);
        contractA.setStatus(ContractStatus.DRAFT);
        contractA.setOwnerId(userId);
        contractA.setClient(clientA);
        contractRepository.save(contractA);

        // Create Contract for Client B
        Contract contractB = new Contract();
        contractB.setTitle("Noise Contract");
        contractB.setTotalValue(BigDecimal.TEN);
        contractB.setStatus(ContractStatus.DRAFT);
        contractB.setOwnerId(userId);
        contractB.setClient(clientB);
        contractRepository.save(contractB);

        // --- 2. EXECUTE QUERY ---
        // We strictly ask for Client A's ID
        Page<Contract> result = contractRepository.findContractsWithFilters(
                userId,
                null,           // status
                clientA.getId(), // ✅ FILTER BY CLIENT ID
                null,           // search
                PageRequest.of(0, 10)
        );

        // --- 3. VERIFY ---
        List<Contract> contracts = result.getContent();

        // Debug Print
        System.out.println("Found Contracts: " + contracts.size());
        contracts.forEach(c -> System.out.println(" - " + c.getTitle() + " (Client: " + c.getClient().getName() + ")"));

        // Assertions
        assertThat(contracts).hasSize(1); // Should only find 1
        assertThat(contracts.get(0).getClient().getId()).isEqualTo(clientA.getId());
    }
}
