package com.supportsphere.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.TicketMessage;
import com.supportsphere.entity.User;
import com.supportsphere.repository.TicketMessageRepository;
import com.supportsphere.repository.TicketRepository;
import com.supportsphere.entity.Agent;
import com.supportsphere.entity.Customer;
import com.supportsphere.entity.Ticket;
import com.supportsphere.repository.AgentRepository;
import com.supportsphere.repository.CustomerRepository;
import com.supportsphere.repository.UserRepository;
import com.supportsphere.security.SecurityUtil;
import com.supportsphere.entity.Notification;
import com.supportsphere.repository.NotificationRepository;

@Service
public class TicketMessageService {

    private final TicketMessageRepository ticketMessageRepository;

    private final AgentRepository agentRepository;

    private final CustomerRepository customerRepository;

    private final UserRepository userRepository;

    private final TicketRepository ticketRepository;

    private final NotificationRepository notificationRepository;

    public TicketMessageService(
            TicketMessageRepository ticketMessageRepository,
            AgentRepository agentRepository,
            CustomerRepository customerRepository,
            UserRepository userRepository,
            TicketRepository ticketRepository,
            NotificationRepository notificationRepository) {

        this.ticketMessageRepository = ticketMessageRepository;
        this.agentRepository = agentRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
        this.notificationRepository = notificationRepository;
    }

    private void createCustomerNotification(
            Ticket ticket,
            User sender) {

        if (ticket == null ||
                ticket.getCustomer() == null ||
                ticket.getCustomer().getUser() == null) {
            return;
        }

        // Don't notify the customer if the customer is the sender
        if (ticket.getCustomer().getUser().getUserId()
                .equals(sender.getUserId())) {
            return;
        }

        Notification notification = new Notification();

        notification.setUser(ticket.getCustomer().getUser());

        notification.setTitle("New Reply on Your Ticket");

        notification.setMessage(
                "There is a new reply on ticket #"
                + ticket.getTicketId()
                + "."
        );

        notification.setType("TICKET_REPLY");

        notification.setIsRead(false);

        notification.setCreatedAt(
                java.time.LocalDateTime.now()
        );

        notificationRepository.save(notification);
    }

    public User getLoggedInUser() {

        String email = SecurityUtil.getLoggedInEmail();

        if (email == null) {
            return null;
        }

        return userRepository.findByEmail(email);
    }

    public TicketMessage saveMessage(TicketMessage message) {

        User loggedInUser = getLoggedInUser();

        if (loggedInUser == null) {
            return null;
        }

        if (message == null ||
                message.getTicket() == null ||
                message.getTicket().getTicketId() == null) {
            return null;
        }

        // Load the complete ticket from database
        Ticket ticket =
                ticketRepository.findById(
                        message.getTicket().getTicketId())
                        .orElse(null);

        if (ticket == null) {
            return null;
        }

        String role = loggedInUser.getRole().getRoleName();

        // ADMIN can send messages to any ticket
        if ("ADMIN".equals(role)) {

            message.setTicket(ticket);
            message.setSender(loggedInUser);
            message.setCreatedAt(
                    java.time.LocalDateTime.now());

            TicketMessage savedMessage =
                    ticketMessageRepository.save(message);

            createCustomerNotification(
                    ticket,
                    loggedInUser);

            return savedMessage;
        }

        // CUSTOMER can send messages only to their own ticket
        if ("CUSTOMER".equals(role)) {

            Customer customer =
                    customerRepository.findByUserId(
                            loggedInUser.getUserId());

            if (customer == null) {
                return null;
            }

            if (ticket.getCustomer() == null) {
                return null;
            }

            if (!customer.getCustomerId()
                    .equals(ticket.getCustomer().getCustomerId())) {
                return null;
            }

            message.setTicket(ticket);
            message.setSender(loggedInUser);
            message.setCreatedAt(
                    java.time.LocalDateTime.now());

            TicketMessage savedMessage =
                    ticketMessageRepository.save(message);

            createCustomerNotification(
                    ticket,
                    loggedInUser);

            return savedMessage;
        }

        // AGENT can send messages only to tickets assigned to them
        if ("AGENT".equals(role)) {

            Agent agent =
                    agentRepository.findByUserUserId(
                            loggedInUser.getUserId());

            if (agent == null) {
                return null;
            }

            if (ticket.getAssignedAgent() == null) {
                return null;
            }

            if (!agent.getAgentId()
                    .equals(ticket.getAssignedAgent().getAgentId())) {
                return null;
            }

            message.setTicket(ticket);
            message.setSender(loggedInUser);
            message.setCreatedAt(
                    java.time.LocalDateTime.now());

            TicketMessage savedMessage =
                    ticketMessageRepository.save(message);

            createCustomerNotification(
                    ticket,
                    loggedInUser);

            return savedMessage;
        }

        return null;
    }

