# Frontend API Contract

How the Next.js frontend talks to the NestJS backend.

## Environment

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:3001/api` | Must include the `/api` prefix. Used by server and client fetch helpers. |

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

The backend listens on port `3001` by default (`PORT` in `backend/.env`).

## Request conventions

- **JSON bodies:** `Content-Type: application/json`
- **Auth:** `Authorization: Bearer <accessToken>` from `POST /auth/login`
- **Credentials:** `credentials: 'include'` on fetch (CORS allows cookies for future session auth)
- **Dates:** ISO 8601 strings in JSON (parse with `new Date(...)`)

## Error contract

Non-2xx responses return:

```json
{
  "statusCode": 404,
  "message": "Category \"missing\" not found",
  "error": "Not Found",
  "path": "/api/categories/missing",
  "timestamp": "2026-09-20T12:00:00.000Z"
}
```

| Status | Meaning | Frontend handling |
|--------|---------|-------------------|
| 400 | Validation / bad input | Show `message` to user |
| 401 | Missing or invalid JWT | Redirect to `/login` |
| 403 | Forbidden (e.g. locked level) | Show error, link back |
| 404 | Resource not found | `notFound()` in App Router |
| 409 | Conflict (e.g. already joined) | Show `message` |
| 429 | Rate limited | Show retry message |
| 503 | Health / DB down | Global error UI |

## Route → API mapping

### Categories (`/categories/*`)

| Frontend route | API |
|----------------|-----|
| `/categories` | `GET /categories` |
| `/categories/[categorySlug]` | `GET /categories/:slug`, `GET /categories/:slug/subcategories` |
| `/categories/.../[subcategorySlug]` | `GET /categories/:slug/:subSlug/levels` (optional Bearer for progress) |
| `/categories/.../[levelId]` | `GET /categories/:slug/:subSlug/levels/:levelId/quizzes` |
| `/categories/.../quiz/[quizId]` | `GET /quizzes/:id`, `GET /quizzes/:id/questions`, `POST .../attempts`, `POST .../submit` |

### Contests (`/contests/*`)

| Frontend route | API |
|----------------|-----|
| `/contests` (preview columns) | `GET /contests?status=live\|upcoming\|past`, `GET /contests/rankings?limit=5` |
| `/contests/[status]` | `GET /contests?status=` |
| `/contests/rankings` | `GET /contests/rankings?page=1&limit=50` |

Preview limits are applied on the client (3 contests per column, 5 rankings).

### Profile (`/profile`)

| Section | API |
|---------|-----|
| All sections | `GET /users/me/profile?limit=10` (single call) |

Or use individual endpoints: `/users/me`, `/users/me/progress`, etc.

Requires login. Unauthenticated users are redirected to `/login`.

### Discussions (`/discussions/*`)

| Frontend route | API |
|----------------|-----|
| `/discussions` | `GET /discussions` |
| `/discussions/[id]` | `GET /discussions/:id` (includes `replies[]`) |

## Auth storage

JWT is stored in:

1. `localStorage` key `trivialand_token` (client components)
2. Cookie `trivialand_token` (server components via `cookies()`)

Set both on login; clear both on logout.

## CORS

Backend (`configure-app.ts`):

```typescript
origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
credentials: true,
```

Frontend fetch uses `credentials: 'include'` so cookie-based auth can be added later without CORS changes.

## Swagger

Interactive docs: `http://localhost:3001/api/docs`

Full endpoint list: [`api.md`](api.md)

## Manual smoke test (full journey)

1. Start backend (`cd backend && npm run start:dev`) and frontend (`cd frontend && npm run dev`).
2. Open `http://localhost:3000` — home shows live/upcoming contest from API.
3. **Categories:** `/categories` → pick a category → subcategory → unlocked level → quiz list → play quiz.
4. **Auth:** `/login` → register or log in → token stored in cookie + localStorage.
5. **Quiz submit:** replay a quiz while logged in → score saved, level progress updates.
6. **Contests:** `/contests` preview columns → "View more" → `/contests/live|upcoming|past` and `/contests/rankings`.
7. **Discussions:** `/discussions` list → thread detail with replies.
8. **Profile:** `/profile` loads `GET /users/me/profile` (history, rating, achievements).
9. **Errors:** visit `/categories/not-real` → 404 page; stop backend → error boundary on refresh.
