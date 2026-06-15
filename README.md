# DevPulse API

A REST API for managing bug reports and feature requests. Built with Node.js, TypeScript, Express, and PostgreSQL (Neon).

---

## Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL (Neon) — raw SQL, no ORM
- bcrypt, jsonwebtoken

---

## Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env` file

```env
PORT=5000
DATABASE_URL=your_neon_postgresql_url
JWT_SECRET=your_secret_key
```

3. Run in development

```bash
npm run dev
```

4. Build for production

```bash
npm run build
npm start
```

> Tables are created automatically on server start.

---

## Roles

| Role          | Permissions                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| `contributor` | Register, login, create issues, view issues, update own open issues            |
| `maintainer`  | All contributor permissions + update any issue + change status + delete issues |

---

## Authentication

Send token in the `Authorization` header:

```
Authorization: <JWT_TOKEN>
```

---

## API Endpoints

### Auth

#### Register

```
POST /api/auth/signup
```

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "contributor"
}
```

#### Login

```
POST /api/auth/login
```

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Returns a `token` — use it in all protected requests.

---

### Issues

#### Create Issue `🔒`

```
POST /api/issues
Authorization: <token>
```

```json
{
  "title": "Something is broken",
  "description": "Detailed explanation at least 20 chars",
  "type": "bug"
}
```

`type` → `bug` or `feature_request`

---

#### Get All Issues

```
GET /api/issues
```

Query params (all optional):

| Param    | Values                            |
| -------- | --------------------------------- |
| `sort`   | `newest` (default), `oldest`      |
| `type`   | `bug`, `feature_request`          |
| `status` | `open`, `in_progress`, `resolved` |

Example:

```
GET /api/issues?type=bug&status=open&sort=oldest
```

---

#### Get Single Issue

```
GET /api/issues/:id
```

---

#### Update Issue `🔒`

```
PATCH /api/issues/:id
Authorization: <token>
```

```json
{
  "title": "Updated title",
  "description": "Updated description here",
  "type": "feature_request",
  "status": "in_progress"
}
```

- Contributors can only update their own issues when status is `open`
- Maintainers can update any issue including `status`

---

#### Delete Issue `🔒 Maintainer only`

```
DELETE /api/issues/:id
Authorization: <token>
```

---

## Response Format

Success:

```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Details"
}
```

---

## Status Codes

| Code | Meaning      |
| ---- | ------------ |
| 200  | OK           |
| 201  | Created      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |
| 409  | Conflict     |
| 500  | Server Error |
