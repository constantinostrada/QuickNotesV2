# ⚡ QuickNotes

A fast, minimal note-taking application built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**, following **Clean Architecture** principles.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Clean Architecture Layers](#clean-architecture-layers)
- [API Reference](#api-reference)
- [Scripts](#scripts)
- [Architecture Decision Notes](#architecture-decision-notes)

---

## Features

- ✍️ Create, edit, and delete notes
- 📌 Pin important notes to the top
- 🏷️ Organise notes with tags
- 🔍 Full-text search across title and content
- ⚡ Server Components for instant first load
- 🎨 Clean, responsive UI with Tailwind CSS

---

## Tech Stack

| Layer          | Technology                     |
|----------------|-------------------------------|
| Framework      | Next.js 14 (App Router)        |
| Language       | TypeScript 5 (strict mode)     |
| Styling        | Tailwind CSS 3                 |
| Linting        | ESLint + `@typescript-eslint`  |
| Formatting     | Prettier                       |
| ID generation  | `uuid` v4                      |
| Storage        | In-memory (swap for any DB)    |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18.17
- npm, yarn, or pnpm

### Installation

```bash
# 1. Install dependencies
npm install        # or: yarn install / pnpm install

# 2. Copy the environment variables template
cp .env.local.example .env.local

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The app uses an **in-memory store** by default.
> All notes are reset when the server restarts.
> Swap `InMemoryNoteRepository` for a database-backed implementation to persist data.

---

## Project Structure

```
quicknotes/
├── src/
│   ├── domain/                     # Business rules — no external dependencies
│   │   ├── entities/
│   │   │   └── Note.ts             # Note entity with invariant protection
│   │   ├── value-objects/
│   │   │   ├── NoteId.ts           # UUID wrapper (validated)
│   │   │   ├── NoteTitle.ts        # Max-200-char, non-blank title
│   │   │   ├── NoteContent.ts      # Max-50k-char body with preview helper
│   │   │   └── NoteTag.ts          # Normalised, alphanumeric tag label
│   │   ├── repositories/
│   │   │   └── INoteRepository.ts  # Persistence interface (abstraction)
│   │   ├── services/
│   │   │   └── NoteSearchService.ts # In-memory filtering & sorting logic
│   │   ├── events/
│   │   │   ├── DomainEvent.ts
│   │   │   ├── NoteCreatedEvent.ts
│   │   │   └── NoteUpdatedEvent.ts
│   │   └── errors/
│   │       ├── DomainError.ts
│   │       └── NoteNotFoundError.ts
│   │
│   ├── application/                # Orchestrates domain — no I/O
│   │   ├── dtos/
│   │   │   └── NoteDto.ts          # Plain JSON-safe output contract
│   │   ├── mappers/
│   │   │   └── NoteMapper.ts       # Note entity → NoteDto
│   │   ├── ports/
│   │   │   └── IUuidGenerator.ts   # Abstraction for ID generation
│   │   └── use-cases/
│   │       ├── CreateNoteUseCase.ts
│   │       ├── GetNoteUseCase.ts
│   │       ├── ListNotesUseCase.ts
│   │       ├── UpdateNoteUseCase.ts
│   │       ├── DeleteNoteUseCase.ts
│   │       └── TogglePinNoteUseCase.ts
│   │
│   ├── infrastructure/             # All I/O — implements domain interfaces
│   │   ├── container/
│   │   │   └── Container.ts        # Manual DI — wires everything together
│   │   ├── persistence/
│   │   │   └── SeedData.ts         # Demo data loader
│   │   ├── repositories/
│   │   │   └── InMemoryNoteRepository.ts
│   │   └── uuid/
│   │       └── UuidGenerator.ts    # uuid v4 implementation
│   │
│   ├── interfaces/                 # Entry points — thin, no business logic
│   │   ├── components/             # React UI components
│   │   │   ├── CreateNoteForm.tsx
│   │   │   ├── EditNoteForm.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   └── SearchBar.tsx
│   │   └── http/
│   │       ├── controllers/
│   │       │   └── NotesController.ts  # Validates input, calls use cases
│   │       └── helpers/
│   │           └── apiResponse.ts      # Consistent response helpers
│   │
│   └── app/                        # Next.js App Router (interfaces layer)
│       ├── api/
│       │   └── notes/
│       │       ├── route.ts             # GET /api/notes, POST /api/notes
│       │       └── [id]/
│       │           ├── route.ts         # GET/PATCH/DELETE /api/notes/:id
│       │           └── pin/route.ts     # POST /api/notes/:id/pin
│       ├── notes/[id]/page.tsx      # Note detail page
│       ├── layout.tsx
│       ├── page.tsx                 # Home page
│       ├── error.tsx
│       ├── not-found.tsx
│       └── globals.css
│
├── CLAUDE.md                       # Global architecture contract
├── architecture.json               # Machine-readable layer rules
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
├── .eslintrc.json
├── .prettierrc
└── .env.local.example
```

---

## Clean Architecture Layers

This project strictly follows [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).
The **Dependency Rule** is absolute: source code dependencies can only point **inward**.

```
  ┌────────────────────────────────────────┐
  │  interfaces  (Next.js pages, API routes, React components)  │
  │     ↓                                  │
  │  application  (Use cases, DTOs, mappers)                    │
  │     ↓                                  │
  │  domain  (Entities, Value Objects, interfaces)              │
  └────────────────────────────────────────┘
              ↑ also points inward ↑
  infrastructure  (DB, HTTP clients, UUID, etc.)
```

### `domain/` — The Core

> **No imports from outside itself. Ever.**

Contains all business rules in isolation:

- **Entities** (`Note`) — objects with identity and lifecycle; protect their own invariants in constructors.
- **Value Objects** (`NoteId`, `NoteTitle`, `NoteContent`, `NoteTag`) — immutable, equality by value.
- **Repository Interfaces** (`INoteRepository`) — declare *what* operations exist; *not how* they work.
- **Domain Services** (`NoteSearchService`) — logic that spans multiple entities.
- **Domain Events** (`NoteCreatedEvent`, `NoteUpdatedEvent`) — record of something that happened.
- **Domain Errors** (`DomainError`, `NoteNotFoundError`) — typed exceptions for broken invariants.

### `application/` — Use Cases

> **Imports only from `domain/`. No infrastructure. No framework types.**

Orchestrates domain objects to fulfil specific user goals:

- **Use Cases** (`CreateNoteUseCase`, etc.) — one class, one `execute(dto)` method.
- **DTOs** (`NoteDto`) — plain, JSON-serialisable data contracts crossing layer boundaries.
- **Mappers** (`NoteMapper`) — convert domain entities to DTOs.
- **Ports** (`IUuidGenerator`) — abstractions for infrastructure capabilities.

### `infrastructure/` — External Adapters

> **Implements interfaces from `domain/` and `application/`. Never imported by those layers.**

All I/O lives here:

- **Repository Implementations** (`InMemoryNoteRepository`) — can be swapped for Postgres, SQLite, etc.
- **External Adapters** (`UuidGenerator`) — wraps third-party libraries.
- **DI Container** (`Container.ts`) — the *only* place where concrete classes are wired together.

### `interfaces/` — Entry Points

> **Imports only from `application/`. Thin. No business logic.**

Translates external signals into use case calls:

- **HTTP Controllers** (`NotesController`) — validate input shape → call use case → serialize response.
- **React Components** — display DTOs, call API routes, refresh state.
- **Next.js Route Handlers** — connect HTTP to controllers.
- **Next.js Pages** — server components that call use cases directly (still interfaces layer).

---

## API Reference

| Method   | Path                      | Description            |
|----------|---------------------------|------------------------|
| `GET`    | `/api/notes`              | List all notes         |
| `GET`    | `/api/notes?query=foo`    | Search notes           |
| `POST`   | `/api/notes`              | Create a note          |
| `GET`    | `/api/notes/:id`          | Get a note by ID       |
| `PATCH`  | `/api/notes/:id`          | Update a note          |
| `DELETE` | `/api/notes/:id`          | Delete a note          |
| `POST`   | `/api/notes/:id/pin`      | Toggle pin state       |

### Create note — request body

```json
{
  "title": "My note",
  "content": "Optional body text",
  "tags": ["work", "ideas"]
}
```

### Update note — request body (all fields optional)

```json
{
  "title": "Updated title",
  "content": "Updated content",
  "tags": ["updated-tag"],
  "isPinned": true
}
```

---

## Scripts

```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format with Prettier
npm run format:check # Check formatting without writing
npm run type-check   # TypeScript compiler check (no emit)
```

---

## Architecture Decision Notes

### Why in-memory storage?

The default `InMemoryNoteRepository` satisfies the `INoteRepository` interface without any external
dependencies. To switch to a real database, create a new class that implements `INoteRepository`
(e.g. `PostgresNoteRepository`) and update `src/infrastructure/container/Container.ts` — **no other
file changes required**.

### Why manual DI instead of a DI framework?

For a project of this size, a simple `Container.ts` file is explicit, readable, and has zero
overhead. If the project grows, the container can be replaced with InversifyJS, tsyringe, or similar
without touching any domain or application code.

### Why are Next.js API routes in `src/app/` and not `src/interfaces/`?

Next.js requires route files to live under `src/app/` (App Router convention).
The route files are kept thin — they instantiate the controller from `src/interfaces/http/controllers/`
and delegate immediately. The controller holds all the real interface logic.
