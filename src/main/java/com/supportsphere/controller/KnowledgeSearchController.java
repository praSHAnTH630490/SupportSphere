package com.supportsphere.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.supportsphere.entity.KnowledgeChunk;
import com.supportsphere.service.KnowledgeSearchService;

@RestController
@RequestMapping("/api/knowledge/search")
public class KnowledgeSearchController {

    private final KnowledgeSearchService knowledgeSearchService;

    public KnowledgeSearchController(
            KnowledgeSearchService knowledgeSearchService) {

        this.knowledgeSearchService = knowledgeSearchService;
    }

    @GetMapping
    public ResponseEntity<List<KnowledgeChunk>> searchKnowledge(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                knowledgeSearchService.search(keyword)
        );
    }
}
