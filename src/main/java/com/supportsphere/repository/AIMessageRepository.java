package com.supportsphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.supportsphere.entity.AIMessage;

public interface AIMessageRepository
        extends JpaRepository<AIMessage, Long> {

    List<AIMessage> findByConversation_User_Email(String email);

    List<AIMessage> findByConversation_ConversationId(Long conversationId);
}
