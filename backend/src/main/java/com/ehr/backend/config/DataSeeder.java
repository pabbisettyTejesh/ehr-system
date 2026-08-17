package com.ehr.backend.config;

import com.ehr.backend.entity.User;
import com.ehr.backend.enums.AccountStatus;
import com.ehr.backend.enums.Role;
import com.ehr.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates a default admin account on first startup, since there is no
 * public "register admin" endpoint (admins are not meant to be
 * self-registered). Override app.seed.admin-email/admin-password
 * (ADMIN_EMAIL/ADMIN_PASSWORD env vars) before any real deployment --
 * the defaults are local-dev seed data only.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.admin-email}")
    private String adminEmail;

    @Value("${app.seed.admin-password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        User admin = new User();
        admin.setEmail(adminEmail);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);
        admin.setAccountStatus(AccountStatus.ACTIVE);
        userRepository.save(admin);

        System.out.println("=================================================");
        System.out.println(" Default admin account created: " + adminEmail);
        System.out.println(" Change this password immediately if using the default.");
        System.out.println("=================================================");
    }
}
