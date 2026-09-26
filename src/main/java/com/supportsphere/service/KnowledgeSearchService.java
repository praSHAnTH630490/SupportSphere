package com.supportsphere.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.KnowledgeChunk;
import com.supportsphere.repository.KnowledgeChunkRepository;

@Service
public class KnowledgeSearchService {

    private final KnowledgeChunkRepository knowledgeChunkRepository;

    public KnowledgeSearchService(
            KnowledgeChunkRepository knowledgeChunkRepository) {

        this.knowledgeChunkRepository =
                knowledgeChunkRepository;
    }

    public List<KnowledgeChunk> search(String question) {

        if (question == null || question.isBlank()) {
            return new ArrayList<>();
        }

        String[] words = question
                .toLowerCase()
                .replaceAll("[^a-zA-Z0-9\\s]", " ")
                .split("\\s+");

        Map<Long, KnowledgeChunk> matchedChunks =
                new LinkedHashMap<>();

        for (String word : words) {

            if (isIgnoredWord(word)) {
                continue;
            }

            List<KnowledgeChunk> chunks =
                    knowledgeChunkRepository.searchChunks(word);

            for (KnowledgeChunk chunk : chunks) {

                if (chunk.getChunkId() != null) {
                    matchedChunks.put(
                            chunk.getChunkId(),
                            chunk
                    );
                }
            }
        }

        return new ArrayList<>(
                matchedChunks.values()
        );
    }

    private boolean isIgnoredWord(String word) {

        return word == null
                || word.length() < 3
                || word.equals("the")
                || word.equals("what")
                || word.equals("how")
                || word.equals("why")
                || word.equals("when")
                || word.equals("where")
                || word.equals("which")
                || word.equals("who")
                || word.equals("can")
                || word.equals("could")
                || word.equals("would")
                || word.equals("should")
                || word.equals("for")
                || word.equals("from")
                || word.equals("with")
                || word.equals("that")
                || word.equals("this")
                || word.equals("are")
                || word.equals("is")
                || word.equals("was")
                || word.equals("were")
                || word.equals("and")
                || word.equals("or")
                || word.equals("to")
                || word.equals("of")
                || word.equals("in")
                || word.equals("on")
                || word.equals("my")
                || word.equals("your")
                || word.equals("a")
                || word.equals("an");
    }
}
