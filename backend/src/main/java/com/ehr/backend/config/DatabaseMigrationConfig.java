package com.ehr.backend.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DatabaseMigrationConfig {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void migrateEnumToVarchar() {
        try {
            log.info("Attempting to alter appointments status column to VARCHAR to support new REQUESTED enum...");
            jdbcTemplate.execute("ALTER TABLE appointments MODIFY status VARCHAR(50);");
            log.info("Successfully altered appointments table.");

            log.info("Attempting to alter clinical tables to make encounter_id nullable...");
            jdbcTemplate.execute("ALTER TABLE medical_records MODIFY encounter_id BIGINT NULL;");
            jdbcTemplate.execute("ALTER TABLE prescriptions MODIFY encounter_id BIGINT NULL;");
            jdbcTemplate.execute("ALTER TABLE reports MODIFY encounter_id BIGINT NULL;");
            log.info("Successfully altered clinical tables.");
        } catch (Exception e) {
            log.warn("Could not alter tables (they may already be migrated or not exist yet): {}", e.getMessage());
        }
    }
}
