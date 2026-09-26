package com.supportsphere.service;

import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final AIProvider aiProvider;

    public AIService(AIProvider aiProvider) {
        this.aiProvider = aiProvider;
    }

    public String generateResponse(String message) {
        return aiProvider.generateResponse(message);
    }
}
