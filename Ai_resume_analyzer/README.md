# ⚙️ CareerForge Backend — Spring Boot & Mistral AI Engine

The **CareerForge Backend** is an enterprise-grade RESTful web service built with **Spring Boot**, **Java 17**, and **Spring AI**. It coordinates PDF document extraction via **Apache PDFBox**, intelligent cryptographic caching, LLM synthesis via **Mistral AI**, and relational persistence using **Spring Data JPA & MySQL**.

---

## 🚀 Key Features

- **Automated Resume Text Stripping:** Seamlessly ingests multi-page PDF resumes using Apache PDFBox 2.0.29, sanitizing whitespace and formatting.
- **Instant SHA-256 Caching Engine:** Computes a cryptographic SHA-256 fingerprint of `(resumeText + jobDescription)` to cache results and bypass redundant LLM invocations in **< 5ms**.
- **AI-Driven ATS Match & Gap Analysis:** Leverages Mistral AI (`open-mistral-7b` / `mistral-large-latest`) with strict JSON schema enforcement to output an ATS compatibility score, strengths, weaknesses, existing skills, missing skills, and targeted suggestions.
- **Dynamic Learning Roadmap Generation:** Transforms detected skill deficits into a multi-tiered, hierarchical learning roadmap complete with time estimates and difficulty ratings.
- **Context-Aware Interview Questions:** Generates 20 tailored behavioral and technical questions probing specific gaps between the resume and the target Job Description.
- **Curated Domain Interview Preparation:** Generates 20 comprehensive questions with answers, technical explanations, and difficulty ratings across Java, Spring Boot, SQL, DBMS, OS, Computer Networks, and HR domains.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|:---|:---|:---|
| **Language & Runtime** | Java 17 (OpenJDK / Oracle JDK) | Modern LTS Java |
| **Framework** | Spring Boot 4.0.5 | Core web framework |
| **AI Integration** | Spring AI 2.0.0-M3 & WebClient | Reactive HTTP integration with Mistral AI |
| **LLM Models** | Mistral AI (`open-mistral-7b` & `mistral-large-latest`) | High-reasoning chat completions with strict JSON output |
| **PDF Extraction** | Apache PDFBox 2.0.29 | Document text stripping and normalization |
| **Database & ORM** | MySQL 8.0+ & Spring Data JPA (Hibernate) | Relational persistence with auto-DDL |
| **Boilerplate Reduction** | Project Lombok | Auto-generates getters, setters, builders, constructors |
| **JSON Utilities** | `org.json` | Parsing and payload formatting |
| **Build Tool** | Apache Maven 3.8+ (with `mvnw` wrapper) | Dependency management and build packaging |

---

## 📂 Backend Architecture & Package Structure

```
Ai_resume_analyzer/
├── .mvn/wrapper/               # Maven wrapper binaries
├── pom.xml                     # Maven dependencies & plugins
├── src/
│   ├── main/
│   │   ├── java/com/example/Ai_resume_analyzer/
│   │   │   ├── AiResumeAnalyzerApplication.java  # Main Spring Boot entry point
│   │   │   ├── controller/
│   │   │   │   ├── ResumeController.java         # Resume upload, roadmap & questions endpoints
│   │   │   │   └── InterviewPrepController.java   # Domain-specific interview prep generator
│   │   │   ├── dto/
│   │   │   │   └── InterviewPrepRequest.java     # Request DTO (domain & topic)
│   │   │   ├── entity/
│   │   │   │   ├── ResumeAnalysis.java           # Primary cached analysis entity
│   │   │   │   ├── ResumeDescription.java        # Secondary extraction entity
│   │   │   │   └── Details.java                  # User credentials entity
│   │   │   ├── repo/
│   │   │   │   ├── ResumeAnalysisRepository.java # JPA repository with findByHash()
│   │   │   │   └── ResumeRepo.java               # JPA repository for descriptions
│   │   │   └── service/
│   │   │       ├── MistralService.java           # WebClient REST calls to Mistral AI API
│   │   │       ├── Pdfservice.java               # Apache PDFBox text extraction
│   │   │       └── ResumeService.java            # Business logic, caching, JSON processing
│   │   └── resources/
│   │       └── application.properties            # Ports, DB, and AI configurations
│   └── test/                                     # Spring Boot integration tests
```

---

## ⚙️ Configuration & Environment Variables

The backend reads settings from `src/main/resources/application.properties`:

```properties
spring.application.name=Ai_resume_analyzer
spring.ai.mistralai.api-key=${MISTRAL_API_KEY}
spring.ai.mistral.api.url=https://api.mistral.ai/v1/chat/completions
spring.ai.mistralai.chat.options.model=mistral-large-latest

spring.datasource.url=jdbc:mysql://localhost:3306/resume_analyzer
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

server.port=8081
```

### Required Environment Variables

Before starting the server, ensure these environment variables are exported in your terminal or configured in your IDE run configuration:

| Variable | Description | Example |
|:---|:---|:---|
| `MISTRAL_API_KEY` | Mistral AI API secret key | `mist_xxxxxxxxxxxxxxxxxxxx` |
| `DB_PASSWORD` | MySQL root / user password | `root` or `your_secure_password` |

---

## 🔌 API Reference & Endpoints

All endpoints support CORS (`@CrossOrigin(origins = "*")`) allowing the Next.js frontend to communicate seamlessly without proxy friction.

