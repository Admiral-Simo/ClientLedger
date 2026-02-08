package com.clientledger.backend.user;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserProfileRepository userProfileRepository;

    UserProfileController(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @PostMapping("/update")
    public UserProfile updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UserProfile request
    ) {
        String userId = jwt.getSubject();

        // 1. Fetch existing OR create new
        UserProfile profile = userProfileRepository.findByOwnerId(userId)
                .orElse(new UserProfile());

        // 2. Update fields
        profile.setOwnerId(userId);
        profile.setCompanyName(request.getCompanyName());
        profile.setAddress(request.getAddress());
        profile.setTaxID(request.getTaxID());
        profile.setPhone(request.getPhone());

        // 3. Save
        return userProfileRepository.save(profile);
    }

    @GetMapping
    public UserProfile getProfile(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();

        return userProfileRepository.findByOwnerId(userId)
                .orElseGet(() -> {
                    UserProfile newProfile = new UserProfile();
                    newProfile.setOwnerId(userId);
                    newProfile.setCompanyName("");
                    newProfile.setAddress("");
                    newProfile.setPhone("");
                    newProfile.setTaxID("");
                    return newProfile;
                });
    }
}