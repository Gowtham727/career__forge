export interface SkillDomainRequirement {
  id: string;
  name: string;
  weight: number; // percentage weight out of 100
  requiredTopics: string[];
  moduleLink: string;
  moduleName: string;
}

export interface JobRoleDefinition {
  id: string;
  title: string;
  description: string;
  requiredSkills: SkillDomainRequirement[];
  recommendedKeywords: string[];
}

export const JOB_ROLES: Record<string, JobRoleDefinition> = {
  "java-developer": {
    id: "java-developer",
    title: "Java Backend Developer",
    description: "Focuses on Java Core, OOP, Spring Boot REST APIs, Microservices, SQL Databases, and Data Structures.",
    recommendedKeywords: ["Java", "Spring Boot", "REST API", "Microservices", "JPA/Hibernate", "SQL", "Multithreading", "Algorithms"],
    requiredSkills: [
      {
        id: "java-core",
        name: "Java Core & OOP Concepts",
        weight: 30,
        requiredTopics: ["Basics", "OOP", "Collections", "Exception Handling", "Multithreading", "Streams", "JVM"],
        moduleLink: "/interview-prep",
        moduleName: "AI Interview Prep (Java)",
      },
      {
        id: "spring-boot",
        name: "Spring Boot & Microservices",
        weight: 30,
        requiredTopics: ["REST APIs", "Spring MVC", "Dependency Injection", "Spring Security", "JPA/Hibernate"],
        moduleLink: "/interview-prep",
        moduleName: "AI Interview Prep (Spring Boot)",
      },
      {
        id: "sql-dbms",
        name: "SQL & DBMS Architecture",
        weight: 20,
        requiredTopics: ["Joins", "Indexes", "Normalization", "ACID Properties", "Transactions"],
        moduleLink: "/interview-prep",
        moduleName: "AI Interview Prep (SQL & DBMS)",
      },
      {
        id: "algorithms",
        name: "Data Structures & Algorithms",
        weight: 20,
        requiredTopics: ["Bubble Sort", "Quick Sort", "Merge Sort", "Binary Search", "Linear Search"],
        moduleLink: "/algorithm-visualizer",
        moduleName: "Algorithm Visualizer",
      },
    ],
  },
  "fullstack-developer": {
    id: "fullstack-developer",
    title: "Full Stack Developer",
    description: "Focuses on React/Next.js frontend, Java/Node backend, REST APIs, SQL/NoSQL databases, and System Design.",
    recommendedKeywords: ["React", "JavaScript", "TypeScript", "Node.js", "Java", "Spring Boot", "REST API", "SQL"],
    requiredSkills: [
      {
        id: "frontend",
        name: "Frontend & UI Engineering (React/Next.js)",
        weight: 30,
        requiredTopics: ["React Components", "Hooks", "State Management", "Tailwind CSS", "Next.js Routing"],
        moduleLink: "/interview-prep",
        moduleName: "AI Interview Prep",
      },
      {
        id: "backend-apis",
        name: "Backend APIs & Services",
        weight: 30,
        requiredTopics: ["REST APIs", "Dependency Injection", "Authentication/JWT", "Microservices"],
        moduleLink: "/interview-prep",
        moduleName: "AI Interview Prep",
      },
      {
        id: "database",
        name: "Databases & Storage",
        weight: 20,
        requiredTopics: ["SQL Joins", "Indexing", "JPA/Hibernate", "Database Schema Design"],
        moduleLink: "/interview-prep",
        moduleName: "AI Interview Prep",
      },
      {
        id: "algorithms",
        name: "Algorithms & Problem Solving",
        weight: 20,
        requiredTopics: ["Sorting Algorithms", "Binary Search", "Data Structures"],
        moduleLink: "/algorithm-visualizer",
        moduleName: "Algorithm Visualizer",
      },
    ],
  },
  "python-ai-engineer": {
    id: "python-ai-engineer",
    title: "Python AI & Data Engineer",
    description: "Focuses on Python programming, Data Structures & Algorithms, Machine Learning fundamentals, and SQL.",
    recommendedKeywords: ["Python", "Algorithms", "SQL", "REST API", "Machine Learning", "Data Processing"],
    requiredSkills: [
      {
        id: "python-core",
        name: "Python Core & Data Processing",
        weight: 35,
        requiredTopics: ["Data Structures", "Functions", "OOP in Python", "File I/O", "Async Python"],
        moduleLink: "/interview-prep",
        moduleName: "AI Interview Prep",
      },
      {
        id: "algorithms-ds",
        name: "Data Structures & Algorithms",
        weight: 35,
        requiredTopics: ["Quick Sort", "Merge Sort", "Binary Search", "BFS/DFS"],
        moduleLink: "/algorithm-visualizer",
        moduleName: "Algorithm Visualizer",
      },
      {
        id: "sql-data",
        name: "SQL & Data Queries",
        weight: 30,
        requiredTopics: ["Joins", "Group By", "Indexing", "Complex Subqueries"],
        moduleLink: "/interview-prep",
        moduleName: "AI Interview Prep (SQL)",
      },
    ],
  },
  "sql-database-admin": {
    id: "sql-database-admin",
    title: "Database Administrator / SQL Specialist",
    description: "Focuses on relational databases, advanced SQL queries, query optimization, ACID transactions, and indexing.",
    recommendedKeywords: ["SQL", "MySQL", "DBMS", "Transactions", "Indexing", "Stored Procedures", "Query Optimization"],
    requiredSkills: [
      {
        id: "sql-mastery",
        name: "Advanced SQL Queries & Joins",
        weight: 40,
        requiredTopics: ["Joins", "Subqueries", "Aggregate Functions", "Window Functions", "Stored Procedures"],
        moduleLink: "/interview-prep",
        moduleName: "AI Interview Prep (SQL)",
      },
      {
        id: "dbms-architecture",
        name: "DBMS Architecture & Indexing",
        weight: 40,
        requiredTopics: ["ACID Properties", "B-Tree Indexing", "Concurrency Control", "Normalization", "Deadlocks"],
        moduleLink: "/interview-prep",
        moduleName: "AI Interview Prep (DBMS)",
      },
      {
        id: "problem-solving",
        name: "Algorithms & Logic",
        weight: 20,
        requiredTopics: ["Searching Algorithms", "Sorting Concepts"],
        moduleLink: "/algorithm-visualizer",
        moduleName: "Algorithm Visualizer",
      },
    ],
  },
};