    public List<TicketMessage> getAllMessages() {

        User loggedInUser = getLoggedInUser();

        if (loggedInUser == null) {
            return List.of();
        }

        String role = loggedInUser.getRole().getRoleName();

        // ADMIN can see all messages
        if ("ADMIN".equals(role)) {
            return ticketMessageRepository.findAll();
        }

        // CUSTOMER can see messages from their own tickets
        if ("CUSTOMER".equals(role)) {

            Customer customer =
                    customerRepository.findByUserId(
                            loggedInUser.getUserId());

            if (customer == null) {
                return List.of();
            }

            List<TicketMessage> allMessages =
                    ticketMessageRepository.findAll();

            return allMessages.stream()
                    .filter(message ->
                            message.getTicket() != null &&
                            message.getTicket().getCustomer() != null &&
                            customer.getCustomerId()
                                    .equals(message.getTicket()
                                            .getCustomer()
                                            .getCustomerId()))
                    .toList();
        }

        // AGENT can see messages from tickets assigned to them
        if ("AGENT".equals(role)) {

            Agent agent =
                    agentRepository.findByUserUserId(
                            loggedInUser.getUserId());

            if (agent == null) {
                return List.of();
            }

            List<TicketMessage> allMessages =
                    ticketMessageRepository.findAll();

            return allMessages.stream()
                    .filter(message ->
                            message.getTicket() != null &&
                            message.getTicket().getAssignedAgent() != null &&
                            agent.getAgentId()
                                    .equals(message.getTicket()
                                            .getAssignedAgent()
                                            .getAgentId()))
                    .toList();
        }

        return List.of();
    }

    public List<TicketMessage> getMessagesByTicket(Long ticketId) {

        User loggedInUser = getLoggedInUser();

        if (loggedInUser == null) {
            return List.of();
        }

        if (ticketId == null) {
            return List.of();
        }

        Ticket ticket = ticketRepository
                .findById(ticketId)
                .orElse(null);

        if (ticket == null) {
            return List.of();
        }

        String role = loggedInUser.getRole().getRoleName();

        // ADMIN can see messages from any ticket
        if ("ADMIN".equals(role)) {

            return ticketMessageRepository
                    .findByTicketTicketId(ticketId);
        }

        // CUSTOMER can see messages only from their own ticket
        if ("CUSTOMER".equals(role)) {

            Customer customer =
                    customerRepository.findByUserId(
                            loggedInUser.getUserId());

            if (customer == null) {
                return List.of();
            }

            if (ticket.getCustomer() == null) {
                return List.of();
            }

            if (!customer.getCustomerId()
                    .equals(ticket.getCustomer().getCustomerId())) {
                return List.of();
            }

            return ticketMessageRepository
                    .findByTicketTicketId(ticketId);
        }

        // AGENT can see messages only from tickets assigned to them
        if ("AGENT".equals(role)) {

            Agent agent =
                    agentRepository.findByUserUserId(
                            loggedInUser.getUserId());

            if (agent == null) {
                return List.of();
            }

            if (ticket.getAssignedAgent() == null) {
                return List.of();
            }

            if (!agent.getAgentId()
                    .equals(ticket.getAssignedAgent().getAgentId())) {
                return List.of();
            }

            return ticketMessageRepository
                    .findByTicketTicketId(ticketId);
        }

        return List.of();
    }

    public TicketMessage getMessageById(Long messageId) {

        User loggedInUser = getLoggedInUser();

        if (loggedInUser == null) {
            return null;
        }

        TicketMessage message =
                ticketMessageRepository.findById(messageId)
                        .orElse(null);

        if (message == null) {
            return null;
        }

        String role = loggedInUser.getRole().getRoleName();

        // ADMIN can view any message
        if ("ADMIN".equals(role)) {
            return message;
        }

        // Message must belong to a ticket
        if (message.getTicket() == null) {
            return null;
        }

        Ticket ticket = message.getTicket();

        // CUSTOMER can view messages only from their own ticket
        if ("CUSTOMER".equals(role)) {

            Customer customer =
                    customerRepository.findByUserId(
                            loggedInUser.getUserId());

            if (customer == null) {
                return null;
            }

            if (ticket.getCustomer() == null) {
                return null;
            }

            if (!customer.getCustomerId()
                    .equals(ticket.getCustomer().getCustomerId())) {
                return null;
            }

            return message;
        }

        // AGENT can view messages only from assigned tickets
        if ("AGENT".equals(role)) {

            Agent agent =
                    agentRepository.findByUserUserId(
                            loggedInUser.getUserId());

            if (agent == null) {
                return null;
            }

            if (ticket.getAssignedAgent() == null) {
                return null;
            }

            if (!agent.getAgentId()
                    .equals(ticket.getAssignedAgent().getAgentId())) {
                return null;
            }

            return message;
        }

        return null;
    }

    public void deleteMessage(Long messageId) {

        User loggedInUser = getLoggedInUser();

        if (loggedInUser == null) {
            return;
        }

        String role = loggedInUser.getRole().getRoleName();

        // Only ADMIN can delete messages
        if (!"ADMIN".equals(role)) {
            return;
        }

        TicketMessage message =
                ticketMessageRepository.findById(messageId)
                        .orElse(null);

        if (message == null) {
            return;
        }

        ticketMessageRepository.deleteById(messageId);
    }
}
