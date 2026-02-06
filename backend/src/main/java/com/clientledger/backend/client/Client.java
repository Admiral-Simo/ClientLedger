package com.clientledger.backend.client;

import com.clientledger.backend.contract.Contract;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "clients")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String country;

    @Column(name = "default_currency")
    private String defaultCurrency;

    // 👇 ADD THIS FIELD
    // This links the Client to the logged-in Freelancer (Cognito Sub)
    @Column(name = "owner_id", nullable = false)
    private String ownerId;

    @OneToMany(
            mappedBy = "client",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List<Contract> contracts;
}