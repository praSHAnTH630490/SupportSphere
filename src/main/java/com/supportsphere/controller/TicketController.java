package com.supportsphere.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.supportsphere.entity.Ticket;
import com.supportsphere.service.TicketService;
import com.supportsphere.controller.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // Create ticket
    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.saveTicket(ticket);
    }

    // Get all tickets
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // Get ticket by ID
    @GetMapping("/{ticketId}")
    public Ticket getTicketById(@PathVariable Long ticketId) {
        return ticketService.getTicketById(ticketId);
    }

    // Update complete ticket
    @PutMapping("/{ticketId}")
    public Ticket updateTicket(
            @PathVariable Long ticketId,
            @RequestBody Ticket ticket) {

        return ticketService.updateTicket(ticketId, ticket);
    }

    // Assign ticket to agent
    @PutMapping("/{ticketId}/assign/{agentId}")
    public Ticket assignAgent(
            @PathVariable Long ticketId,
            @PathVariable Long agentId) {

        return ticketService.assignAgent(ticketId, agentId);
    }

   @PutMapping("/{ticketId}/status")
public Ticket changeStatus(
        @PathVariable Long ticketId,
        @RequestBody StatusRequest request) {

    return ticketService.changeStatus(ticketId, request.getStatus());
}

    // Change ticket priority
@PutMapping("/{ticketId}/priority")
public Ticket changePriority(
        @PathVariable Long ticketId,
        @RequestBody PriorityRequest request) {
    return ticketService.changePriority(ticketId, request.getPriority());
}

    // Close ticket
    @PutMapping("/{ticketId}/close")
    public Ticket closeTicket(@PathVariable Long ticketId) {
        return ticketService.closeTicket(ticketId);
    }

    // Get tickets by customer
@GetMapping("/customer/{customerId}")
public List<Ticket> getTicketsByCustomer(
        @PathVariable Long customerId) {

    return ticketService.getTicketsByCustomer(customerId);
}

// Get tickets assigned to agent
@GetMapping("/agent/{agentId}")
public List<Ticket> getTicketsByAgent(@PathVariable Long agentId) {
    return ticketService.getTicketsByAgent(agentId);
}

    // Delete ticket
    @DeleteMapping("/{ticketId}")
    public void deleteTicket(@PathVariable Long ticketId) {
        ticketService.deleteTicket(ticketId);
    }
}
