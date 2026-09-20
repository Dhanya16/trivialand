# Trivialand API Reference

Base URL: `http://localhost:3001/api`

Interactive docs (Swagger): `http://localhost:3001/api/docs`

## Response shapes

| Pattern | Shape | Used by |
|---------|-------|---------|
| Paginated list | `{ data: T[], meta: { page, limit, total, totalPages, nextCursor? } }` | quiz history, contest history, rankings, standings |
| Object wrapper | `{ achievements: [...] }`, `{ user: {...} }` | module-specific payloads |
| Plain array/object | direct JSON body | categories, contests list, discussions list |

Errors use `{ statusCode, message, error, path, timestamp }`.

## Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Service + database health |

## Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Register user (rate limited) |
| POST | `/auth/login` | No | Login, returns JWT (rate limited) |
| GET | `/auth/me` | Bearer | Auth profile stub |

See also [`auth-api.md`](auth-api.md).

## Users (`/users/me`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/me` | Bearer | Basic profile |
| GET | `/users/me/progress` | Bearer | Levels cleared |
| GET | `/users/me/quiz-history` | Bearer | Paginated quiz attempts (normal + AI) |
| GET | `/users/me/contest-history` | Bearer | Paginated contest participations |
| GET | `/users/me/contest-rating` | Bearer | Current contest rating |
| GET | `/users/me/achievements` | Bearer | Earned badges |

## Categories

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/categories` | No | All categories |
| GET | `/categories/:slug` | No | Category by slug |
| GET | `/categories/:slug/subcategories` | No | Subcategories |
| GET | `/categories/:slug/:subSlug/levels` | Optional | Levels with progress status |

## Quizzes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/quizzes/:id` | No | Quiz metadata |
| GET | `/quizzes/:id/questions` | No | Questions (no correct answers) |
| POST | `/quizzes/:id/attempts` | Bearer | Start attempt → 201 |
| POST | `/quizzes/:id/attempts/:attemptId/submit` | Bearer | Submit answers → 200 |

## Contests

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/contests` | No | List contests (`?status=upcoming\|live\|past`) |
| GET | `/contests/rankings` | No | Global leaderboard (paginated) |
| GET | `/contests/:id` | Optional | Contest detail |
| GET | `/contests/:id/questions` | Bearer | Questions during live contest |
| GET | `/contests/:id/standings` | No | Per-contest leaderboard (paginated) |
| POST | `/contests/:id/join` | Bearer | Join live contest → 201 |
| POST | `/contests/:id/submit` | Bearer | Submit answers → 200 |

## Discussions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/discussions` | No | List threads |
| GET | `/discussions/:id` | No | Thread + replies |
| POST | `/discussions` | Bearer | Create thread → 201 |
| POST | `/discussions/:id/replies` | Bearer | Add reply → 201 |

## AI Quiz

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/ai-quiz/upload` | Bearer | Upload material (rate limited) → 201 |
| POST | `/ai-quiz/generate` | Bearer | Start generation → 201 |
| GET | `/ai-quiz/:id/status` | Bearer | `processing` / `ready` / `failed` |
| GET | `/ai-quiz/:id` | Bearer | Generated quiz when ready |
| POST | `/ai-quiz/:id/attempts` | Bearer | Submit attempt → 200 |

## Achievements

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/achievements` | No | All achievement definitions |

## Security notes

- `passwordHash` is never returned in API responses.
- Quiz/contest/AI question endpoints omit `isCorrect` until after submission.
- Discussion text is sanitized (HTML/script stripped) before storage.
- Auth and upload routes are rate limited.
