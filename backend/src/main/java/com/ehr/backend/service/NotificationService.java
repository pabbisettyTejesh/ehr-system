package com.ehr.backend.service;

import com.ehr.backend.dto.response.NotificationResponse;
import com.ehr.backend.entity.Notification;
import com.ehr.backend.entity.User;
import com.ehr.backend.enums.NotificationType;
import com.ehr.backend.exception.ResourceNotFoundException;
import com.ehr.backend.repository.NotificationRepository;
import com.ehr.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createNotification(Long userId, String title, String message, NotificationType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId, boolean unreadOnly) {
        List<Notification> notifications;
        if (unreadOnly) {
            notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        } else {
            notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }

        return notifications.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
                
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to access this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for (Notification notification : unread) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType().name())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
