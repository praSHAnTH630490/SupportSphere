package com.supportsphere.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.AIConversation;
import com.supportsphere.entity.User;
import com.supportsphere.repository.AIConversationRepository;
import com.supportsphere.repository.UserRepository;
import com.supportsphere.security.SecurityUtil;

@Service
public class AIConversationService {

    private final AIConversationRepository aiConversationRepository;
    private final UserRepository userRepository;

    public AIConversationService(
            AIConversationRepository aiConversationRepository,
            UserRepository userRepository) {

        this.aiConversationRepository =
                aiConversationRepository;

        this.userRepository = userRepository;
    }

    public AIConversation saveConversation(
        AIConversation conversation) {

    String email =
            SecurityUtil.getLoggedInEmail();

    if (email == null) {
        throw new RuntimeException(
                "User is not authenticated."
        );
    }

    Optional<User> optionalUser =
        userRepository.findOptionalByEmail(email);

    if (optionalUser.isEmpty()) {
        throw new RuntimeException(
                "Logged-in user not found."
        );
    }

    User loggedInUser =
            optionalUser.get();

    conversation.setUser(loggedInUser);

    return aiConversationRepository.save(
            conversation
    );
}

    public List<AIConversation> getAllConversations() {

        String email =
                SecurityUtil.getLoggedInEmail();

        if (email == null) {
            throw new RuntimeException(
                    "User is not authenticated."
            );
        }

        return aiConversationRepository
                .findByUser_Email(email);
    }

    public AIConversation getConversationById(
            Long id) {

        AIConversation conversation =
                aiConversationRepository
                        .findById(id)
                        .orElse(null);

        if (conversation == null) {
            return null;
        }

        String email =
                SecurityUtil.getLoggedInEmail();

        if (email == null) {
            throw new RuntimeException(
                    "User is not authenticated."
            );
        }

        if (conversation.getUser() == null
                || conversation.getUser().getEmail() == null
                || !conversation.getUser()
                        .getEmail()
                        .equals(email)) {

            throw new RuntimeException(
                    "You are not authorized to access this conversation."
            );
        }

        return conversation;
    }

    public void deleteConversation(Long id) {

        AIConversation conversation =
                getConversationById(id);

        if (conversation == null) {
            throw new RuntimeException(
                    "AI conversation not found."
            );
        }

        aiConversationRepository.delete(
                conversation
        );
    }
}
