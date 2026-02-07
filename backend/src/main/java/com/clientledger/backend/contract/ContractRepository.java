package com.clientledger.backend.contract;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByOwnerId(String userId);
    long countByOwnerId(String userId);
    // a function that returns the total amount by ownerId and status
    @Query("""
        SELECT COALESCE(SUM(c.totalValue), 0)
        FROM Contract c
        WHERE c.ownerId = :ownerId
        AND c.status = :status
    """)
    long sumTotalValueByOwnerIdAndStatus(
            @Param("ownerId") String ownerId,
            @Param("status") ContractStatus status
    );

}
