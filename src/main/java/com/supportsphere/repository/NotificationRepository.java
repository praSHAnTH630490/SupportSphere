package com.supportsphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.supportsphere.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(
            Long userId
    );
}
