# Trivialand — Product Requirements Document

**Version:** 1.0  
**Status:** Phase 1 (Active Development)  
**Last updated:** August 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Vision & Product Goals](#3-vision--product-goals)
4. [Target Users](#4-target-users)
5. [Content Model](#5-content-model)
6. [Feature Specifications](#6-feature-specifications)
7. [User Flows](#7-user-flows)
8. [Data & Tracking](#8-data--tracking)
9. [Technical Architecture](#9-technical-architecture)
10. [Phase 1 Scope](#10-phase-1-scope)
11. [Development Roadmap](#11-development-roadmap)
12. [Success Criteria](#12-success-criteria)
13. [Future Phases](#13-future-phases)

---

## 1. Executive Summary

**Trivialand** is a full-stack quiz and knowledge platform that combines structured learning progression, competitive programming-style contests, AI-powered quiz generation, and community discussion in a single product.

Users explore a hierarchical library of questions organized as **Category → Subcategory → Level → Quiz → Question → Options**. They unlock levels sequentially, track progress through quiz history and levels cleared, and compete in timed contests with ratings and rankings. They can also upload study material to generate personalized quizzes via an external AI service, and participate in discussions around questions and topics.

The long-term goal is to build a large, structured database of question sets while offering multiple modes of engagement: self-paced learning, competitive challenge, personalized AI study, and peer discussion.

---

## 2. Problem Statement

Learners and trivia enthusiasts currently use fragmented tools:

- **Quiz apps** offer content but lack meaningful progression, competition, or community.
- **Competitive platforms** (e.g. Codeforces) excel at contests but are not designed for structured topic-based learning.
- **AI study tools** generate questions but rarely integrate with progression systems or peer discussion.

Trivialand addresses this by unifying structured content, competitive contests, AI-generated quizzes, and discussions into one platform with a shared user profile and history.

---

## 3. Vision & Product Goals

### Vision

Become the go-to platform where users learn, compete, and collaborate through quizzes — building both personal knowledge and a shared question database over time.

### Product Goals (Phase 1)

| Goal | Description |
|------|-------------|
| Structured content | Maintain a clear Category → Subcategory → Level → Quiz hierarchy |
| Progression | Gate levels behind completion of prior levels |
| Competition | Run Codeforces-style contests with ratings and rankings |
| Personalization | Let users generate quizzes from their own study material |
| Community | Enable discussion around questions, quizzes, and topics |
| Progress tracking | Surface levels cleared, quiz history, contest history, and achievements on profiles |

### Non-Goals (Phase 1)

The following are explicitly out of scope for Phase 1:

- 1v1 battles
- Friends / following system
- Real-time chat
- Seasons or battle passes
- Advanced gamification (streaks, leaderboards beyond contests)
- Monetization, ads, or premium subscriptions
- B2B / enterprise features
- Recommendation engines or ML-driven content discovery

---

## 4. Target Users

| Persona | Needs |
|---------|-------|
| **Casual learner** | Browse topics, take quizzes, track levels cleared |
| **Competitive user** | Participate in timed contests, improve contest rating, view rankings |
| **Self-studier** | Upload notes/textbooks, generate AI quizzes from personal material |
| **Community contributor** | Discuss questions, share explanations, engage on quiz topics |

---

## 5. Content Model

### Hierarchy

```text
Category
  └── Subcategory
        └── Level
              └── Quiz
                    └── Question
                          └── Options (multiple choice)
```

**Example:**

```text
Science
  └── Physics
        ├── Level 1  ✓  (completed)
        ├── Level 2  🔓 (unlocked, in progress)
        └── Level 3  🔒 (locked)
              └── Quiz: "Mechanics Basics"
                    └── Question: "What is Newton's first law?"
                          ├── Option A
                          ├── Option B
                          ├── Option C
                          └── Option D
```

### Entity Definitions

| Entity | Description |
|--------|-------------|
| **Category** | Top-level knowledge domain (e.g. Science, History, Geography, Technology) |
| **Subcategory** | Topic within a category (e.g. Physics under Science) |
| **Level** | A progression step within a subcategory; contains one or more quizzes |
| **Quiz** | A set of questions a user completes as part of a level or contest |
| **Question** | A single prompt with multiple options and one correct answer |
| **Option** | A selectable answer choice for a question |

### Level Progression Rules

- Level 1 in each subcategory is unlocked by default for authenticated users.
- Level *N+1* unlocks when Level *N* is **cleared** (completion criteria defined per level — typically completing all quizzes in the level with a passing score).
- Progression applies only to the **Categories** content path, not to AI-generated or contest quizzes.

### Question Attributes

Each question should support at minimum:

- Question text
- Multiple options (typically 4)
- Exactly one correct option
- Optional explanation (shown after submission)

---

## 6. Feature Specifications

### 6.1 Application Navigation

The main application is organized into six top-level sections:

```text
Home
├── Categories
├── Contests
├── AI Quiz Generator
├── Discussions
└── Profile
```

### 6.2 Home

**Purpose:** Entry point and dashboard.

**Requirements:**

- Provide navigation to all main sections
- Optionally display:
  - User's recent activity (last quiz attempted, last contest participated)
  - Levels cleared count
  - Upcoming contests
  - Current contest rating

**Phase 1:** Navigation links and a simple welcome/dashboard layout.

---

### 6.3 Categories

**Purpose:** Browse and attempt structured quiz content.

**Requirements:**

- List all available categories
- Drill down: Category → Subcategory → Level list
- Show lock/unlock/completed status per level
- Launch quiz flow from an unlocked level
- Display quiz results after completion
- Record attempt in quiz history
- Update levels-cleared count on level completion

**Initial seed categories (suggested):**

- Science (Physics, Chemistry, Biology)
- History
- Geography
- Technology

Additional categories can be added via admin/content seeding without product changes.

**Frontend routes (planned):**

```text
/categories
/categories/[categorySlug]
/categories/[categorySlug]/[subcategorySlug]
/categories/[categorySlug]/[subcategorySlug]/[levelId]
/categories/.../quiz/[quizId]
```

---

### 6.4 Quizzes (Normal Mode)

**Purpose:** Assess knowledge within the learning progression path.

**Requirements:**

- Present questions one at a time or all at once (Phase 1: either approach is acceptable; pick one and stay consistent)
- Allow user to select an option per question
- Submit quiz and show score/results
- Show correct answers and optional explanations after submission
- Persist attempt in **quiz history**
- Contribute to **level completion** when criteria are met

**Important:** Normal quiz activity does **not** affect contest rating.

---

### 6.5 Contests

**Purpose:** Timed, competitive quizzes inspired by Codeforces-style contests.

**Sections:**

```text
Contests
├── Upcoming   — scheduled, not yet started
├── Live       — currently running
├── Past       — finished; view problems and results
└── Rankings   — global contest rating leaderboard
```

**Contest properties:**

| Property | Description |
|----------|-------------|
| Title & description | Identifies the contest |
| Start time | When the contest opens |
| Duration | Fixed time limit once started |
| Question set | Fixed set of questions (independent of category levels) |
| Scoring | Points per question; optional partial scoring (Phase 1: full credit per correct answer is sufficient) |

**Contest lifecycle:**

```text
Scheduled (Upcoming)
      ↓
  Live (user joins, timer starts)
      ↓
  Submitted / Time expired
      ↓
  Past (results finalized)
      ↓
  Rating updated → Rankings refreshed
```

**Contest-specific tracking (separate from normal quizzes):**

- **Contest rating** — Elo-style or similar rating adjusted after each contest
- **Contest ranking** — Leaderboard position within a contest and globally
- **Contest history** — Record of past participations, scores, and rating changes

**Important:** Contest rating is independent of normal quiz performance and levels cleared.

---

### 6.6 AI Quiz Generator

**Purpose:** Generate personalized quizzes from user-uploaded study material.

**Supported input (Phase 1 targets):**

- PDF documents
- Plain text / notes
- Textbook excerpts
- Images of handwritten notes (via OCR or vision-capable AI API)

**Flow:**

```text
Upload material
      ↓
Send content to external AI API
      ↓
AI returns generated questions + options + correct answers
      ↓
Present quiz to user
      ↓
User attempts quiz → results shown
```

**Requirements:**

- Upload interface with file type validation
- Processing status indicator while AI generates questions
- Generated quiz is stored separately from category/level content
- Attempts may be stored in quiz history under an "AI-generated" type
- AI-generated quizzes do **not** affect level progression or contest rating

**Technical note:** Integration with an external AI API (provider TBD — OpenAI, Anthropic, etc.) is planned; provider selection and prompt design are implementation decisions.

---

### 6.7 Discussions

**Purpose:** Community conversation around questions, quizzes, and topics.

**Requirements:**

- Create a discussion thread
- Reply to existing threads
- Associate a discussion with:
  - A specific question
  - A quiz
  - A general topic
- View list of discussions with title, author, reply count, and timestamp
- View single discussion with threaded or flat replies (Phase 1: flat replies are sufficient)

**Phase 1 scope:** Basic CRUD for discussions and replies. No rich text editor required — markdown or plain text is acceptable.

---

### 6.8 Profile

**Purpose:** Central view of a user's activity and achievements.

**Profile sections:**

```text
Profile
├── Levels Cleared      — count and list of completed levels
├── Quiz History        — past normal and AI quiz attempts
├── Contest Rating      — current rating and history graph (Phase 1: current rating + list)
├── Contest History     — past contest participations and scores
└── Achievements        — badges/milestones (Phase 1: basic set)
```

**Suggested Phase 1 achievements:**

- First quiz completed
- First level cleared
- First contest participated
- N levels cleared (e.g. 5, 10, 25)
- Contest rating milestones (e.g. reach 1200, 1500)

---

### 6.9 Authentication & Users

**Phase 1 requirements:**

- User registration and login
- Authenticated sessions (JWT or session-based — implementation decision)
- All progress, history, ratings, and discussions are tied to a user account
- Profile page shows the logged-in user's data; viewing other users' profiles is optional for Phase 1

---

## 7. User Flows

### 7.1 Core Learning Flow (Priority 1)

```text
Open Trivialand
      ↓
Home → Categories
      ↓
Select Category (e.g. Science)
      ↓
Select Subcategory (e.g. Physics)
      ↓
View Levels (Level 1 unlocked)
      ↓
Start Level 1 Quiz
      ↓
Answer Questions → Submit
      ↓
View Results
      ↓
Level 1 marked complete → Level 2 unlocked
      ↓
Profile updated (levels cleared, quiz history)
```

### 7.2 Contest Flow

```text
Contests → Upcoming
      ↓
Register / wait for start
      ↓
Contest goes Live → user enters
      ↓
Answer questions within time limit
      ↓
Submit (or auto-submit on timeout)
      ↓
View score and standing
      ↓
Contest rating updated
      ↓
Visible in Contest History and Rankings
```

### 7.3 AI Quiz Flow

```text
AI Quiz Generator
      ↓
Upload document / notes / image
      ↓
AI processes → quiz generated
      ↓
User attempts quiz
      ↓
Results shown → saved to quiz history
```

### 7.4 Discussion Flow

```text
View question or quiz
      ↓
Open/create discussion
      ↓
Post reply
      ↓
Other users view and reply
```

---

## 8. Data & Tracking

### What Gets Tracked

| Activity | Levels Cleared | Quiz History | Contest Rating | Contest History | Achievements |
|----------|:--------------:|:------------:|:--------------:|:---------------:|:------------:|
| Normal category quiz | ✓ (on level clear) | ✓ | — | — | ✓ |
| AI-generated quiz | — | ✓ | — | — | ✓ |
| Contest participation | — | — | ✓ | ✓ | ✓ |

### Key Metrics (Product)

- Daily / weekly active users
- Quizzes attempted per user
- Levels cleared per user
- Contest participation rate
- AI quizzes generated per user
- Discussion posts per user

---

## 9. Technical Architecture

### Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | NestJS 11, TypeScript, REST API |
| Database | PostgreSQL |
| ORM | Prisma |
| AI | External AI API (TBD) |

### Repository Structure

```text
trivialand/
├── frontend/          # Next.js App Router application
├── backend/           # NestJS REST API
│   └── src/
│       ├── categories/
│       ├── contests/
│       └── quizzes/
├── prisma/            # Schema and migrations
├── docs/              # Documentation (this file)
└── README.md
```

### Architecture Diagram

```text
                    ┌─────────────────┐
                    │   User Browser  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Next.js (FE)   │
                    │  localhost:3000 │
                    └────────┬────────┘
                             │ REST
                    ┌────────▼────────┐
                    │  NestJS (BE)    │
                    │  localhost:3001 │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────────┐    │    ┌─────────▼─────────┐
     │   PostgreSQL    │    │    │  External AI API  │
     │   (via Prisma)  │    │    │  (quiz generation)│
     └─────────────────┘    │    └───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  File Storage     │
                    │  (uploaded docs)  │
                    └───────────────────┘
```

### Planned API Modules

| Module | Responsibility |
|--------|----------------|
| `auth` | Registration, login, session/JWT |
| `categories` | Categories, subcategories, levels |
| `quizzes` | Quiz CRUD, attempts, scoring, history |
| `contests` | Contest lifecycle, submissions, ratings |
| `discussions` | Threads and replies |
| `ai-quiz` | Upload handling, AI integration, generated quiz storage |
| `users` | Profile, achievements, progress aggregation |

### Planned Database Entities (High Level)

```text
User
Category, Subcategory, Level
Quiz, Question, Option
QuizAttempt, QuizAnswer
LevelProgress (user ↔ level, status: locked/unlocked/completed)
Contest, ContestQuestion, ContestSubmission, ContestRating
Discussion, DiscussionReply
Achievement, UserAchievement
AiQuiz, AiQuizAttempt
UploadedMaterial
```

Detailed schema design is an implementation task tracked separately from this PRD.

---

## 10. Phase 1 Scope

### In Scope

- [ ] User authentication (register / login)
- [ ] Home page with navigation
- [ ] Categories → Subcategories → Levels → Quiz flow
- [ ] Level progression (unlock on prior level completion)
- [ ] Quiz attempt, scoring, and results
- [ ] Quiz history on profile
- [ ] Levels cleared tracking
- [ ] Contests: Upcoming, Live, Past, Rankings sections
- [ ] Contest participation with time limit
- [ ] Contest rating and rankings
- [ ] Contest history on profile
- [ ] AI Quiz Generator: upload + generate + attempt
- [ ] Discussions: create thread, reply, list
- [ ] Profile with all sections listed above
- [ ] Basic achievements

### Out of Scope (Phase 1)

See [Non-Goals](#non-goals-phase-1) above.

---

## 11. Development Roadmap

Development is incremental. Each milestone should produce a working, testable slice before moving to the next.

| Milestone | Deliverable | Depends On |
|-----------|-------------|------------|
| **M0 — Scaffold** | Monorepo, FE/BE running, Prisma connected | — |
| **M1 — Content hierarchy** | Categories API + pages; seed data | M0 |
| **M2 — Quiz flow** | Take a quiz end-to-end; show results | M1 |
| **M3 — Progression** | Level unlock logic; levels cleared | M2 |
| **M4 — Auth & profile** | Login; profile shows history and progress | M3 |
| **M5 — Contests** | Full contest lifecycle + rating | M4 |
| **M6 — Discussions** | Threads and replies | M4 |
| **M7 — AI Quiz Generator** | Upload + AI integration + attempt | M4 |
| **M8 — Achievements** | Badge triggers and profile display | M4–M7 |

**Current status (as of initial setup):** M0 partially complete — frontend and backend scaffolds exist; stub modules for categories, contests, and quizzes are in place; Prisma is initialized but schema entities are not yet defined; frontend has placeholder pages for Home, Categories, Contests, and Profile.

---

## 12. Success Criteria

Phase 1 is complete when a user can:

1. Register and log in
2. Browse categories and navigate to a subcategory's levels
3. See locked/unlocked/completed level states
4. Complete a quiz in an unlocked level and view results
5. Unlock the next level after completing the current one
6. View levels cleared and quiz history on their profile
7. Browse upcoming contests and participate in a live contest
8. View contest standings, updated rating, and contest history
9. Upload study material and attempt an AI-generated quiz
10. Create and reply to a discussion on a question or topic
11. Earn and view at least basic achievements

The priority is a **simple, functional core** — not feature completeness at the expense of reliability.

---

## 13. Future Phases

Features deferred beyond Phase 1, to be scoped in separate PRDs:

- **Phase 2:** Social features (friends, following), 1v1 battles, notifications
- **Phase 3:** Seasons, advanced gamification, streaks, daily challenges
- **Phase 4:** Monetization, premium tiers, content creator tools
- **Phase 5:** B2B API, institutional accounts, custom quiz authoring portal
- **Ongoing:** Content expansion, recommendation engine, mobile apps

---

*This document is the source of truth for Phase 1 product scope. Implementation details (exact API shapes, schema fields, UI designs) should align with this document and be updated here if scope changes.*
