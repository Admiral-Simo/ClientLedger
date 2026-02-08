package com.clientledger.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
     Optional<UserProfile> findByOwnerId(String ownerId);
}