### 1. Analyze Resume Against Job Description
- **Method:** `POST`
- **Path:** `/analyze/resume`
- **Content-Type:** `multipart/form-data`
- **Form Parameters:**
  - `file`: Resume file (`.pdf`)
  - `jd`: Job Description string

#### Sample `curl` Request:
```bash
curl -X POST "http://localhost:8081/analyze/resume" \
  -F "file=@/path/to/resume.pdf" \
  -F "jd=We are looking for a Senior Java Developer with Spring Boot, Kafka, and Docker experience."
```

#### Success Response (`200 OK`):
```json
{
  "id": 1,
  "hash": "a8f5b82c61...SHA-256",
  "resumeText": "John Doe - Software Engineer...",
  "jobDescription": "We are looking for a Senior Java Developer...",
  "atsScore": 82,
  "summary": "Candidate displays strong Java & Spring Boot background with slight gaps in Kafka event streaming.",
  "strengths": [
    "5+ years of hands-on Spring Boot microservices experience",
    "Solid relational database knowledge with MySQL"
  ],
  "weaknesses": [
    "No proven commercial experience with Apache Kafka",
    "Limited Docker and Kubernetes container orchestration"
  ],
  "existingSkills": ["Java", "Spring Boot", "MySQL", "REST APIs"],
  "missingSkills": ["Apache Kafka", "Docker", "Kubernetes"],
  "suggestions": [
    "Incorporate Kafka consumer/producer examples in project descriptions",
    "Highlight Docker containerization in local development workflows"
  ],
  "roadmap": "[]",
  "interviewQuestions": "[]",
  "aiResponseTime": 2.45,
  "aiModel": "Mistral-7B (Basic Only)"
}
```

---

### 2. Generate Skill Roadmap (Lazy Loaded)
- **Method:** `POST`
- **Path:** `/analyze/resume/{id}/roadmap`
- **Path Variable:** `id` (Analysis ID from `POST /analyze/resume`)

#### Sample `curl` Request:
```bash
curl -X POST "http://localhost:8081/analyze/resume/1/roadmap"
```

#### Success Response (`200 OK`):
```json
[
  {
    "title": "Apache Kafka & Event Streaming",
    "description": "Master distributed event logs, topic partitioning, consumer groups, and Spring Kafka integration.",
    "difficulty": "Intermediate",
    "estimatedHours": 18,
    "children": [
      {
        "title": "Kafka Producers & Idempotence",
        "description": "Understand acks=all, idempotent producers, and retry logic.",
        "difficulty": "Intermediate",
        "estimatedHours": 6,
        "children": []
      }
    ]
  }
]
```

---

### 3. Generate Tailored Interview Questions
- **Method:** `GET`
- **Path:** `/analyze/resume/{id}/questions`
- **Path Variable:** `id` (Analysis ID)

#### Sample `curl` Request:
```bash
curl -X GET "http://localhost:8081/analyze/resume/1/questions"
```

#### Success Response (`200 OK`):
```json
[
  "How do you handle transactional consistency across microservices in Spring Boot?",
  "What is the difference between a Kafka consumer group and a standalone consumer?",
  "Can you explain how MySQL handles index lookups on composite primary keys?"
]
```

---

### 4. Domain & Topic Interview Prep Questions
- **Method:** `POST`
- **Path:** `/interview-prep/generate`
- **Content-Type:** `application/json`

#### Request Body:
```json
{
  "domain": "Spring Boot",
  "topic": "Microservices"
}
```

#### Sample `curl` Request:
```bash
curl -X POST "http://localhost:8081/interview-prep/generate" \
  -H "Content-Type: application/json" \
  -d '{"domain": "Spring Boot", "topic": "Microservices"}'
```

#### Success Response (`200 OK`):
```json
[
  {
    "question": "What is the role of an API Gateway in a Spring Boot Microservices architecture?",
    "answer": "An API Gateway acts as the single entry point for all client requests, routing them to appropriate microservices, handling cross-cutting concerns like authentication, rate limiting, and SSL termination.",
    "explanation": "Spring Cloud Gateway uses Spring WebFlux for non-blocking I/O, providing efficient routing filters and circuit breakers.",
    "difficulty": "Medium"
  }
]
```

---

## 🏃 Running the Backend Locally

### 1. Prerequisites
- **JDK 17 or higher** installed and on `PATH` (`java -version`)
- **MySQL 8.0+** running on `localhost:3306` with database `resume_analyzer` created:
  ```sql
  CREATE DATABASE resume_analyzer;
  ```
- Valid **Mistral AI API Key**

### 2. Set Environment Variables
**Windows (PowerShell):**
```powershell
$env:MISTRAL_API_KEY="your_mistral_api_key_here"
$env:DB_PASSWORD="your_mysql_password_here"
```

**Linux / macOS (Bash):**
```bash
export MISTRAL_API_KEY="your_mistral_api_key_here"
export DB_PASSWORD="your_mysql_password_here"
```

### 3. Build & Run
From the `Ai_resume_analyzer` directory:

```bash
# Run using the Maven wrapper
./mvnw spring-boot:run

# On Windows PowerShell / CMD:
.\mvnw.cmd spring-boot:run
```

The application will start on **`http://localhost:8081`**.

### 4. Build Production JAR
```bash
./mvnw clean package -DskipTests
java -jar target/Ai_resume_analyzer-0.0.1-SNAPSHOT.jar
```
