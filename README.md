# DevPulse API

> A backend REST API for tracking bugs and feature requests — built for dev teams.

**Live:** https://issuetask-rho.vercel.app

---

## Stack

|           |                                  |
| --------- | -------------------------------- |
| Runtime   | Node.js 24.x + TypeScript        |
| Framework | Express.js                       |
| Database  | PostgreSQL (Neon) — raw SQL only |
| Auth      | JWT + bcrypt                     |
| Deploy    | Vercel                           |

---

## Getting Started

```bash
# Install dependencies
npm install

# Add environment variables
cp .env.example .env

# Start dev server
npm run dev

# Build for production
npm run build
npm start
```

### Environment Variables

```env
PORT=5000
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your_secret_key
```

> Tables are auto-created on first server start.

---

## Roles & Permissions

| Action                               | contributor | maintainer |
| ------------------------------------ | :---------: | :--------: |
| Register & Login                     |     ✅      |     ✅     |
| Create issue                         |     ✅      |     ✅     |
| View all issues                      |     ✅      |     ✅     |
| Update own issue (status: open only) |     ✅      |     ✅     |
| Update any issue + change status     |     ❌      |     ✅     |
| Delete issue                         |     ❌      |     ✅     |

---

## Authentication

All protected routes require a JWT in the `Authorization` header:

```
Authorization: <token>
```

Get your token from the login endpoint.

---

## API Reference

Base URL: `https://issuetask-rho.vercel.app/api`

---

### Auth

#### `POST /auth/signup`

Register a new account.

```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "contributor"
}

// Response 201
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

---

#### `POST /auth/login`

Login and receive a JWT token.

```json
// Request
{
  "email": "john@example.com",
  "password": "password123"
}

// Response 200
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "contributor",
      "created_at": "2026-01-20T09:00:00Z",
      "updated_at": "2026-01-20T09:00:00Z"
    }
  }
}
```

---

### Issues

#### `POST /issues` 🔒

Create a new issue.

```json
// Request
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}

// Response 201
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

`type` must be `bug` or `feature_request`

---

#### `GET /issues`

Get all issues. Public endpoint.

```
GET /api/issues?type=bug&status=open&sort=newest
```

| Param    | Options                           | Default  |
| -------- | --------------------------------- | -------- |
| `sort`   | `newest`, `oldest`                | `newest` |
| `type`   | `bug`, `feature_request`          | —        |
| `status` | `open`, `in_progress`, `resolved` | —        |

```json
// Response 200
{
  "success": true,
  "message": "Issues retrived successfully",
  "data": [
    {
      "id": 45,
      "title": "Database connection timeout under load",
      "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-01-20T10:30:00Z",
      "updated_at": "2026-01-20T10:30:00Z"
    }
  ]
}
```

---

#### `GET /issues/:id`

Get a single issue by ID. Public endpoint.

```json
// Response 200
{
  "success": true,
  "message": "Issue retrived successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter": {
      "id": 1,
      "name": "John Doe",
      "role": "contributor"
    },
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

---

#### `PATCH /issues/:id` 🔒

Update an issue.

- **Contributors** — can only update their own issues when status is `open`
- **Maintainers** — can update any issue including `status`

```json
// Request
{
  "title": "Updated title here",
  "description": "Updated description with more detail here",
  "type": "bug",
  "status": "in_progress"
}

// Response 200
{
  "success": true,
  "message": "Issue updated successfully",
  "data": { ... }
}
```

---

#### `DELETE /issues/:id` 🔒 `maintainer only`

Permanently delete an issue.

```json
// Response 200
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

---

## Response Format

Every response follows the same structure:

```json
// Success
{
  "success": true,
  "message": "Description",
  "data": {}
}

// Error
{
  "success": false,
  "message": "Error description",
  "errors": "Details"
}
```

---

## HTTP Status Codes

| Code  | Meaning                                 |
| ----- | --------------------------------------- |
| `200` | OK                                      |
| `201` | Created                                 |
| `400` | Bad Request — validation error          |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient permissions    |
| `404` | Not Found                               |
| `409` | Conflict — business logic violation     |
| `500` | Internal Server Error                   |

---

## Project Structure

```
src/
├── config/
│   ├── db.ts           # PostgreSQL pool
│   └── migrate.ts      # Auto table creation
├── controller/
│   ├── auth.login.ts
│   └── auth.signup.ts
├── middleware/
│   └── auth.middle.ts  # JWT verification
├── modules/
│   ├── issue.createIssue.ts
│   ├── issue.deleteIssue.ts
│   ├── issue.getAllIssues.ts
│   ├── issue.getSingleIssue.ts
│   └── issue.updateIssue.ts
├── router/
│   └── server.route.ts
├── service/
│   ├── auth.createUserService.ts
│   ├── auth.loginUserService.ts
│   └── issue.service.ts
├── utils/
│   ├── auth.interface.ts
│   └── index.ts
└── server.ts
```
