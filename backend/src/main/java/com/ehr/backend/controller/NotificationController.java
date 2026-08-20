package com.ehr.backend.controller;

import com.ehr.backend.dto.response.NotificationResponse;
import com.ehr.backend.security.CustomUserPrincipal;
import com.ehr.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(
            @AuthenticationPrincipal CustomUserPrincipal userPrincipal,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        
        List<NotificationResponse> notifications = notificationService.getUserNotifications(userPrincipal.getUserId(), unreadOnly);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal userPrincipal) {
        
        notificationService.markAsRead(id, userPrincipal.getUserId());
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal CustomUserPrincipal userPrincipal) {
        
        notificationService.markAllAsRead(userPrincipal.getUserId());
        return ResponseEntity.ok().build();
    }
}
