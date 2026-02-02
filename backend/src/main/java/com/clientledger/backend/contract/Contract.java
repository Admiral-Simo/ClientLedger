package com.clientledger.backend.contract;

import com.clientledger.backend.client.Client;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "contracts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "total_value", precision = 19, scale = 4)
    private BigDecimal totalValue;

    @Column(length = 3)
    private String currency;

    @Enumerated(EnumType.STRING)
    private ContractStatus status;

    @Column(name = "owner_id")
    private String ownerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnoreProperties({"contracts", "hibernateLazyInitializer", "handler"})
    private Client client;
}