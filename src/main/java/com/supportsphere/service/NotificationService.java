package com.supportsphere.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.Notification;
import com.supportsphere.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // Save notification
    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    // Get all notifications
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    // Get notification by ID
    public Notification getNotificationById(Long notificationId) {
        return notificationRepository.findById(notificationId).orElse(null);
    }

    // Get notifications for a specific user
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository
                .findByUserUserIdOrderByCreatedAtDesc(userId);
    }

    // Get unread notifications for a specific user
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository
                .findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    // Mark one notification as read
    public Notification markAsRead(Long notificationId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElse(null);

        if (notification != null) {
            notification.setIsRead(true);
            return notificationRepository.save(notification);
        }

        return null;
    }

    // Delete notification
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    public void markAllAsRead(Long userId) {
    List<Notification> notifications =
            notificationRepository.findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

    for (Notification notification : notifications) {
        notification.setIsRead(true);
    }

    notificationRepository.saveAll(notifications);
}
}
