package com.supportsphere.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.Customer;
import com.supportsphere.entity.Feedback;
import com.supportsphere.entity.Ticket;
import com.supportsphere.repository.CustomerRepository;
import com.supportsphere.repository.FeedbackRepository;
import com.supportsphere.repository.TicketRepository;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final TicketRepository ticketRepository;
    private final CustomerRepository customerRepository;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            TicketRepository ticketRepository,
            CustomerRepository customerRepository) {

        this.feedbackRepository = feedbackRepository;
        this.ticketRepository = ticketRepository;
        this.customerRepository = customerRepository;
    }

    public Feedback saveFeedback(
            Long ticketId,
            Long customerId,
            Integer rating,
            String comment) {

        // Rating must be between 1 and 5
        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        // Find ticket
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        // Feedback can only be submitted after resolution
        if (!"RESOLVED".equalsIgnoreCase(ticket.getStatus())
                && !"CLOSED".equalsIgnoreCase(ticket.getStatus())) {

            throw new RuntimeException(
                    "Feedback can only be submitted for resolved tickets");
        }

        // Check whether feedback already exists
        boolean feedbackExists = feedbackRepository.findAll()
                .stream()
                .anyMatch(feedback ->
                        feedback.getTicket().getTicketId().equals(ticketId));

        if (feedbackExists) {
            throw new RuntimeException(
                    "Feedback has already been submitted for this ticket");
        }

        // Find customer
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        // Create feedback
        Feedback feedback = new Feedback();

        feedback.setTicket(ticket);
        feedback.setCustomer(customer);
        feedback.setRating(rating);
        feedback.setComment(comment);
        feedback.setCreatedAt(LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedback() {

        return feedbackRepository.findAll();
    }

    public Feedback getFeedbackById(Long feedbackId) {

        return feedbackRepository.findById(feedbackId)
                .orElse(null);
    }

    public void deleteFeedback(Long feedbackId) {

        feedbackRepository.deleteById(feedbackId);
    }
}
