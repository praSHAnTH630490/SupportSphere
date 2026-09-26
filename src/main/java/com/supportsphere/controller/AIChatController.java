package com.supportsphere.controller;

import org.springframework.web.bind.annotation.*;

import com.supportsphere.service.AIChatService;

@RestController
@RequestMapping("/api/ai/chat")
public class AIChatController {

    private final AIChatService aiChatService;

    public AIChatController(AIChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/{conversationId}")
    public String chat(
            @PathVariable Long conversationId,
            @RequestBody ChatRequest request) {

        return aiChatService.chat(
                conversationId,
                request.getMessage()
        );
    }

    public static class ChatRequest {

        private String message;

        public ChatRequest() {
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
