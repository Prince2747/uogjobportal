# API Reference

## Authentication

All API endpoints require authentication unless otherwise specified. Include the session token in requests.

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@uog.edu.et",
  "password": "securePassword123",
  "department": "Computer Science"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@uog.edu.et",
    "role": "APPLICANT"
  }
}
```

#### POST `/api/auth/forgot-password`
Request password reset.

**Request:**
```json
{
  "email": "user@uog.edu.et"
}
```

#### POST `/api/auth/reset-password`
Reset password with token.

**Request:**
```json
{
  "token": "reset_token",
  "password": "newPassword123"
}
```

## Admin Endpoints

### GET `/api/admin/dashboard`
Retrieve admin dashboard statistics.

**Response:**
```json
{
  "totalUsers": 150,
  "activeJobs": 25,
  "totalApplications": 300
}
```

### GET `/api/admin/users`
Retrieve paginated user list.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term
- `role` (string): Filter by role
- `status` (string): Filter by status

**Response:**
```json
{
  "users": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@uog.edu.et",
      "role": "APPLICANT",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "totalPages": 10,
  "currentPage": 1,
  "totalUsers": 100
}
```

### PATCH `/api/admin/users`
Update user information.

**Request:**
```json
{
  "userId": "user_id",
  "role": "HR",
  "isActive": true
}
```

### DELETE `/api/admin/users?userId=user_id`
Delete a user account.

## HR Endpoints

### GET `/api/hr/stats`
Retrieve HR dashboard statistics.

**Response:**
```json
{
  "totalApplicants": 100,
  "activeJobs": 15,
  "pendingApplications": 45,
  "totalChats": 20
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error