package com.supportsphere.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.Agent;
import com.supportsphere.entity.Customer;
import com.supportsphere.entity.Ticket;
import com.supportsphere.entity.User;
import com.supportsphere.repository.AgentRepository;
import com.supportsphere.repository.CustomerRepository;
import com.supportsphere.repository.TicketRepository;
import com.supportsphere.repository.UserRepository;
import com.supportsphere.security.SecurityUtil;
import com.supportsphere.entity.Category;
import com.supportsphere.repository.CategoryRepository;
import com.supportsphere.repository.NotificationRepository;
import com.supportsphere.entity.Notification;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final AgentRepository agentRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final CategoryRepository categoryRepository;
    private final NotificationRepository notificationRepository;

    public TicketService(
        TicketRepository ticketRepository,
        AgentRepository agentRepository,
        UserRepository userRepository,
        CustomerRepository customerRepository,
        CategoryRepository categoryRepository,
        NotificationRepository notificationRepository) {

    this.ticketRepository = ticketRepository;
    this.agentRepository = agentRepository;
    this.userRepository = userRepository;
    this.customerRepository = customerRepository;
    this.categoryRepository = categoryRepository;
    this.notificationRepository = notificationRepository;
}

    // Get currently logged-in user
    public User getLoggedInUser() {

        String email = SecurityUtil.getLoggedInEmail();

        if (email == null) {
            return null;
        }

        return userRepository.findByEmail(email);
    }

    // Create ticket
    public Ticket saveTicket(Ticket ticket) {

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return null;
    }

    String role = loggedInUser.getRole().getRoleName();

    // Only CUSTOMER can create a ticket
    if (!"CUSTOMER".equals(role)) {
        return null;
    }

    Customer customer =
            customerRepository.findByUserId(
                    loggedInUser.getUserId());

    if (customer == null) {
        return null;
    }

    // Always use the logged-in customer
    // instead of trusting the customer sent in JSON
    ticket.setCustomer(customer);

    // Set category
    if (ticket.getCategory() != null
            && ticket.getCategory().getCategoryId() != null) {

        Category category =
                categoryRepository.findById(
                        ticket.getCategory().getCategoryId()
                ).orElse(null);

        if (category == null) {
            return null;
        }

        ticket.setCategory(category);
    }

    ticket.setCreatedAt(LocalDateTime.now());

ticket.setUpdatedAt(LocalDateTime.now());

Ticket savedTicket = ticketRepository.save(ticket);

// Create notification for the customer
Notification notification = new Notification();

notification.setUser(loggedInUser);
notification.setTitle("Ticket Created");
notification.setMessage(
        "Your support ticket #" + savedTicket.getTicketId()
        + " has been created successfully."
);
notification.setType("TICKET_CREATED");
notification.setIsRead(false);
notification.setCreatedAt(LocalDateTime.now());

notificationRepository.save(notification);

return savedTicket;
}

    // Get all tickets based on logged-in user's role
    public List<Ticket> getAllTickets() {

        User loggedInUser = getLoggedInUser();

        if (loggedInUser == null) {
            return List.of();
        }

        String role = loggedInUser.getRole().getRoleName();

        // ADMIN can see all tickets
        if ("ADMIN".equals(role)) {
            return ticketRepository.findAll();
        }

        // CUSTOMER can see only their own tickets
        if ("CUSTOMER".equals(role)) {

            Customer customer =
                    customerRepository.findByUserId(
                            loggedInUser.getUserId());

            if (customer == null) {
                return List.of();
            }

            return ticketRepository.findByCustomerCustomerId(
                    customer.getCustomerId());
        }

        // AGENT can see assigned tickets
        if ("AGENT".equals(role)) {
    Agent agent = agentRepository.findByUserUserId(loggedInUser.getUserId());

    if (agent == null) {
        return List.of();
    }

    return ticketRepository.findByAssignedAgentAgentId(
            agent.getAgentId());
}

        return List.of();
    }

    // Get ticket by ID with role-based authorization
