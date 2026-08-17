package com.ehr.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class EhrBackendApplication {
    public static void main(String[] args) {
        // Appointment/access-window timestamps are stored as naive LocalDateTime,
        // matching the wall-clock the frontend's datetime-local inputs capture (IST).
        // The JVM default timezone must match that, or LocalDateTime.now() comparisons
        // (e.g. DoctorService.assertHasFullAccess) drift by the host's UTC offset.
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(EhrBackendApplication.class, args);
    }
}
