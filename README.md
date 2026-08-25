# Trivialand

Trivialand is a full-stack quiz and knowledge platform built with Next.js, NestJS, PostgreSQL, and Prisma.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Package manager:** npm

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- npm
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

Verify your installations:

```bash
node --version
npm --version
psql --version
git --version
```

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd trivialand
```

### 2. Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### 3. Configure environment variables

Create the required environment files. **Do not commit `.env` files or secrets to Git.**

Copy the backend template and fill in your values:

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Then edit `backend/.env` with your local PostgreSQL credentials.

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Replace `USER`, `PASSWORD`, and the database name in `backend/.env` with your local PostgreSQL credentials.

The NestJS backend defaults to port `3000`, which conflicts with the Next.js dev server. Set `PORT=3001` in `backend/.env` as shown in `.env.example`.

### 4. Set up the database

Ensure PostgreSQL is running, then create the database:

```bash
createdb trivialand
```

Prisma lives in the **backend** (`backend/prisma/schema.prisma`). Run all Prisma commands from `backend/`:

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

`backend/.env` must contain `DATABASE_URL` before running migrations.

### 5. Start the development servers

Run the frontend and backend in separate terminals.

**Frontend** — http://localhost:3000

```bash
cd frontend
npm run dev
```

**Backend** — http://localhost:3001

```bash
cd backend
npm run start:dev
```

Verify the backend is running:

```bash
curl http://localhost:3001/api/health
```

Expected response:

```json
{"status":"ok","database":"ok","timestamp":"..."}
```

## Development

### Frontend

```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend

```bash
cd backend
npm run start:dev   # Start in watch mode (http://localhost:3001)
npm run build       # Compile TypeScript
npm run start:prod  # Run compiled output
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
npm run lint        # Run ESLint
```

API routes are served under `/api` (e.g. `GET /api/health`).

### Prisma

Prisma is installed in the backend. The schema is at `backend/prisma/schema.prisma`. Run these from `backend/`:

```bash
cd backend
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Create and apply migrations
npx prisma studio        # Open database GUI
npx prisma db push       # Push schema changes without migration (dev only)
```

The Prisma client is generated into `node_modules/.prisma/client` and imported via `@prisma/client`.

## Git Workflow

Create a feature branch before starting work:

```bash
git checkout -b feature/<feature-name>
```

After making changes:

```bash
git add .
git commit -m "Describe your change"
git push -u origin feature/<feature-name>
```

## Documentation

- [`docs/prd.md`](docs/prd.md) — Product requirements and feature overview
