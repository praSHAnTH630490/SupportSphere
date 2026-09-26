# SupportSphere Architecture

## Overview

SupportSphere is an AI-powered Customer Support and CRM application built as a full-stack web application.

The system uses:

- React for the frontend
- Nginx for serving the React production build
- Spring Boot for the backend REST API
- MySQL for persistent data storage
- JWT for authentication and authorization
- Docker for containerization
- AI integration for customer support conversations
- RAG-based knowledge retrieval for AI support

## System Architecture

```text
                    ┌──────────────────────┐
                    │       Customer       │
                    │   Agent / Admin      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    React Frontend    │
                    │       + Nginx        │
                    └──────────┬───────────┘
                               │
                         REST API / HTTP
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Spring Boot      │
                    │     Backend API     │
                    ├──────────────────────┤
                    │ Authentication       │
                    │ Authorization        │
                    │ Ticket Management    │
                    │ Customer Management  │
                    │ Agent Management     │
                    │ AI Features          │
                    │ RAG Knowledge Base   │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
          ┌──────────────────┐   ┌──────────────────┐
          │      MySQL       │   │   AI Provider    │
          │    Database      │   │      API         │
          └──────────────────┘   └──────────────────┘
          
          
          Frontend

The frontend is developed using React.

It provides separate functionality for:

Customers
Agents
Administrators

The frontend communicates with the Spring Boot backend through REST APIs.

Authentication uses JWT tokens to access protected backend resources.

In the Dockerized deployment, Nginx serves the production React build.

Backend

The backend is developed using Spring Boot.

The backend provides REST APIs for:

Authentication
User management
Customer management
Agent management
Category management
Ticket management
Ticket messages
Attachments
Feedback
Notifications
AI conversations
AI messages
Knowledge documents
Knowledge chunks

The backend contains separate layers for controllers, services, repositories, entities, and security.

Authentication and Authorization

SupportSphere uses JWT-based authentication.

The general flow is:

User Login
    │
    ▼
Spring Boot Authentication
    │
    ▼
JWT Token
    │
    ▼
React stores authentication state
    │
    ▼
JWT sent with protected API requests
    │
    ▼
JWT Filter
    │
    ▼
Spring Security
    │
    ▼
Role-based authorization

The application supports the following roles:

CUSTOMER
AGENT
ADMIN

Access to protected resources is controlled according to the authenticated user's role and ownership/assignment rules.

Ticket Management

Customers can create and manage their support tickets according to their permitted operations.

Agents work with tickets assigned to them.

Administrators have broader ticket management capabilities, including assigning tickets to agents.

Ticket-related functionality includes:

Ticket creation
Ticket viewing
Ticket status
Ticket priority
Ticket assignment
Ticket messages
Attachments
Feedback
AI Support

SupportSphere includes an AI customer-support feature.

The AI functionality is integrated into the backend and provides customer conversations through the application.

The system stores AI conversations and messages so that customer-specific conversation history can be maintained.

The AI functionality is protected by the application's authentication and authorization system.

RAG Knowledge Base

SupportSphere includes a Retrieval-Augmented Generation (RAG) knowledge-base component.

The knowledge base uses:

Knowledge Document
        │
        ▼
Knowledge Chunks
        │
        ▼
Relevant Knowledge Retrieval
        │
        ▼
AI Support Response

This allows the AI support functionality to use application knowledge when generating customer-support responses.

Database

MySQL is used as the primary relational database.

Major application data areas include:

Users
Roles
Customers
Agents
Categories
Tickets
Ticket messages
Attachments
Knowledge documents
Knowledge chunks
AI conversations
AI messages
Feedback
Notifications
Docker Architecture

The application can run as separate Docker services:

┌──────────────────────────────┐
│       Frontend Container     │
│        React + Nginx         │
│          Port 80             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Backend Container      │
│         Spring Boot          │
│          Port 8080           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        MySQL Container       │
│          Port 3306           │
└──────────────────────────────┘

From the host machine, the current Docker setup exposes:

Frontend → localhost:5173
Backend  → localhost:8081
MySQL    → Docker internal network

The backend connects to MySQL through the Docker Compose service name rather than localhost.

Security

Security-related features include:

JWT authentication
Role-based authorization
BCrypt password hashing
Protected REST APIs
CORS configuration
Security headers
Request validation
Multipart upload limits
Attachment type validation
Environment-based secrets
Production profile configuration

Sensitive configuration such as database credentials, JWT secrets, and AI API keys is supplied through environment variables rather than committed to the repository.

Project Structure

The backend follows a layered Spring Boot structure similar to:

src/
└── main/
    ├── java/
    │   └── com/
    │       └── supportsphere/
    │           ├── config/
    │           ├── controller/
    │           ├── dto/
    │           ├── entity/
    │           ├── exception/
    │           ├── repository/
    │           ├── security/
    │           └── service/
    │
    └── resources/
        ├── application.properties
        └── application-prod.properties

The React frontend is maintained separately and communicates with the backend through REST APIs.

Deployment Model

The application is designed to support containerized deployment.

The Docker setup separates the main application components into independent services:

Frontend
   │
   ▼
Backend
   │
   ▼
Database

AI functionality communicates with the configured external AI provider through the backend rather than exposing the provider credentials to the React frontend.