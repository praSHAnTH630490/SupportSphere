# SupportSphere

SupportSphere is a full-stack AI-powered Customer Support and CRM application built with Java, Spring Boot, React, MySQL, Docker, JWT authentication, and a RAG-based knowledge base.

The application provides separate workflows for customers, support agents, and administrators. It combines customer support ticket management with dashboards, ticket conversations, attachments, notifications, feedback, AI customer support, and knowledge-based AI assistance.

## Features

### Customer

- Register and log in
- JWT-based authentication
- Customer dashboard
- Create support tickets
- View and manage own tickets
- View ticket status and priority
- Communicate through ticket messages
- Upload and access permitted attachments
- Submit feedback
- View notifications
- Manage profile
- Use AI customer support
- View previous AI conversations

### Agent

- Secure agent login
- Agent dashboard
- View assigned tickets
- Work with assigned customer tickets
- Update permitted ticket information
- Reply to customers through ticket messages
- Manage ticket conversations
- Access permitted attachments
- Work with agent availability

### Administrator

- Secure admin login
- Admin dashboard
- Manage customers
- Manage agents
- Create and manage agents
- View and manage tickets
- Assign tickets to agents
- Manage categories
- Manage ticket status and priority
- Manage knowledge documents
- Access administrative management features

### AI Customer Support

- AI customer support chat
- Persistent AI conversations
- Persistent AI messages
- Conversation history
- Create new AI conversations
- Delete AI conversations
- AI message management
- Ticket-aware AI context
- Customer-specific AI conversation access
- Error and loading handling
- Retry support for failed AI interactions

### Knowledge Base and RAG

- Knowledge documents
- Knowledge chunks
- Retrieval-based AI support
- Application/company knowledge used as AI context
- Knowledge-based responses through the RAG workflow

### Additional Features

- Role-based dashboards
- Ticket conversations
- File attachments
- Notifications
- Customer feedback
- Protected resources
- Resource ownership and assignment checks
- Dockerized deployment

## Technology Stack

### Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- REST APIs
- JWT authentication
- BCrypt password hashing
- Maven

### Frontend

- React
- JavaScript
- Vite
- React Router
- HTML
- CSS

### Database

- MySQL 8

### AI

- External AI/LLM API integration
- AI conversation persistence
- AI message persistence
- Ticket-aware AI context
- RAG knowledge-base functionality

### Deployment and Tools

- Docker
- Docker Compose
- Nginx
- Git
- GitHub

## Architecture

SupportSphere uses a React frontend, Spring Boot REST backend, MySQL database, AI provider, and RAG knowledge base.

```text
                    React Frontend
                         |
                         | REST API
                         v
                Spring Boot Backend
                  /       |       \
                 /        |        \
                v         v         v
             MySQL    AI Provider   RAG
                                  Knowledge Base
```

### Backend Layered Architecture

```text
React Frontend
      |
      v
REST Controllers
      |
      v
Services
      |
      v
Repositories
      |
      v
MySQL
```

The backend also contains security, exception handling, AI services, knowledge-base functionality, and application configuration.

## Docker Architecture

The Dockerized application runs as three main services:

```text
Browser
   |
   v
React + Nginx
localhost:5173
   |
   v
Spring Boot Backend
localhost:8081
   |
   v
MySQL 8
Docker container
```

Docker services:

```text
supportsphere-frontend
supportsphere-backend
supportsphere-mysql
```

The frontend is built as a production React application and served by Nginx.

The Spring Boot backend runs inside its Docker container and connects to the MySQL Docker service through the Docker network.

## Repository Structure

```text
SupportSphere/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── supportsphere/
│       │           ├── config/
│       │           ├── controller/
│       │           ├── entity/
│       │           ├── exception/
│       │           ├── repository/
│       │           ├── security/
│       │           └── service/
│       └── resources/
│           ├── application.properties
│           └── application-prod.properties
│
├── docs/
│   ├── ARCHITECTURE.md
│   └── API.md
│
├── screenshots/
│
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── README.md
├── LICENSE
└── .gitignore
```

## Frontend

The React application is located in the `frontend/` directory.

Main frontend areas include:

```text
frontend/src/
├── components/
├── context/
├── pages/
└── services/
```

The frontend includes:

- Authentication pages
- Customer dashboard
- Agent dashboard
- Admin dashboard
- Customer management
- Agent management
- Ticket creation
- Ticket list and filtering
- Ticket details and conversations
- Profile
- Notifications
- AI chat
- AI conversation history
- Knowledge management
- Protected routes
- Backend API integration

