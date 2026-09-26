package com.supportsphere.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.supportsphere.entity.TicketMessage;
import com.supportsphere.service.TicketMessageService;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final TicketMessageService ticketMessageService;

    public MessageController(
            TicketMessageService ticketMessageService) {

        this.ticketMessageService = ticketMessageService;
    }

    @PostMapping
    public TicketMessage createMessage(
            @RequestBody TicketMessage message) {

        return ticketMessageService.saveMessage(message);
    }

    @GetMapping
    public List<TicketMessage> getAllMessages() {

        return ticketMessageService.getAllMessages();
    }

    @GetMapping("/{messageId}")
    public TicketMessage getMessageById(
            @PathVariable Long messageId) {

        return ticketMessageService.getMessageById(messageId);
    }

    @GetMapping("/ticket/{ticketId}")
    public List<TicketMessage> getMessagesByTicket(
            @PathVariable Long ticketId) {

        return ticketMessageService
                .getMessagesByTicket(ticketId);
    }

    @DeleteMapping("/{messageId}")
    public void deleteMessage(
            @PathVariable Long messageId) {

        ticketMessageService.deleteMessage(messageId);
    }
}
