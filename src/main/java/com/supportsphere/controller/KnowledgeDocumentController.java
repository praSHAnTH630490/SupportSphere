package com.supportsphere.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.supportsphere.entity.KnowledgeDocument;
import com.supportsphere.service.KnowledgeDocumentService;

@RestController
@RequestMapping("/api/knowledge/documents")
public class KnowledgeDocumentController {

    private final KnowledgeDocumentService knowledgeDocumentService;

    public KnowledgeDocumentController(
            KnowledgeDocumentService knowledgeDocumentService) {

        this.knowledgeDocumentService = knowledgeDocumentService;
    }

    // Create document
    @PostMapping
    public ResponseEntity<KnowledgeDocument> createDocument(
            @RequestBody KnowledgeDocument document) {

        return ResponseEntity.ok(
                knowledgeDocumentService.createDocument(document)
        );
    }

    // Get all documents
    @GetMapping
    public ResponseEntity<List<KnowledgeDocument>> getAllDocuments() {

        return ResponseEntity.ok(
                knowledgeDocumentService.getAllDocuments()
        );
    }

    // Get document by ID
    @GetMapping("/{documentId}")
    public ResponseEntity<KnowledgeDocument> getDocumentById(
            @PathVariable Long documentId) {

        KnowledgeDocument document =
                knowledgeDocumentService.getDocumentById(documentId);

        if (document == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(document);
    }

    // Get documents by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<KnowledgeDocument>> getDocumentsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                knowledgeDocumentService.getDocumentsByStatus(status)
        );
    }

    // Update document
    @PutMapping("/{documentId}")
    public ResponseEntity<KnowledgeDocument> updateDocument(
            @PathVariable Long documentId,
            @RequestBody KnowledgeDocument document) {

        KnowledgeDocument updated =
                knowledgeDocumentService.updateDocument(
                        documentId,
                        document
                );

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }

    // Update document status
    @PatchMapping("/{documentId}/status")
    public ResponseEntity<KnowledgeDocument> updateStatus(
            @PathVariable Long documentId,
            @RequestParam String status) {

        KnowledgeDocument updated =
                knowledgeDocumentService.updateStatus(
                        documentId,
                        status
                );

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }

    // Delete document
    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long documentId) {

        KnowledgeDocument document =
                knowledgeDocumentService.getDocumentById(documentId);

        if (document == null) {
            return ResponseEntity.notFound().build();
        }

        knowledgeDocumentService.deleteDocument(documentId);

        return ResponseEntity.noContent().build();
    }
}
