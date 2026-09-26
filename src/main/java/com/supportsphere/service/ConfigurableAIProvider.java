package com.supportsphere.service;

import com.supportsphere.config.AIProviderConfig;
import com.supportsphere.dto.AIRequest;
import com.supportsphere.dto.AIResponse;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ConfigurableAIProvider implements AIProvider {

    private final AIProviderConfig config;
    private final RestClient restClient;

    public ConfigurableAIProvider(AIProviderConfig config) {

        this.config = config;

        this.restClient = RestClient.builder()
        .baseUrl(config.getBaseUrl())
        .defaultHeader("api-subscription-key", config.getApiKey())
        .defaultHeader("Content-Type", "application/json")
        .build();
    }

    @Override
    public String generateResponse(String message) {

        AIRequest.Message userMessage =
                new AIRequest.Message("user", message);

        AIRequest request = new AIRequest(
                config.getModel(),
                new AIRequest.Message[]{userMessage}
        );

        AIResponse response = restClient
                .post()
                .uri("/chat/completions")
                .body(request)
                .retrieve()
                .body(AIResponse.class);

        if (response == null
                || response.getChoices() == null
                || response.getChoices().isEmpty()
                || response.getChoices().get(0).getMessage() == null) {

            throw new RuntimeException("AI provider returned an empty response.");
        }

        return response.getChoices()
                .get(0)
                .getMessage()
                .getContent();
    }
}
