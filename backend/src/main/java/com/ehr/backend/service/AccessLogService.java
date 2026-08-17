package com.ehr.backend.service;

import com.ehr.backend.entity.AccessLog;
import com.ehr.backend.enums.AccessMode;
import com.ehr.backend.repository.AccessLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccessLogService {

    private final AccessLogRepository accessLogRepository;

    public void log(Long userId, Long patientId, String action, AccessMode mode,
                     String ipAddress, String userAgent, String details) {
        AccessLog log = new AccessLog();
        log.setUserId(userId);
        log.setPatientId(patientId);
        log.setAction(action);
        log.setAccessMode(mode);
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        log.setDetails(details);
        accessLogRepository.save(log);
    }
}
