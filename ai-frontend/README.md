# 🎨 CareerForge Frontend — Next.js 16, React 19 & Tailwind CSS v4

The **CareerForge Frontend** is a cutting-edge, high-performance web application built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It delivers an immersive, dark-mode-ready user experience featuring real-time ATS resume auditing, interactive learning tree roadmaps, algorithm step visualizers, and collaborative live technical interview rooms with WebRTC video calling and Monaco code compilation.

---

## ✨ Features & Modules

### 1. 📄 AI Resume Analyzer & ATS Audit (`/resume-analyzer` & `/result`)
- **PDF Upload & JD Matching:** Clean drag-and-drop or file selector for PDF resumes paired with target Job Description text.
- **Roundtrip Latency Tracking:** Measures client-to-backend request and response time alongside server-side AI processing time.
- **ATS Radial Bar Gauge:** Visualizes ATS score (0-100) using customized **Recharts** radial bar components.
- **Skill Breakdown Cards:** Color-coded badges for present skills, identified gaps, strengths, weaknesses, and tailored recommendations.
- **Hierarchical Recursive Roadmap:** Interactive, collapsible learning tree visualizing prerequisites, difficulty tags, and estimated hours.
- **Targeted Question Generator:** On-demand generation of 20 interview questions tailored directly to detected resume vs. JD discrepancies.

### 2. 💡 Domain Interview Preparation Hub (`/interview-prep`)
- **Curated Technical Domains:** Java, Spring Boot, SQL, DBMS, Operating Systems, Computer Networks, and HR Interviews.
- **Topic-Specific Drilldowns:** OOP, Collections, Multithreading, REST APIs, Microservices, ACID Properties, Normalization, OSI Model, etc.
- **Interactive Question Cards:** Collapsible cards with answers, deep technical explanations, and difficulty badges (Easy, Medium, Hard).
- **Instant Search Filter:** Real-time search bar to filter generated questions by keyword.

### 3. 📊 Interactive Algorithm Visualizer (`/algorithm-visualizer`)
- **Supported Sorting Algorithms:** Bubble Sort, Selection Sort, Insertion Sort.
- **Supported Searching Algorithms:** Linear Search, Binary Search.
- **Synchronized Code Highlighter:** Highlights the exact executing line of code corresponding to the animation frame.
- **Interactive Control Panel:** Play/Pause, Step Forward, Step Backward, Speed multiplier (0.5x to 4x).
- **Flexible Test Cases:** Preset arrays (Random, Nearly Sorted, Reversed, Duplicates) or custom comma-separated inputs.
- **Theory & Complexity Cards:** Real-time display of Best, Average, Worst Time Complexity, and Space Complexity.

### 4. 📹 Live Technical Interview Room (`/live-interview` & `/live-interview/[roomId]`)
- **WebRTC Peer-to-Peer Calling:** HD video and audio communication between candidate and interviewer using `RTCPeerConnection` and STUN servers.
- **Screen Sharing & Media Controls:** Toggle video, mute audio, and share screen in one click.
- **Integrated Monaco Code Editor:** Full VS Code editing experience with syntax highlighting, line numbers, and theme support.
- **Remote Code Execution Engine:** Serverless route (`/api/execute`) connecting to the high-performance Piston execution sandbox. Supports **Python, Java, C++, TypeScript, JavaScript, Go, Rust, and C#** with standard input (stdin) support.
- **Session Timer:** Real-time interview stopwatch timer.

### 5. 👤 Career Profile & Gamification (`/profile`)
- **Role-Based Curricula:** Curated learning paths for Java Backend Developers, Fullstack Engineers, DevOps Engineers, and more.
- **Skill Gap Radar & Badges:** Gamified milestone badges, progress metrics, and dynamic activity feed.

### 6. 🔐 Authentication System (`/login`, `/register`, `AuthContext`)
- **JWT State Management:** Persisted login sessions in localStorage with context API.
- **Offline Dev Fallback:** Seamlessly operates even if a dedicated authentication database is offline, ensuring uninterrupted local development.

---

## 🏗️ Directory Structure

