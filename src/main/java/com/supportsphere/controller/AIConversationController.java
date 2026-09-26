package com.supportsphere.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.supportsphere.entity.AIConversation;
import com.supportsphere.service.AIConversationService;

@RestController
@RequestMapping("/api/ai/conversations")
public class AIConversationController {

    private final AIConversationService aiConversationService;

    public AIConversationController(AIConversationService aiConversationService) {
        this.aiConversationService = aiConversationService;
    }

    @PostMapping
    public AIConversation createConversation(
            @RequestBody AIConversation conversation) {

        return aiConversationService.saveConversation(conversation);
    }

    @GetMapping
    public List<AIConversation> getAllConversations() {
        return aiConversationService.getAllConversations();
    }

    @GetMapping("/{conversationId}")
    public AIConversation getConversationById(
            @PathVariable Long conversationId) {

        return aiConversationService.getConversationById(conversationId);
    }

    @DeleteMapping("/{conversationId}")
    public void deleteConversation(
            @PathVariable Long conversationId) {

        aiConversationService.deleteConversation(conversationId);
    }
}
