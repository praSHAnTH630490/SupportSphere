package com.supportsphere.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.AIConversation;
import com.supportsphere.entity.AIMessage;
import com.supportsphere.entity.Ticket;
import com.supportsphere.entity.User;
import com.supportsphere.entity.TicketMessage;
import com.supportsphere.repository.TicketMessageRepository;
import com.supportsphere.security.SecurityUtil;

@Service
public class AIChatService {

    private final AIService aiService;
    private final AIConversationService aiConversationService;
    private final AIMessageService aiMessageService;
    private final TicketService ticketService;
    private final TicketMessageRepository ticketMessageRepository;
    private final RAGService ragService;

    public AIChatService(
            AIService aiService,
            AIConversationService aiConversationService,
            AIMessageService aiMessageService,
            TicketService ticketService,
            TicketMessageRepository ticketMessageRepository,
            RAGService ragService) {

        this.aiService = aiService;
        this.aiConversationService = aiConversationService;
        this.aiMessageService = aiMessageService;
        this.ticketService = ticketService;
        this.ticketMessageRepository = ticketMessageRepository;
        this.ragService = ragService;
    }

    public String chat(Long conversationId, String userMessage) {

        AIConversation conversation =
                aiConversationService.getConversationById(conversationId);

        if (conversation == null) {
            throw new RuntimeException("AI conversation not found.");
        }

        String loggedInEmail = SecurityUtil.getLoggedInEmail();

        if (loggedInEmail == null) {
            throw new RuntimeException("User is not authenticated.");
        }

        if (conversation.getUser() == null
                || conversation.getUser().getEmail() == null
                || !conversation.getUser().getEmail().equals(loggedInEmail)) {

            throw new RuntimeException(
                    "You are not authorized to access this AI conversation."
            );
        }

        if (userMessage == null || userMessage.isBlank()) {
            throw new RuntimeException("Message cannot be empty.");
        }

        // ---------------------------------------------------------
        // Save user's message
        // ---------------------------------------------------------

        AIMessage userMessageEntity = new AIMessage();

        userMessageEntity.setConversation(conversation);
        userMessageEntity.setSenderType("USER");
        userMessageEntity.setMessage(userMessage);

        aiMessageService.saveMessage(userMessageEntity);

        // ---------------------------------------------------------
        // Get relevant customer ticket information
        // ---------------------------------------------------------

        User loggedInUser = ticketService.getLoggedInUser();

        List<Ticket> tickets = List.of();

        if (loggedInUser != null
                && loggedInUser.getRole() != null
                && "CUSTOMER".equals(
                        loggedInUser.getRole().getRoleName())) {

            /*
             * If the customer mentions a ticket number,
             * load only that specific ticket.
             */

            Long mentionedTicketId = extractTicketId(userMessage);

            if (mentionedTicketId != null) {

                Ticket ticket =
                        ticketService.getTicketById(mentionedTicketId);

                if (ticket != null) {
                    tickets = List.of(ticket);
                }

            } else {

                /*
                 * No specific ticket mentioned.
                 * Provide the customer's tickets as context.
                 */

                tickets = ticketService.getAllTickets();
            }
        }

        // ---------------------------------------------------------
        // Build ticket context
        // ---------------------------------------------------------

        StringBuilder ticketContext = new StringBuilder();

        if (!tickets.isEmpty()) {

            ticketContext.append(
                    "\n\nCustomer's SupportSphere ticket information:\n"
            );

            for (Ticket ticket : tickets) {

                ticketContext.append(
                        "Ticket #"
                ).append(ticket.getTicketId());

                ticketContext.append(
                        " | Subject: "
                ).append(ticket.getSubject());

                ticketContext.append(
                        " | Status: "
                ).append(ticket.getStatus());

                ticketContext.append(
                        " | Priority: "
                ).append(ticket.getPriority());

                ticketContext.append(
                        " | Description: "
                ).append(ticket.getDescription());

                ticketContext.append("\n");

                List<TicketMessage> ticketMessages =
                        ticketMessageRepository.findByTicketTicketId(
                                ticket.getTicketId()
                        );

                if (!ticketMessages.isEmpty()) {

                    ticketContext.append("Ticket conversation:\n");

                    for (TicketMessage ticketMessage : ticketMessages) {

                        // Do not expose internal support messages
                        // to the customer AI.

                        if (Boolean.TRUE.equals(
                                ticketMessage.getIsInternal())) {
                            continue;
                        }

                        ticketContext.append("- ")
                                .append(ticketMessage.getMessage())
                                .append("\n");
                    }
                }
            }

            ticketContext.append(
                    "\nUse this ticket information when it is relevant "
                    + "to the customer's question. "
                    + "Do not invent ticket information."
            );
        }

        // ---------------------------------------------------------
        // Get relevant knowledge from the Knowledge Base
        // ---------------------------------------------------------

        String knowledgeContext =
                ragService.buildKnowledgeContext(userMessage);

        StringBuilder knowledgeSection = new StringBuilder();

        if (!knowledgeContext.isBlank()) {

            knowledgeSection.append(
                    "\n\nSupportSphere Knowledge Base information:\n"
            );

            knowledgeSection.append(knowledgeContext);

            knowledgeSection.append(
        "\n\nIMPORTANT KNOWLEDGE BASE INSTRUCTIONS:\n"
        + "1. Prefer the SupportSphere Knowledge Base when it "
        + "contains information relevant to the customer's question.\n"
        + "2. Treat the Knowledge Base as the source of truth for "
        + "SupportSphere-specific procedures, policies, and instructions.\n"
        + "3. Do not contradict the Knowledge Base.\n"
        + "4. Do not invent SupportSphere-specific information that "
        + "is not present in the Knowledge Base or ticket information.\n"
        + "5. If the Knowledge Base does not contain relevant information, "
        + "you may answer general questions using your general knowledge, "
        + "but do not present that information as SupportSphere policy."
);
        }

        // ---------------------------------------------------------
        // Build final AI prompt
        // ---------------------------------------------------------

        String aiPrompt =
                userMessage
                + ticketContext.toString()
                + knowledgeSection.toString();

        // ---------------------------------------------------------
        // Send prompt to AI
        // ---------------------------------------------------------

        String aiResponse =
                aiService.generateResponse(aiPrompt);

        // ---------------------------------------------------------
        // Save AI response
        // ---------------------------------------------------------

        AIMessage aiMessageEntity = new AIMessage();

        aiMessageEntity.setConversation(conversation);
        aiMessageEntity.setSenderType("AI");
        aiMessageEntity.setMessage(aiResponse);

        aiMessageService.saveMessage(aiMessageEntity);

        return aiResponse;
    }

    // ---------------------------------------------------------
    // Extract ticket ID from customer message
    // ---------------------------------------------------------

    private Long extractTicketId(String message) {

        if (message == null || message.isBlank()) {
            return null;
        }

        String lowerMessage = message.toLowerCase();

        int ticketIndex = lowerMessage.indexOf("ticket");

        if (ticketIndex == -1) {
            return null;
        }

        String remaining =
                message.substring(
                        ticketIndex + "ticket".length()
                ).trim();

        if (remaining.startsWith("#")) {
            remaining = remaining.substring(1).trim();
        }

        StringBuilder number = new StringBuilder();

        for (char character : remaining.toCharArray()) {

            if (Character.isDigit(character)) {

                number.append(character);

            } else if (number.length() > 0) {

                break;
            }
        }

        if (number.length() == 0) {
            return null;
        }

        try {

            return Long.parseLong(number.toString());

        } catch (NumberFormatException exception) {

            return null;
        }
    }
}
