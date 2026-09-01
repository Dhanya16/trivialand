# Auth API

Base URL: `http://localhost:3001/api`

Protected routes require a JWT in the `Authorization` header:

```http
Authorization: Bearer <accessToken>
```

Tokens are issued by `POST /auth/login`. Configure `JWT_SECRET` and `JWT_EXPIRES_IN` in `backend/.env` (see `backend/.env.example`).

## Error response shape

All errors use the global exception filter:

```json
{
  "statusCode": 400,
  "message": "Validation failed message or array of messages",
  "error": "Bad Request",
  "path": "/api/auth/register",
  "timestamp": "2026-09-01T12:00:00.000Z"
}
```

Validation errors (`400`) return `message` as a string array.

---

## `POST /auth/register`

Create a new user account. **Public** — no token required.

### Request body

| Field | Type | Rules |
|-------|------|-------|
| `email` | string | Valid email; trimmed and lowercased |
| `username` | string | 3–20 chars; letters, numbers, underscore only |
| `password` | string | 8–72 chars; at least one uppercase, one lowercase, and one number |

```json
{
  "email": "you@example.com",
  "username": "you_test",
  "password": "Password1"
}
```

### Success — `201 Created`

```json
{
  "message": "Registration successful",
  "user": {
    "id": "clx...",
    "email": "you@example.com",
    "username": "you_test",
    "createdAt": "2026-09-01T12:00:00.000Z"
  }
}
```

### Errors

| Status | When |
|--------|------|
| `400` | Invalid email, username, or password (validation) |
| `409` | Email already registered or username already taken |

---

## `POST /auth/login`

Authenticate and receive a JWT. **Public** — no token required.

### Request body

| Field | Type | Rules |
|-------|------|-------|
| `email` | string | Valid email; trimmed and lowercased |
| `password` | string | Min 8 characters |

```json
{
  "email": "you@example.com",
  "password": "Password1"
}
```

### Success — `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx...",
    "email": "you@example.com",
    "username": "you_test",
    "createdAt": "2026-09-01T12:00:00.000Z"
  }
}
```

Use `accessToken` as the Bearer token for protected routes.

### Errors

| Status | When |
|--------|------|
| `400` | Invalid request body (validation) |
| `401` | Wrong email or password |

---

## `GET /auth/me`

Return the logged-in user's profile stub. **Protected** — requires `Authorization: Bearer <accessToken>`.

### Success — `200 OK`

```json
{
  "user": {
    "id": "clx...",
    "email": "you@example.com",
    "username": "you_test",
    "createdAt": "2026-09-01T12:00:00.000Z"
  },
  "profile": {
    "levelsCleared": 0,
    "contestRating": null,
    "quizHistory": [],
    "contestHistory": [],
    "achievements": []
  }
}
```

`profile` is a stub — stats and history will be populated from the database in later tasks.

### Errors

| Status | When |
|--------|------|
| `401` | Missing, invalid, or expired token |
| `404` | User no longer exists (token valid but user deleted) |

---

## Quick test flow

```bash
# 1. Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","username":"you_test","password":"Password1"}'

# 2. Login (copy accessToken from response)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"Password1"}'

# 3. Get profile (replace TOKEN)
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

On Windows PowerShell, use `curl.exe` instead of `curl`.
