package com.supportsphere.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.supportsphere.entity.Notification;
import com.supportsphere.entity.User;
import com.supportsphere.repository.UserRepository;
import com.supportsphere.security.SecurityUtil;
import com.supportsphere.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationService notificationService,
            UserRepository userRepository) {

        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    // Get notifications for the currently logged-in user
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications() {

        User user = getLoggedInUser();

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
                notificationService.getUserNotifications(user.getUserId())
        );
    }

    // Get unread notifications for the currently logged-in user
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getMyUnreadNotifications() {

        User user = getLoggedInUser();

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(user.getUserId())
        );
    }

    // Get notification by ID
    @GetMapping("/{notificationId}")
    public ResponseEntity<Notification> getNotificationById(
            @PathVariable Long notificationId) {

        Notification notification =
                notificationService.getNotificationById(notificationId);

        if (notification == null) {
            return ResponseEntity.notFound().build();
        }

        User loggedInUser = getLoggedInUser();

        if (loggedInUser == null ||
                !notification.getUser().getUserId()
                        .equals(loggedInUser.getUserId())) {

            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(notification);
    }

    // Mark notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long notificationId) {

        Notification notification =
                notificationService.getNotificationById(notificationId);

        if (notification == null) {
            return ResponseEntity.notFound().build();
        }

        User loggedInUser = getLoggedInUser();

        if (loggedInUser == null ||
                !notification.getUser().getUserId()
                        .equals(loggedInUser.getUserId())) {

            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(
                notificationService.markAsRead(notificationId)
        );
    }

    // Delete notification
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long notificationId) {

        Notification notification =
                notificationService.getNotificationById(notificationId);

        if (notification == null) {
            return ResponseEntity.notFound().build();
        }

        User loggedInUser = getLoggedInUser();

        if (loggedInUser == null ||
                !notification.getUser().getUserId()
                        .equals(loggedInUser.getUserId())) {

            return ResponseEntity.status(403).build();
        }

        notificationService.deleteNotification(notificationId);

        return ResponseEntity.noContent().build();
    }

    // Find currently logged-in user
    private User getLoggedInUser() {

        String email = SecurityUtil.getLoggedInEmail();

        if (email == null) {
            return null;
        }

        return userRepository.findByEmail(email);
    }
    @PutMapping("/read-all")
public ResponseEntity<Void> markAllAsRead() {

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return ResponseEntity.status(401).build();
    }

    notificationService.markAllAsRead(loggedInUser.getUserId());

    return ResponseEntity.noContent().build();
}
}
