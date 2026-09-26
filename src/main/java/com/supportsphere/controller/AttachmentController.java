package com.supportsphere.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.supportsphere.entity.Agent;
import com.supportsphere.entity.Attachment;
import com.supportsphere.entity.Customer;
import com.supportsphere.entity.Ticket;
import com.supportsphere.entity.User;
import com.supportsphere.repository.AgentRepository;
import com.supportsphere.repository.AttachmentRepository;
import com.supportsphere.repository.CustomerRepository;
import com.supportsphere.repository.TicketRepository;
import com.supportsphere.repository.UserRepository;
import com.supportsphere.security.SecurityUtil;

@RestController
@RequestMapping("/api/attachments")
public class AttachmentController {

    private final AttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final AgentRepository agentRepository;

    private final Path uploadDirectory =
            Paths.get("uploads").toAbsolutePath().normalize();

    public AttachmentController(
            AttachmentRepository attachmentRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository,
            CustomerRepository customerRepository,
            AgentRepository agentRepository) {

        this.attachmentRepository = attachmentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.agentRepository = agentRepository;
    }

    @PostMapping("/ticket/{ticketId}")
    public ResponseEntity<?> uploadAttachment(
            @PathVariable Long ticketId,
            @RequestParam("file") MultipartFile file) {

        try {

            if (file == null || file.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Please select a file.");
            }

            Ticket ticket =
                    ticketRepository.findById(ticketId)
                            .orElse(null);

            if (ticket == null) {
                return ResponseEntity
                        .notFound()
                        .build();
            }

            String email =
                    SecurityUtil.getLoggedInEmail();

            if (email == null) {
                return ResponseEntity
                        .status(401)
                        .body("User is not authenticated.");
            }

            User user =
                    userRepository.findByEmail(email);

            if (user == null) {
                return ResponseEntity
                        .status(401)
                        .body("User not found.");
            }

            String role =
                    user.getRole().getRoleName();

            boolean allowed = false;

            // ADMIN can upload to any ticket
            if ("ADMIN".equals(role)) {
                allowed = true;
            }

            // CUSTOMER can upload only to own ticket
            else if ("CUSTOMER".equals(role)) {

                Customer customer =
                        customerRepository.findByUserId(
                                user.getUserId()
                        );

                if (customer != null
                        && ticket.getCustomer() != null
                        && ticket.getCustomer()
                                .getCustomerId()
                                .equals(customer.getCustomerId())) {

                    allowed = true;
                }
            }

            // AGENT can upload only to assigned ticket
            else if ("AGENT".equals(role)) {

                Agent agent =
                        agentRepository.findByUserUserId(
                                user.getUserId()
                        );

                if (agent != null
                        && ticket.getAssignedAgent() != null
                        && ticket.getAssignedAgent()
                                .getAgentId()
                                .equals(agent.getAgentId())) {

                    allowed = true;
                }
            }

            if (!allowed) {
                return ResponseEntity
                        .status(403)
                        .body(
                                "You are not allowed to upload an attachment to this ticket."
                        );
            }

            Files.createDirectories(uploadDirectory);

            String originalFileName =
                    file.getOriginalFilename();

            if (originalFileName == null
                    || originalFileName.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body("Invalid file name.");
            }

            // Allowed file types
            String contentType = file.getContentType();

            Set<String> allowedTypes = Set.of(
                    "image/jpeg",
                    "image/png",
                    "application/pdf",
                    "text/plain"
            );

            if (contentType == null
                    || !allowedTypes.contains(contentType)) {

                return ResponseEntity
                        .badRequest()
                        .body("Unsupported file type.");
            }

            String fileName =
                    System.currentTimeMillis()
                    + "_"
                    + Paths.get(originalFileName)
                            .getFileName()
                            .toString();

            Path filePath =
                    uploadDirectory.resolve(fileName)
                            .normalize();

            if (!filePath.getParent()
                    .equals(
                            uploadDirectory
                                    .toAbsolutePath()
                                    .normalize()
                    )) {

                return ResponseEntity
                        .badRequest()
                        .body("Invalid file name.");
            }

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            Attachment attachment =
                    new Attachment();

            attachment.setTicket(ticket);

            attachment.setUploadedBy(user);

            attachment.setFileName(
                    originalFileName
            );

            attachment.setFileUrl(
                    "/uploads/" + fileName
            );

            attachment.setFileType(
                    file.getContentType()
            );

            attachment.setFileSize(
                    file.getSize()
            );

            attachment.setCreatedAt(
                    LocalDateTime.now()
            );

            Attachment savedAttachment =
                    attachmentRepository.save(attachment);

            return ResponseEntity.ok(savedAttachment);

        } catch (IOException e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to upload file.");
        }
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<?> getTicketAttachments(
            @PathVariable Long ticketId) {

        try {

            Ticket ticket =
                    ticketRepository.findById(ticketId)
                            .orElse(null);

            if (ticket == null) {
                return ResponseEntity
                        .notFound()
                        .build();
            }

            String email =
                    SecurityUtil.getLoggedInEmail();

            if (email == null) {
                return ResponseEntity
                        .status(401)
                        .body("User is not authenticated.");
            }

            User user =
                    userRepository.findByEmail(email);

            if (user == null) {
                return ResponseEntity
                        .status(401)
                        .body("User not found.");
            }

            String role =
                    user.getRole().getRoleName();

            boolean allowed = false;

            // ADMIN can view attachments of any ticket
            if ("ADMIN".equals(role)) {
                allowed = true;
            }

            // CUSTOMER can view attachments only on their own ticket
            else if ("CUSTOMER".equals(role)) {

                Customer customer =
                        customerRepository.findByUserId(
                                user.getUserId()
                        );

                if (customer != null
                        && ticket.getCustomer() != null
                        && ticket.getCustomer()
                                .getCustomerId()
                                .equals(customer.getCustomerId())) {

                    allowed = true;
                }
            }

            // AGENT can view attachments only on assigned tickets
            else if ("AGENT".equals(role)) {

                Agent agent =
                        agentRepository.findByUserUserId(
                                user.getUserId()
                        );

                if (agent != null
                        && ticket.getAssignedAgent() != null
                        && ticket.getAssignedAgent()
                                .getAgentId()
                                .equals(agent.getAgentId())) {

                    allowed = true;
                }
            }

            if (!allowed) {
                return ResponseEntity
                        .status(403)
                        .body(
                                "You are not allowed to view attachments for this ticket."
                        );
            }

            return ResponseEntity.ok(
                    attachmentRepository
                            .findByTicketTicketId(ticketId)
            );

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to load attachments.");
        }
    }

    @GetMapping("/{attachmentId}/download")
    public ResponseEntity<?> downloadAttachment(
            @PathVariable Long attachmentId) {

        try {

            Attachment attachment =
                    attachmentRepository
                            .findById(attachmentId)
                            .orElse(null);

            if (attachment == null) {
                return ResponseEntity
                        .notFound()
                        .build();
            }

            Ticket ticket =
                    attachment.getTicket();

            if (ticket == null) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                "Attachment is not linked to a ticket."
                        );
            }

            String email =
                    SecurityUtil.getLoggedInEmail();

            if (email == null) {
                return ResponseEntity
                        .status(401)
                        .body("User is not authenticated.");
            }

            User user =
                    userRepository.findByEmail(email);

            if (user == null) {
                return ResponseEntity
                        .status(401)
                        .body("User not found.");
            }

            String role =
                    user.getRole().getRoleName();

            boolean allowed = false;

            // ADMIN can access any attachment
            if ("ADMIN".equals(role)) {
                allowed = true;
            }

            // CUSTOMER can access attachments from their own tickets
            else if ("CUSTOMER".equals(role)) {

                Customer customer =
                        customerRepository.findByUserId(
                                user.getUserId()
                        );

                if (customer != null
                        && ticket.getCustomer() != null
                        && ticket.getCustomer()
                                .getCustomerId()
                                .equals(customer.getCustomerId())) {

                    allowed = true;
                }
            }

            // AGENT can access attachments from assigned tickets
            else if ("AGENT".equals(role)) {

                Agent agent =
                        agentRepository.findByUserUserId(
                                user.getUserId()
                        );

                if (agent != null
                        && ticket.getAssignedAgent() != null
                        && ticket.getAssignedAgent()
                                .getAgentId()
                                .equals(agent.getAgentId())) {

                    allowed = true;
                }
            }

            if (!allowed) {
                return ResponseEntity
                        .status(403)
                        .body(
                                "You are not allowed to access this attachment."
                        );
            }

            String fileUrl =
                    attachment.getFileUrl();

            if (fileUrl == null
                    || !fileUrl.startsWith("/uploads/")) {

                return ResponseEntity
                        .badRequest()
                        .body("Invalid attachment path.");
            }

            String storedFileName =
                    fileUrl.substring("/uploads/".length());

            Path filePath =
                    uploadDirectory
                            .resolve(storedFileName)
                            .normalize();

            if (!filePath.getParent()
                    .equals(
                            uploadDirectory
                                    .toAbsolutePath()
                                    .normalize()
                    )) {

                return ResponseEntity
                        .badRequest()
                        .body("Invalid attachment path.");
            }

            if (!Files.exists(filePath)
                    || !Files.isRegularFile(filePath)) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            Resource resource =
                    new UrlResource(
                            filePath.toUri()
                    );

            String contentType =
                    attachment.getFileType();

            if (contentType == null
                    || contentType.isBlank()) {

                contentType =
                        Files.probeContentType(
                                filePath
                        );
            }

            if (contentType == null) {
                contentType =
                        MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity
                    .ok()
                    .contentType(
                            MediaType.parseMediaType(
                                    contentType
                            )
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\""
                                    + attachment.getFileName()
                                    + "\""
                    )
                    .body(resource);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to download attachment.");
        }
    }
}
