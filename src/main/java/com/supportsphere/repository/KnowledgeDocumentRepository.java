package com.supportsphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.supportsphere.entity.KnowledgeDocument;

public interface KnowledgeDocumentRepository
        extends JpaRepository<KnowledgeDocument, Long> {

    List<KnowledgeDocument> findByStatus(String status);

    List<KnowledgeDocument> findByUploadedByUserId(Long userId);
}
