# SupportSphere API Documentation

SupportSphere exposes REST APIs through the Spring Boot backend.

Base URL:

```text
http://localhost:8080/api

For the Dockerized application:

http://localhost:8081/api
Authentication
Login
POST /auth/login

Authenticates a user and returns authentication information including a JWT token.

Register
POST /auth/register

Registers a new customer account.

Protected APIs require the JWT token:

Authorization: Bearer <JWT_TOKEN>
Tickets
Create Ticket
POST /tickets

Creates a support ticket.

Get Tickets
GET /tickets

Returns tickets available to the authenticated user according to their role and permissions.

Get Ticket
GET /tickets/{ticketId}

Returns a specific ticket.

Update Ticket
PUT /tickets/{ticketId}

Updates ticket information.

Delete Ticket
DELETE /tickets/{ticketId}

Deletes a ticket when permitted.

Ticket Messages

Ticket conversations use the ticket message API.

POST /tickets/{ticketId}/messages

Creates a message for a ticket.

GET /tickets/{ticketId}/messages

Retrieves messages belonging to a ticket.

Categories
Get Categories
GET /categories
Get Category
GET /categories/{categoryId}
Create Category
POST /categories
Delete Category
DELETE /categories/{categoryId}
Attachments
Download Attachment
GET /attachments/{attachmentId}/download

Downloads an attachment after the backend verifies that the authenticated user is allowed to access it.

Notifications
Get My Notifications
GET /notifications
Get Unread Notifications
GET /notifications/unread
Get Notification
GET /notifications/{notificationId}
Mark Notification as Read
PUT /notifications/{notificationId}/read
Delete Notification
DELETE /notifications/{notificationId}
AI Conversations

AI conversations are separate from normal ticket messages.

Create Conversation
POST /ai/conversations
Get Conversations
GET /ai/conversations
Get Conversation
GET /ai/conversations/{conversationId}
AI Messages
Create AI Message
POST /ai/messages
Get AI Messages
GET /ai/messages
Get AI Message
GET /ai/messages/{messageId}
Delete AI Message
DELETE /ai/messages/{messageId}
Security

Most application APIs are protected by JWT authentication and role-based authorization.

Access to resources is additionally restricted according to the user's role and ownership or assignment rules.

The application supports:

CUSTOMER
AGENT
ADMIN

The documented AI message API is specifically `/api/ai/messages`, while ticket messages use the separate ticket-message API. :contentReference[oaicite:3]{index=3} The attachment download endpoint is documented as `/api/attachments/{attachmentId}/download`. :contentReference[oaicite:4]{index=4}
