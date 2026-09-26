package com.supportsphere.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.KnowledgeChunk;
import com.supportsphere.repository.KnowledgeChunkRepository;

@Service
public class KnowledgeChunkService {

    private final KnowledgeChunkRepository knowledgeChunkRepository;

    public KnowledgeChunkService(
            KnowledgeChunkRepository knowledgeChunkRepository) {

        this.knowledgeChunkRepository = knowledgeChunkRepository;
    }

    // Create a knowledge chunk
    public KnowledgeChunk createChunk(KnowledgeChunk chunk) {

        if (chunk.getCreatedAt() == null) {
            chunk.setCreatedAt(LocalDateTime.now());
        }

        return knowledgeChunkRepository.save(chunk);
    }

    // Get all chunks
    public List<KnowledgeChunk> getAllChunks() {

        return knowledgeChunkRepository.findAll();
    }

    // Get chunk by ID
    public KnowledgeChunk getChunkById(Long chunkId) {

        return knowledgeChunkRepository
                .findById(chunkId)
                .orElse(null);
    }

    // Get all chunks belonging to a document
    public List<KnowledgeChunk> getChunksByDocumentId(Long documentId) {

        return knowledgeChunkRepository
                .findByDocumentDocumentIdOrderByChunkIndexAsc(documentId);
    }

    // Delete a chunk
    public void deleteChunk(Long chunkId) {

        knowledgeChunkRepository.deleteById(chunkId);
    }

    // Delete all chunks belonging to a document
    public void deleteChunksByDocumentId(Long documentId) {

        knowledgeChunkRepository.deleteByDocumentDocumentId(documentId);
    }
}
