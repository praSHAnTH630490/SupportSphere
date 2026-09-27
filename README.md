# SupportSphere

SupportSphere is a full-stack **AI-powered Customer Support and CRM application** built with **Java, Spring Boot, React, MySQL, Docker, JWT Authentication, and RAG-based AI**.

The application provides dedicated workflows for **Customers, Agents, and Administrators**, combining customer support ticket management with dashboards, ticket conversations, attachments, notifications, feedback, AI customer support, and a knowledge-base/RAG layer.

---

## Features

### Customer

* Register and login
* JWT-based authentication
* Customer dashboard
* Create support tickets
* View and manage own tickets
* View ticket status and priority
* Communicate with support agents
* Upload and access permitted attachments
* Submit feedback and ratings
* View notifications
* Manage profile
* AI customer support chat
* View previous AI conversations

### Agent

* Secure agent login
* Agent dashboard
* View assigned tickets
* Handle assigned customer tickets
* Update permitted ticket information
* Reply to customers through ticket messages
* Manage ticket conversations
* Access permitted attachments
* Manage agent availability

### Administrator

* Secure admin login
* Admin dashboard
* Manage customers
* Manage agents
* Create and manage agents
* View and manage tickets
* Assign tickets to agents
* Manage categories
* Manage ticket status and priority
* Manage knowledge documents
* Access administrative management features

### AI Customer Support

* AI customer support chat
* Persistent AI conversations
* Persistent AI messages
* Conversation history
* Create new AI conversations
* Delete AI conversations
* AI message management
* Ticket-aware AI context
* Customer-specific AI conversation access
* Error and loading handling
* Retry support for failed AI interactions

### Knowledge Base and RAG

* Knowledge documents
* Knowledge chunks
* Retrieval-based AI support
* Application/company knowledge as AI context
* Knowledge-based AI responses
* RAG-powered customer support

### Additional Features

* Role-based dashboards
* Ticket conversations
* File attachments
* Notifications
* Customer feedback
* Protected resources
* Resource ownership and assignment checks
* Dockerized application
* Production frontend served using Nginx

---

## Technology Stack

### Backend

* Java 17
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* REST APIs
* JWT Authentication
* BCrypt Password Hashing
* Maven

### Frontend

* React
* JavaScript
* Vite
* React Router
* HTML
* CSS

### Database

* MySQL 8

### AI

* External AI/LLM API integration
* AI conversation persistence
* AI message persistence
* Ticket-aware AI context
* RAG knowledge-base functionality

### Deployment and Tools

* Docker
* Docker Compose
* Nginx
* Git
* GitHub

---

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

### Backend Architecture

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

---

## Docker Architecture

The Dockerized application runs using three main services:

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
Docker Container :3306
```

### Docker Services

```text
supportsphere-frontend
supportsphere-backend
supportsphere-mysql
```

The React application is built as a production application and served using Nginx.

The Spring Boot backend runs inside its own Docker container and connects to MySQL through the Docker network.

---

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
│       │
│       └── resources/
│           ├── application.properties
│           └── application-prod.properties
│
├── docs/
│   ├── ARCHITECTURE.md
│   └── API.md
│
├── screenshots/
│   ├── customer-dashboard.png
│   ├── agent-dashboard.png
│   ├── admin-dashboard.png
│   └── ai-dashboard.png
│
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── README.md
├── LICENSE
└── .gitignore
```

---

## Frontend

The React frontend is located inside the `frontend/` directory.

### Frontend Structure

```text
frontend/
└── src/
    ├── components/
    ├── context/
    ├── pages/
    ├── services/
    └── App.jsx
```

The frontend provides separate workflows for:

* Customer
* Agent
* Administrator
* AI Customer Support

### Frontend Functionality

* Authentication
* Protected routes
* Customer dashboard
* Agent dashboard
* Admin dashboard
* Customer management
* Agent management
* Ticket creation
* Ticket listing
* Ticket filtering
* Ticket details
* Ticket conversations
* Profile management
* Notifications
* AI chat
* AI conversation history
* Knowledge management
* Backend API integration

