package com.supportsphere.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.KnowledgeChunk;

@Service
public class RAGService {

    private final KnowledgeSearchService knowledgeSearchService;

    public RAGService(
            KnowledgeSearchService knowledgeSearchService) {

        this.knowledgeSearchService = knowledgeSearchService;
    }

    public String buildKnowledgeContext(String question) {

        if (question == null || question.isBlank()) {
            return "";
        }

        List<KnowledgeChunk> chunks =
                knowledgeSearchService.search(question);

        if (chunks.isEmpty()) {
            return "";
        }

        return chunks.stream()
                .limit(5)
                .map(KnowledgeChunk::getChunkText)
                .collect(Collectors.joining("\n\n"));
    }
}
