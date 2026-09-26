package com.supportsphere.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.supportsphere.entity.KnowledgeChunk;
import com.supportsphere.entity.KnowledgeDocument;

@Service
public class KnowledgeProcessingService {

    private final KnowledgeDocumentService knowledgeDocumentService;
    private final KnowledgeChunkService knowledgeChunkService;
    private final KnowledgeChunkingService knowledgeChunkingService;

    public KnowledgeProcessingService(
            KnowledgeDocumentService knowledgeDocumentService,
            KnowledgeChunkService knowledgeChunkService,
            KnowledgeChunkingService knowledgeChunkingService) {

        this.knowledgeDocumentService = knowledgeDocumentService;
        this.knowledgeChunkService = knowledgeChunkService;
        this.knowledgeChunkingService = knowledgeChunkingService;
    }

    @Transactional
    public List<KnowledgeChunk> processDocument(
            Long documentId,
            String content) {

        KnowledgeDocument document =
                knowledgeDocumentService.getDocumentById(documentId);

        if (document == null) {
            throw new RuntimeException("Knowledge document not found.");
        }

        if (content == null || content.isBlank()) {
            throw new RuntimeException("Document content cannot be empty.");
        }

        // Mark document as processing
        knowledgeDocumentService.updateStatus(
                documentId,
                "PROCESSING"
        );

        // Remove old chunks before reprocessing
        knowledgeChunkService.deleteChunksByDocumentId(documentId);

        // Split document content
        List<String> chunkTexts =
                knowledgeChunkingService.splitIntoChunks(content);

        // Save chunks
        List<KnowledgeChunk> savedChunks = new java.util.ArrayList<>();

        for (int i = 0; i < chunkTexts.size(); i++) {

            KnowledgeChunk chunk = new KnowledgeChunk();

            chunk.setDocument(document);
            chunk.setChunkText(chunkTexts.get(i));
            chunk.setChunkIndex(i);

            KnowledgeChunk savedChunk =
                    knowledgeChunkService.createChunk(chunk);

            savedChunks.add(savedChunk);
        }

        // Mark document as ready
        knowledgeDocumentService.updateStatus(
                documentId,
                "READY"
        );

        return savedChunks;
    }
}
