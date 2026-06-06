# ExpenseIQ API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require an `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

---

## Auth Endpoints

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```
**Response 201:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com", "createdAt": "..." },
    "token": "eyJhbGci..."
  }
}
```

### POST /auth/login
```json
{ "email": "john@example.com", "password": "secret123" }
```

### GET /auth/me *(protected)*
Returns current user profile.

### PUT /auth/profile *(protected)*
```json
{ "name": "Jane Doe", "email": "jane@example.com" }
```

### PUT /auth/change-password *(protected)*
```json
{ "currentPassword": "secret123", "newPassword": "newpass456" }
```

---

## Expense Endpoints

All expense routes are protected.

### GET /expenses
Query parameters:

| Param       | Type   | Default | Description                            |
|-------------|--------|---------|----------------------------------------|
| page        | number | 1       | Page number                            |
| limit       | number | 10      | Items per page (max 100)               |
| search      | string | -       | Search in title and notes              |
| category    | string | -       | Filter by category                     |
| startDate   | string | -       | ISO date (e.g. 2024-01-01)             |
| endDate     | string | -       | ISO date                               |
| sortBy      | string | date    | date \| amount \| title \| createdAt  |
| sortDir     | string | desc    | asc \| desc                            |

**Response 200:**
```json
{
  "success": true,
  "data": [ {...}, {...} ],
  "meta": { "total": 60, "page": 1, "limit": 10, "totalPages": 6 }
}
```

### POST /expenses
```json
{
  "title": "Lunch",
  "amount": 15.50,
  "category": "food",
  "date": "2024-06-06",
  "notes": "Team lunch"
}
```

**Valid categories:** `food` | `transport` | `shopping` | `entertainment` | `health` | `utilities` | `education` | `other`

### GET /expenses/:id
Returns a single expense by UUID.

### PUT /expenses/:id
Same body as POST /expenses — all fields required.

### DELETE /expenses/:id
Returns `{ "id": "deleted-uuid" }`.

---

## Dashboard Endpoints

### GET /dashboard/summary
Returns full dashboard data in one request.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalExpenses": 4523.75,
    "totalCount": 60,
    "currentMonthExpenses": 823.50,
    "currentMonthCount": 12,
    "categoryWiseExpenses": [
      { "category": "food", "total": 1200.00, "count": 20 }
    ],
    "recentTransactions": [ {...} ],
    "monthlyTrend": [
      { "month": "Jan 2024", "monthKey": "2024-01", "total": 750.00, "count": 10 }
    ]
  }
}
```

### GET /dashboard/monthly-trend?months=6
Returns last N months of expense totals.

---

## Error Responses

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "amount", "message": "Amount must be a positive number" }
  ]
}
```

| Status | Meaning                  |
|--------|--------------------------|
| 400    | Bad request / validation |
| 401    | Unauthorized             |
| 403    | Forbidden                |
| 404    | Not found                |
| 409    | Conflict (duplicate)     |
| 429    | Rate limit exceeded      |
| 500    | Internal server error    |