public Ticket getTicketById(Long ticketId) {

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return null;
    }

    Ticket ticket = ticketRepository.findById(ticketId).orElse(null);

    if (ticket == null) {
        return null;
    }

    String role = loggedInUser.getRole().getRoleName();

    // ADMIN can view any ticket
    if ("ADMIN".equals(role)) {
        return ticket;
    }

    // CUSTOMER can view only their own ticket
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

        return ticket;
    }

    // AGENT can view only tickets assigned to them
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

        return ticket;
    }

    return null;
}

    // Get tickets by customer
    public List<Ticket> getTicketsByCustomer(Long customerId) {

        User loggedInUser = getLoggedInUser();

        if (loggedInUser == null) {
            return List.of();
        }

        String role = loggedInUser.getRole().getRoleName();

        // ADMIN can view any customer's tickets
        if ("ADMIN".equals(role)) {
            return ticketRepository.findByCustomerCustomerId(customerId);
        }

        // CUSTOMER can view only their own tickets
        if ("CUSTOMER".equals(role)) {

            Customer customer =
                    customerRepository.findByUserId(
                            loggedInUser.getUserId());

            if (customer == null) {
                return List.of();
            }

            if (!customer.getCustomerId().equals(customerId)) {
                return List.of();
            }

            return ticketRepository.findByCustomerCustomerId(customerId);
        }

        return List.of();
    }

    // Get tickets assigned to an agent
    public List<Ticket> getTicketsByAgent(Long agentId) {

        User loggedInUser = getLoggedInUser();

        if (loggedInUser == null) {
            return List.of();
        }

        String role = loggedInUser.getRole().getRoleName();

        // ADMIN can view any agent's tickets
        if ("ADMIN".equals(role)) {
            return ticketRepository.findByAssignedAgentAgentId(agentId);
        }

        // AGENT can view only their own assigned tickets
        if ("AGENT".equals(role)) {

            Agent agent = agentRepository.findByUserUserId(loggedInUser.getUserId());

            if (agent == null) {
                return List.of();
            }

            if (!agent.getAgentId().equals(agentId)) {
                return List.of();
            }

            return ticketRepository.findByAssignedAgentAgentId(agentId);
        }

        return List.of();
    }

    // Update complete ticket
    // Update complete ticket with role-based authorization
public Ticket updateTicket(Long ticketId, Ticket ticket) {

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return null;
    }

    Ticket existingTicket =
            ticketRepository.findById(ticketId).orElse(null);

    if (existingTicket == null) {
        return null;
    }

    String role = loggedInUser.getRole().getRoleName();

    // ADMIN can update any ticket
    if ("ADMIN".equals(role)) {

        existingTicket.setSubject(ticket.getSubject());
        existingTicket.setDescription(ticket.getDescription());
        existingTicket.setPriority(ticket.getPriority());
        existingTicket.setStatus(ticket.getStatus());
        existingTicket.setCategory(ticket.getCategory());
        existingTicket.setAssignedAgent(ticket.getAssignedAgent());

    }

    // AGENT can update only tickets assigned to them
    else if ("AGENT".equals(role)) {

        Agent agent =
                agentRepository.findByUserUserId(
                        loggedInUser.getUserId());

        if (agent == null) {
            return null;
        }

        if (existingTicket.getAssignedAgent() == null) {
            return null;
        }

        if (!agent.getAgentId()
                .equals(existingTicket.getAssignedAgent().getAgentId())) {
            return null;
        }

        existingTicket.setSubject(ticket.getSubject());
        existingTicket.setDescription(ticket.getDescription());
        existingTicket.setPriority(ticket.getPriority());
        existingTicket.setStatus(ticket.getStatus());
        existingTicket.setCategory(ticket.getCategory());
    }

    // CUSTOMER can update only their own ticket
    else if ("CUSTOMER".equals(role)) {

        Customer customer =
                customerRepository.findByUserId(
                        loggedInUser.getUserId());

        if (customer == null) {
            return null;
        }

        if (existingTicket.getCustomer() == null) {
            return null;
        }

        if (!customer.getCustomerId()
                .equals(existingTicket.getCustomer().getCustomerId())) {
            return null;
        }

        existingTicket.setSubject(ticket.getSubject());
        existingTicket.setDescription(ticket.getDescription());
        existingTicket.setPriority(ticket.getPriority());
    }

    else {
        return null;
    }

    existingTicket.setUpdatedAt(LocalDateTime.now());

    return ticketRepository.save(existingTicket);
}

    // Assign ticket to agent
    // Assign ticket to agent
