package com.clientledger.backend.contract;

import com.clientledger.backend.stats.dto.MonthlyRevenue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByOwnerId(String userId);

    long countByOwnerId(String userId);

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

    @Query("SELECT c FROM Contract c WHERE c.ownerId = :userId " +
            "AND (:status IS NULL OR c.status = :status) " +
            "AND (:clientId IS NULL OR c.client.id = :clientId) " +
            "AND (:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "ORDER BY c.createdAt DESC")
    Page<Contract> findContractsWithFilters(
            @Param("userId") String userId,
            @Param("status") ContractStatus status,
            @Param("clientId") Long clientId,
            @Param("search") String search,
            Pageable pageable
    );

    List<Contract> findByOwnerIdAndStatus(String ownerId, ContractStatus status);
}