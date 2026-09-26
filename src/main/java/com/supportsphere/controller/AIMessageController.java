package com.supportsphere.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.supportsphere.entity.AIMessage;
import com.supportsphere.service.AIMessageService;

@RestController
@RequestMapping("/api/ai/messages")
public class AIMessageController {

    private final AIMessageService aiMessageService;

    public AIMessageController(
            AIMessageService aiMessageService) {

        this.aiMessageService =
                aiMessageService;
    }

    @PostMapping
    public AIMessage createMessage(
            @RequestBody AIMessage message) {

        return aiMessageService
                .saveMessage(message);
    }

    @GetMapping
    public List<AIMessage> getAllMessages() {

        return aiMessageService
                .getAllMessages();
    }

    @GetMapping("/conversation/{conversationId}")
    public List<AIMessage> getMessagesByConversationId(
            @PathVariable Long conversationId) {

        return aiMessageService
                .getMessagesByConversationId(
                        conversationId
                );
    }

    @GetMapping("/{id}")
    public AIMessage getMessageById(
            @PathVariable Long id) {

        return aiMessageService
                .getMessageById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteMessage(
            @PathVariable Long id) {

        aiMessageService
                .deleteMessage(id);
    }
}
