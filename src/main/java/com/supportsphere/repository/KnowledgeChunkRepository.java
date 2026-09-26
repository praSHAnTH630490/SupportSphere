package com.supportsphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.supportsphere.entity.KnowledgeChunk;

public interface KnowledgeChunkRepository
        extends JpaRepository<KnowledgeChunk, Long> {

    List<KnowledgeChunk> findByDocumentDocumentIdOrderByChunkIndexAsc(
            Long documentId);

    void deleteByDocumentDocumentId(Long documentId);

    @Query("""
            SELECT kc
            FROM KnowledgeChunk kc
            JOIN kc.document kd
            WHERE kd.status = 'READY'
            AND LOWER(kc.chunkText) LIKE LOWER(CONCAT('%', :keyword, '%'))
            ORDER BY kc.chunkIndex ASC
            """)
    List<KnowledgeChunk> searchChunks(
            @Param("keyword") String keyword);
}
