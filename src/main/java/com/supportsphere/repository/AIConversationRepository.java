package com.supportsphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.supportsphere.entity.AIConversation;

public interface AIConversationRepository
        extends JpaRepository<AIConversation, Long> {

    List<AIConversation> findByUser_Email(String email);
}
