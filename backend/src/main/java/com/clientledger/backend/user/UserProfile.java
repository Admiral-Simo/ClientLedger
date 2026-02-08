package com.clientledger.backend.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Security: Prevent massive strings (DB DoS) and ensure it's not empty
    @Column(nullable = false)
    @NotBlank(message = "Company name cannot be empty")
    @Size(min = 2, max = 100, message = "Company name must be between 2 and 100 characters")
    // Regex: Allows letters, numbers, spaces, and common punctuation (.,&-)
    // Prevents typical XSS characters like < > /
    @Pattern(regexp = "^[\\w\\s.,&'-]+$", message = "Company name contains invalid characters")
    private String companyName;

    @Column
    @Size(max = 255, message = "Address is too long (max 255 characters)")
    // Address regex is tricky, but this blocks basic HTML tags (<>) while allowing most address formats
    @Pattern(regexp = "^[^<>]*$", message = "Address contains invalid characters")
    private String address;

    @Column
    @Size(max = 50, message = "Tax ID is too long")
    // Regex: Alphanumeric only, with optional dashes or spaces (e.g., DE-12345 or US 9876)
    @Pattern(regexp = "^[A-Za-z0-9\\s-]*$", message = "Tax ID must contain only letters, numbers, and dashes")
    private String taxID;

    @Column
    @Size(max = 20, message = "Phone number is too long")
    // Regex: Global phone format. Allows +, -, spaces, and parentheses.
    // Examples: +1 555-0199, (555) 123-4567, +49123456789
    @Pattern(regexp = "^\\+?[0-9\\s\\-()]*$", message = "Invalid phone number format")
    private String phone;

    // Security: ownerId MUST exist and should never be empty
    @Column(nullable = false, updatable = false)
    private String ownerId;
}