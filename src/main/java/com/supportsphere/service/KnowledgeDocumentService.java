package com.supportsphere.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.KnowledgeDocument;
import com.supportsphere.entity.User;
import com.supportsphere.repository.KnowledgeDocumentRepository;
import com.supportsphere.repository.UserRepository;
import com.supportsphere.security.SecurityUtil;

@Service
public class KnowledgeDocumentService {

    private final KnowledgeDocumentRepository knowledgeDocumentRepository;
    private final UserRepository userRepository;

    public KnowledgeDocumentService(
            KnowledgeDocumentRepository knowledgeDocumentRepository,
            UserRepository userRepository) {

        this.knowledgeDocumentRepository = knowledgeDocumentRepository;
        this.userRepository = userRepository;
    }

    // Create a new knowledge document
    public KnowledgeDocument createDocument(KnowledgeDocument document) {

        String email = SecurityUtil.getLoggedInEmail();

        if (email == null) {
            throw new RuntimeException("User is not authenticated.");
        }

        User uploadedBy = userRepository.findByEmail(email);

        if (uploadedBy == null) {
            throw new RuntimeException("Authenticated user not found.");
        }

        document.setUploadedBy(uploadedBy);

        LocalDateTime now = LocalDateTime.now();

        document.setCreatedAt(now);
        document.setUpdatedAt(now);

        if (document.getStatus() == null || document.getStatus().isBlank()) {
            document.setStatus("PENDING");
        }

        return knowledgeDocumentRepository.save(document);
    }

    // Get all knowledge documents
    public List<KnowledgeDocument> getAllDocuments() {

        return knowledgeDocumentRepository.findAll();
    }

    // Get document by ID
    public KnowledgeDocument getDocumentById(Long documentId) {

        return knowledgeDocumentRepository
                .findById(documentId)
                .orElse(null);
    }

    // Get documents by status
    public List<KnowledgeDocument> getDocumentsByStatus(String status) {

        return knowledgeDocumentRepository.findByStatus(status);
    }

    // Update document
    public KnowledgeDocument updateDocument(
            Long documentId,
            KnowledgeDocument updatedDocument) {

        KnowledgeDocument existingDocument =
                knowledgeDocumentRepository
                        .findById(documentId)
                        .orElse(null);

        if (existingDocument == null) {
            return null;
        }

        existingDocument.setTitle(updatedDocument.getTitle());
        existingDocument.setDescription(updatedDocument.getDescription());
        existingDocument.setFileUrl(updatedDocument.getFileUrl());

        if (updatedDocument.getStatus() != null
                && !updatedDocument.getStatus().isBlank()) {

            existingDocument.setStatus(updatedDocument.getStatus());
        }

        existingDocument.setUpdatedAt(LocalDateTime.now());

        return knowledgeDocumentRepository.save(existingDocument);
    }

    // Update document status
    public KnowledgeDocument updateStatus(
            Long documentId,
            String status) {

        KnowledgeDocument document =
                knowledgeDocumentRepository
                        .findById(documentId)
                        .orElse(null);

        if (document == null) {
            return null;
        }

        document.setStatus(status);
        document.setUpdatedAt(LocalDateTime.now());

        return knowledgeDocumentRepository.save(document);
    }

    // Delete document
    public void deleteDocument(Long documentId) {

        knowledgeDocumentRepository.deleteById(documentId);
    }
}
