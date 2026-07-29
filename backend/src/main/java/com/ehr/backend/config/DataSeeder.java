package com.ehr.backend.config;

import com.ehr.backend.entity.User;
import com.ehr.backend.enums.AccountStatus;
import com.ehr.backend.enums.Role;
import com.ehr.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates a default admin account on first startup, since there is no
 * public "register admin" endpoint (admins are not meant to be
 * self-registered). Change the password immediately after first login
 * in a real deployment -- this is seed data for local development only.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL = "admin@ehr.com";
    private static final String ADMIN_PASSWORD = "Admin@123";

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(ADMIN_EMAIL)) {
            return;
        }

        User admin = new User();
        admin.setEmail(ADMIN_EMAIL);
        admin.setPasswordHash(passwordEncoder.encode(ADMIN_PASSWORD));
        admin.setRole(Role.ADMIN);
        admin.setAccountStatus(AccountStatus.ACTIVE);
        userRepository.save(admin);

        System.out.println("=================================================");
        System.out.println(" Default admin account created:");
        System.out.println("   email:    " + ADMIN_EMAIL);
        System.out.println("   password: " + ADMIN_PASSWORD);
        System.out.println(" Change this password in production.");
        System.out.println("=================================================");
    }
}