---

## Backend

The Spring Boot backend is located in the `src/` directory.

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

### Backend Functionality

* Authentication
* User management
* Role management
* Customer management
* Agent management
* Category management
* Ticket management
* Ticket messages
* Attachments
* Notifications
* Feedback
* AI conversations
* AI messages
* Knowledge documents
* Knowledge chunks

---

## Authentication and Security

SupportSphere uses **JWT-based authentication** and **role-based authorization**.

### User Roles

```text
CUSTOMER
AGENT
ADMIN
```

### Security Features

* JWT authentication
* Role-based authorization
* BCrypt password hashing
* Protected REST APIs
* Customer resource ownership checks
* Agent assigned-ticket authorization
* Admin management permissions
* Protected AI conversations
* Protected AI messages
* Authenticated attachment access
* CORS configuration
* Security headers
* Request validation
* File upload restrictions
* Environment-based secrets

Sensitive information such as database passwords, JWT secrets, and AI API keys is provided through environment variables and is not committed to GitHub.

---

## AI Customer Support

SupportSphere includes an AI-powered customer support system.

The AI workflow uses customer context, ticket context, conversation history, and knowledge-base information.

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

AI conversations and messages are persisted so customers can access their previous AI support conversations.

---

## RAG Knowledge Base

SupportSphere also includes a Retrieval-Augmented Generation (RAG) knowledge-base layer.

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

The RAG system allows stored application or company knowledge to be used as additional context for AI-assisted customer support.

---

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

### AI Support Workflow

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

---

## Running Locally

### Backend Requirements

* Java 17
* Maven
* MySQL 8

From the project root:

```bash
mvn spring-boot:run
```

The development backend runs on:

```text
http://localhost:8080
```

### Frontend Requirements

* Node.js
* npm

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs through the Vite development server.

---

## Running with Docker

### Build Backend Image

From the project root:

```bash
docker build -t supportsphere-backend:latest .
```

### Build Frontend Image

```bash
cd frontend
docker build -t supportsphere-frontend:latest .
cd ..
```

### Start the Application

```bash
docker compose up -d
```

### Check Containers

```bash
docker ps
```

### Stop the Application

```bash
docker compose down
```

---

## Docker URLs

| Component       | URL                     |
| --------------- | ----------------------- |
| React + Nginx   | `http://localhost:5173` |
| Spring Boot API | `http://localhost:8081` |
| MySQL           | Docker internal network |

---

## Environment Variables

The Dockerized application uses environment variables for sensitive configuration.

Create a local `.env` file:

```env
DB_URL=jdbc:mysql://mysql:3306/support_sphere
DB_USERNAME=root
DB_PASSWORD=your_database_password

AI_API_KEY=your_ai_api_key

JWT_SECRET=your_secure_jwt_secret
```

**Never commit `.env` or real secrets to GitHub.**

The repository `.gitignore` excludes environment files and other local or generated files.

---

## API Documentation

Detailed API documentation is available in:

```text
docs/API.md
```

The API documentation covers major application areas including:

* Authentication
* Tickets
* Ticket messages
* Categories
* Attachments
* Notifications
* AI conversations
* AI messages

---

## Architecture Documentation

Detailed architecture information is available in:

```text
docs/ARCHITECTURE.md
```

---

## Screenshots

### Customer Dashboard

![Customer Dashboard](screenshots/customer-dashboard.png)

### Agent Dashboard

![Agent Dashboard](screenshots/agent-dashboard.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

### AI Customer Support

![AI Customer Support](screenshots/ai-dashboard.png)

---

## GitHub

Source code and project documentation:

**GitHub:** https://github.com/praSHAnTH630490/SupportSphere

---

## License

This project is licensed under the MIT License.

---

## Developer

**Sai Prashanth**

Java Full Stack Developer
Java | Spring Boot | React | MySQL | AI

GitHub: `praSHAnTH630490`