The frontend communicates with the Spring Boot backend through REST APIs.

## Backend

The Spring Boot application is located in the repository's `src/` directory.

The backend follows a layered architecture:

```text
Controller
    |
    v
Service
    |
    v
Repository
    |
    v
MySQL
```

The backend provides functionality for:

- Authentication
- User and role management
- Customer management
- Agent management
- Category management
- Ticket management
- Ticket messages
- Attachments
- Notifications
- Feedback
- AI conversations
- AI messages
- Knowledge documents
- Knowledge chunks

## Authentication and Security

SupportSphere uses JWT-based authentication and role-based authorization.

The main roles are:

```text
CUSTOMER
AGENT
ADMIN
```

Security features include:

- JWT authentication
- Role-based authorization
- BCrypt password hashing
- Protected REST endpoints
- Customer resource ownership checks
- Agent assigned-ticket access rules
- Admin management permissions
- Protected AI conversations
- Protected AI messages
- Authenticated attachment access
- CORS configuration
- Security headers
- Request validation
- File upload restrictions
- Environment-based secrets

Sensitive configuration such as database passwords, JWT secrets, and AI API keys is supplied through environment variables and is not committed to GitHub.

## AI Architecture

The AI customer-support flow uses the React AI chat interface, Spring Boot AI APIs, stored conversation data, ticket context, and knowledge-base context.

```text
Customer
   |
   v
React AI Chat
   |
   v
Spring Boot AI API
   |
   v
AI Service
   |
   +---- Customer Context
   |
   +---- Ticket Context
   |
   +---- Conversation History
   |
   +---- Knowledge Context
   |
   v
AI Provider
   |
   v
AI Response
   |
   v
React AI Chat
```

AI conversations and AI messages are persisted so users can access their previous AI support conversations.

## RAG Knowledge Base

The knowledge-base flow is:

```text
Knowledge Documents
        |
        v
Knowledge Chunks
        |
        v
Retrieval
        |
        v
Relevant Knowledge
        |
        v
AI Context
        |
        v
AI Provider
        |
        v
Context-aware Response
```

The RAG layer allows stored application or company knowledge to be used as context for AI-assisted customer support.

## Main Support Workflow

```text
Customer
   |
   v
Create Ticket
   |
   v
Ticket
   |
   v
Admin Assigns Agent
   |
   v
Agent Handles Ticket
   |
   +---- Messages
   +---- Status
   +---- Priority
   +---- Attachments
   |
   v
Customer Receives Support
   |
   v
Feedback
```

AI support provides an additional support path:

```text
Customer
   |
   v
AI Customer Support
   |
   +---- Conversation History
   +---- Ticket Context
   +---- Knowledge Base
   |
   v
AI Response
```

## Running Locally

### Backend Requirements

- Java 17
- Maven
- MySQL 8

From the backend repository root:

```bash
mvn spring-boot:run
```

The development backend runs on:

```text
http://localhost:8080
```

### Frontend Requirements

- Node.js
- npm

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs through the Vite development server.

## Running with Docker

Build the backend image:

```bash
docker build -t supportsphere-backend:latest .
```

Build the frontend image:

```bash
cd frontend
docker build -t supportsphere-frontend:latest .
cd ..
```

Start the complete application:

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

Stop the application:

```bash
docker compose down
```

### Docker URLs

| Component | URL |
|---|---|
| React + Nginx | `http://localhost:5173` |
| Spring Boot API | `http://localhost:8081` |
| MySQL | Docker internal network |

## Environment Variables

The Dockerized backend uses environment variables for configuration.

Example:

```env
DB_URL=jdbc:mysql://mysql:3306/support_sphere
DB_USERNAME=root
DB_PASSWORD=your_database_password

AI_API_KEY=your_ai_api_key

JWT_SECRET=your_secure_jwt_secret
```

Do not commit `.env` or real secrets to GitHub.

The repository `.gitignore` excludes environment files and other local or generated data.

## API Documentation

Detailed API documentation is available in:

```text
docs/API.md
```

The API documentation covers the application's major backend areas, including:

- Authentication
- Tickets
- Ticket messages
- Categories
- Attachments
- Notifications
- AI conversations
- AI messages

## Architecture Documentation

Detailed architecture information is available in:

```text
docs/ARCHITECTURE.md
```

## Screenshots

Project screenshots are stored in:

```text
screenshots/
```

## License

This project is licensed under the MIT License.

## Developer

Sai Prashanth

GitHub: https://github.com/praSHAnTH630490
