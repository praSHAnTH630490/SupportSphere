package com.supportsphere.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.supportsphere.entity.KnowledgeChunk;
import com.supportsphere.service.KnowledgeChunkService;

@RestController
@RequestMapping("/api/knowledge/chunks")
public class KnowledgeChunkController {

    private final KnowledgeChunkService knowledgeChunkService;

    public KnowledgeChunkController(
            KnowledgeChunkService knowledgeChunkService) {

        this.knowledgeChunkService = knowledgeChunkService;
    }

    // Create chunk
    @PostMapping
    public ResponseEntity<KnowledgeChunk> createChunk(
            @RequestBody KnowledgeChunk chunk) {

        return ResponseEntity.ok(
                knowledgeChunkService.createChunk(chunk)
        );
    }

    // Get all chunks
    @GetMapping
    public ResponseEntity<List<KnowledgeChunk>> getAllChunks() {

        return ResponseEntity.ok(
                knowledgeChunkService.getAllChunks()
        );
    }

    // Get chunk by ID
    @GetMapping("/{chunkId}")
    public ResponseEntity<KnowledgeChunk> getChunkById(
            @PathVariable Long chunkId) {

        KnowledgeChunk chunk =
                knowledgeChunkService.getChunkById(chunkId);

        if (chunk == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(chunk);
    }

    // Get all chunks for a document
    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<KnowledgeChunk>> getChunksByDocumentId(
            @PathVariable Long documentId) {

        return ResponseEntity.ok(
                knowledgeChunkService.getChunksByDocumentId(documentId)
        );
    }

    // Delete chunk
    @DeleteMapping("/{chunkId}")
    public ResponseEntity<Void> deleteChunk(
            @PathVariable Long chunkId) {

        KnowledgeChunk chunk =
                knowledgeChunkService.getChunkById(chunkId);

        if (chunk == null) {
            return ResponseEntity.notFound().build();
        }

        knowledgeChunkService.deleteChunk(chunkId);

        return ResponseEntity.noContent().build();
    }

    // Delete all chunks for a document
    @DeleteMapping("/document/{documentId}")
    public ResponseEntity<Void> deleteChunksByDocumentId(
            @PathVariable Long documentId) {

        knowledgeChunkService.deleteChunksByDocumentId(documentId);

        return ResponseEntity.noContent().build();
    }
}