```
ai-frontend/
├── app/
│   ├── favicon.ico
│   ├── globals.css                       # Tailwind CSS v4 styling & animations
│   ├── layout.tsx                        # Root layout & AuthProvider wrapper
│   ├── page.tsx                          # Landing page & hero presentation
│   ├── algorithm-visualizer/
│   │   └── page.tsx                      # Algorithm visualizer dashboard
│   ├── api/
│   │   └── execute/
│   │       └── route.ts                  # Remote code compiler API route
│   ├── interview-prep/
│   │   └── page.tsx                      # Domain interview prep generator
│   ├── live-interview/
│   │   ├── page.tsx                      # Room creation & joining portal
│   │   └── [roomId]/
│   │       └── page.tsx                  # WebRTC live interview room
│   ├── login/
│   │   └── page.tsx                      # User authentication sign-in
│   ├── profile/
│   │   └── page.tsx                      # Career profile & curriculum tracking
│   ├── register/
│   │   └── page.tsx                      # New user registration
│   ├── result/
│   │   └── page.js                       # ATS result, radial charts & roadmaps
│   └── resume-analyzer/
│       └── page.js                       # Resume upload & JD submission form
├── components/
│   ├── AlgorithmVisualizer/
│   │   ├── CodeHighlighter.tsx           # Execution code line tracker
│   │   ├── ControlPanel.tsx              # Player controls (play, step, speed)
│   │   ├── SearchingVisualizer.tsx       # Searching animation canvas
│   │   ├── SortingVisualizer.tsx         # Bar sorting animation canvas
│   │   └── TheoryCard.tsx                # Big-O time and space complexity card
│   ├── Profile/
│   │   ├── AchievementBadges.tsx         # Milestone badges display
│   │   ├── ActivityFeed.tsx              # User action timeline
│   │   ├── ProfileHeader.tsx             # User avatar & status summary
│   │   ├── ProgressTracker.tsx           # Percentage completion progress bars
│   │   ├── RoleCurriculum.ts             # Curriculum datasets for tech roles
│   │   ├── SkillGapCard.tsx              # Skill gap comparative cards
│   │   └── useUserProfile.ts             # Profile state management hook
│   └── WebRTC/
│       ├── CodeEditor.tsx                # Monaco editor & multi-language console
│       ├── SessionTimer.tsx              # Live interview stopwatch
│       ├── useWebRTC.ts                  # RTCPeerConnection & Socket hook
│       └── VideoGrid.tsx                 # Peer video tile grid
├── context/
│   └── AuthContext.tsx                   # Auth state, login/register, JWT token
├── public/                               # Static image assets
├── next.config.ts                        # Next.js configurations
├── package.json                          # Dependencies & NPM scripts
├── postcss.config.mjs                    # PostCSS configuration
├── tailwind.config.js                    # Tailwind configuration
└── tsconfig.json                         # TypeScript configuration
```

---

## 🛠️ Technology Stack

| Layer | Library / Tool | Purpose |
|:---|:---|:---|
| **Framework** | Next.js 16.2.1 (App Router) | Server-side rendering, client components, API routes |
| **UI Library** | React 19.2.4 | Modern React with concurrent features and hooks |
| **Language** | TypeScript 5 & JavaScript (ESNext) | Type-safe enterprise frontend code |
| **Styling** | Tailwind CSS v4 & PostCSS | Utility-first responsive CSS styling |
| **Data Visualization** | Recharts 3.8.1 | ATS score radial gauge and charts |
| **Code Editor** | `@monaco-editor/react` 4.7.0 | VS Code browser editor for live coding |
| **Real-Time WebRTC** | `socket.io-client` 4.8.3 & WebRTC API | Peer-to-peer HD video/audio signaling |
| **Code Sandbox** | Piston Code Execution API (via `/api/execute`) | Compiles and executes 8+ programming languages |

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js 18.x or 20.x+** installed (`node -v`)
- **npm** (comes with Node.js) or **pnpm / yarn / bun**

### 2. Install Dependencies
From the `ai-frontend` directory:

```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open your browser and navigate to **`http://localhost:3000`**.

---

## 🌐 Backend Integrations & Ports

The frontend interacts with the following backend services:

| Destination | Address | Purpose |
|:---|:---|:---|
| **Spring Boot Backend** | `http://localhost:8081` | Resume analysis, ATS score, lazy roadmaps, interview prep questions |
| **Code Execution Engine** | `https://emkc.org/api/v2/piston/execute` (via `/api/execute`) | Remote multi-language code compilation and runner |
| **WebRTC Signaling Server** | `http://localhost:5000` (optional) | Peer-to-peer room handshake for live interview |

---

## 📜 Available NPM Scripts

- `npm run dev` — Starts the development server with Hot Module Replacement (HMR) on port 3000.
- `npm run build` — Compiles and optimizes the application for production deployment.
- `npm run start` — Starts the production Next.js server (run after `npm run build`).
- `npm run lint` — Runs ESLint to check for code standard conformance.
