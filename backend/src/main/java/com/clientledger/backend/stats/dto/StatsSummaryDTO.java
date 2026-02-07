package com.clientledger.backend.stats.dto;

public record StatsSummaryDTO(
        long totalClients,
        long totalContracts,
        long totalPendingAmount,
        long totalPaidAmount,
        long totalOverdueAmount) {
}
