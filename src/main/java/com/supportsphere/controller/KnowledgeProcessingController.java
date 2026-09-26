package com.supportsphere.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.supportsphere.entity.KnowledgeChunk;
import com.supportsphere.service.KnowledgeProcessingService;

@RestController
@RequestMapping("/api/knowledge/processing")
public class KnowledgeProcessingController {

    private final KnowledgeProcessingService knowledgeProcessingService;

    public KnowledgeProcessingController(
            KnowledgeProcessingService knowledgeProcessingService) {

        this.knowledgeProcessingService = knowledgeProcessingService;
    }

    @PostMapping("/{documentId}")
    public ResponseEntity<List<KnowledgeChunk>> processDocument(
            @PathVariable Long documentId,
            @RequestBody String content) {

        List<KnowledgeChunk> chunks =
                knowledgeProcessingService.processDocument(
                        documentId,
                        content
                );

        return ResponseEntity.ok(chunks);
    }
}