public Ticket assignAgent(Long ticketId, Long agentId) {

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return null;
    }

    String role = loggedInUser.getRole().getRoleName();

    // Only ADMIN can assign tickets
    if (!"ADMIN".equals(role)) {
        return null;
    }

    Ticket ticket =
            ticketRepository.findById(ticketId).orElse(null);

    if (ticket == null) {
        return null;
    }

    Agent agent =
            agentRepository.findById(agentId).orElse(null);

    if (agent == null) {
        return null;
    }

    ticket.setAssignedAgent(agent);
ticket.setStatus("ASSIGNED");
ticket.setUpdatedAt(LocalDateTime.now());

Ticket savedTicket = ticketRepository.save(ticket);

// Create notification for the assigned agent
Notification notification = new Notification();

notification.setUser(agent.getUser());
notification.setTitle("New Ticket Assigned");
notification.setMessage(
        "Ticket #" + savedTicket.getTicketId()
        + " has been assigned to you."
);
notification.setType("TICKET_ASSIGNED");
notification.setIsRead(false);
notification.setCreatedAt(LocalDateTime.now());

notificationRepository.save(notification);

return savedTicket;
}

    // Change ticket status
public Ticket changeStatus(Long ticketId, String status) {

    Ticket ticket =
            ticketRepository.findById(ticketId).orElse(null);

    if (ticket == null) {
        return null;
    }

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return null;
    }

    String role = loggedInUser.getRole().getRoleName();

    // CUSTOMER cannot change ticket status
    if ("CUSTOMER".equals(role)) {
        return null;
    }

    // AGENT can change status only for assigned tickets
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
    }

    // ADMIN can change any ticket status
    ticket.setStatus(status);

    ticket.setUpdatedAt(LocalDateTime.now());

    if ("RESOLVED".equals(status)) {
        ticket.setResolvedAt(LocalDateTime.now());
    }

    if ("CLOSED".equals(status)) {
        ticket.setClosedAt(LocalDateTime.now());
    }

    return ticketRepository.save(ticket);
}


    // Change ticket priority
public Ticket changePriority(Long ticketId, String priority) {

    Ticket ticket =
            ticketRepository.findById(ticketId).orElse(null);

    if (ticket == null) {
        return null;
    }

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return null;
    }

    String role = loggedInUser.getRole().getRoleName();

    // CUSTOMER cannot change ticket priority
    if ("CUSTOMER".equals(role)) {
        return null;
    }

    // AGENT can change priority only for assigned tickets
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
    }

    // ADMIN can change any ticket priority
    ticket.setPriority(priority);

    ticket.setUpdatedAt(LocalDateTime.now());

    return ticketRepository.save(ticket);
}

    // Close ticket
    public Ticket closeTicket(Long ticketId) {

    Ticket ticket =
            ticketRepository.findById(ticketId).orElse(null);

    if (ticket == null) {
        return null;
    }

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return null;
    }

    String role = loggedInUser.getRole().getRoleName();

    // CUSTOMER cannot close tickets
    if ("CUSTOMER".equals(role)) {
        return null;
    }

    // AGENT can close only their assigned ticket
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
    }

    // ADMIN can close any ticket
    ticket.setStatus("CLOSED");
    ticket.setClosedAt(LocalDateTime.now());
    ticket.setUpdatedAt(LocalDateTime.now());

    return ticketRepository.save(ticket);
}

    // Delete ticket
    public void deleteTicket(Long ticketId) {

    Ticket ticket =
            ticketRepository.findById(ticketId).orElse(null);

    if (ticket == null) {
        return;
    }

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return;
    }

    String role = loggedInUser.getRole().getRoleName();

    // Only ADMIN can delete tickets
    if (!"ADMIN".equals(role)) {
        return;
    }

    ticketRepository.deleteById(ticketId);
}
}
