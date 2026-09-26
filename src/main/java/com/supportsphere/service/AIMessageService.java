package com.supportsphere.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.AIConversation;
import com.supportsphere.entity.AIMessage;
import com.supportsphere.repository.AIMessageRepository;
import com.supportsphere.security.SecurityUtil;

@Service
public class AIMessageService {

    private final AIMessageRepository aiMessageRepository;

    private final AIConversationService aiConversationService;

    public AIMessageService(
            AIMessageRepository aiMessageRepository,
            AIConversationService aiConversationService) {

        this.aiMessageRepository =
                aiMessageRepository;

        this.aiConversationService =
                aiConversationService;
    }

    public AIMessage saveMessage(
            AIMessage message) {

        return aiMessageRepository.save(message);
    }

    public List<AIMessage> getAllMessages() {

        String email =
                SecurityUtil.getLoggedInEmail();

        if (email == null) {
            throw new RuntimeException(
                    "User is not authenticated."
            );
        }

        return aiMessageRepository
                .findByConversation_User_Email(email);
    }

    public List<AIMessage> getMessagesByConversationId(
            Long conversationId) {

        AIConversation conversation =
                aiConversationService
                        .getConversationById(
                                conversationId
                        );

        if (conversation == null) {
            throw new RuntimeException(
                    "AI conversation not found."
            );
        }

        return aiMessageRepository
                .findByConversation_ConversationId(
                        conversationId
                );
    }

    public AIMessage getMessageById(Long id) {

        return aiMessageRepository
                .findById(id)
                .orElse(null);
    }

    public void deleteMessage(Long id) {

        aiMessageRepository.deleteById(id);
    }
}
