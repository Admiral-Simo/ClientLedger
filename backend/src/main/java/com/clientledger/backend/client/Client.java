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

    @OneToMany(mappedBy = "client")
    @JsonIgnore
    private List<Contract> contracts;
}