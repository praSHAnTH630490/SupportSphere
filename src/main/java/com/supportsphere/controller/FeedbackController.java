package com.supportsphere.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.supportsphere.entity.Feedback;
import com.supportsphere.service.FeedbackService;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {

        this.feedbackService = feedbackService;
    }

    // Submit feedback
    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(
            @RequestParam Long ticketId,
            @RequestParam Long customerId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String comment) {

        Feedback feedback = feedbackService.saveFeedback(
                ticketId,
                customerId,
                rating,
                comment);

        return ResponseEntity.ok(feedback);
    }

    // Get all feedback
    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {

        return ResponseEntity.ok(
                feedbackService.getAllFeedback());
    }

    // Get feedback by ID
    @GetMapping("/{feedbackId}")
    public ResponseEntity<Feedback> getFeedbackById(
            @PathVariable Long feedbackId) {

        Feedback feedback =
                feedbackService.getFeedbackById(feedbackId);

        if (feedback == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(feedback);
    }

    // Delete feedback
    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<Void> deleteFeedback(
            @PathVariable Long feedbackId) {

        feedbackService.deleteFeedback(feedbackId);

        return ResponseEntity.noContent().build();
    }
}
