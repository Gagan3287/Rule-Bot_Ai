# RuleBot API Specifications (Swagger/OpenAPI)

RuleBot is backed by a FastAPI backend that dynamically exposes self-documenting OpenAPI schemas and interactive Swagger UI panels.

## Swagger UI Access
When the backend application is running, you can access interactive API docs at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Authentication Endpoints

### 1. Register User
- **Endpoint**: `POST /auth/register`
- **Description**: Registers a new user. Assigns "admin" role to the first registered user and "user" to others.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1...",
    "token_type": "bearer",
    "user": {
      "id": "e672da51-4043-4cb5-829d-9d413158c3db",
      "email": "user@example.com",
      "role": "user",
      "created_at": "2026-07-12T14:30:00Z"
    }
  }
  ```

### 2. Login User
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticates user credentials and returns a signed JWT.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK)**: Same structure as register.

### 3. Get Current User Profile
- **Endpoint**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response (200 OK)**:
  ```json
  {
    "id": "e672da51-4043-4cb5-829d-9d413158c3db",
    "email": "user@example.com",
    "role": "user",
    "created_at": "2026-07-12T14:30:00Z"
  }
  ```

---

## Chat & History Endpoints

### 4. Send Message (Match Intent)
- **Endpoint**: `POST /chat`
- **Query Parameters**: `session_id` (optional, string UUID. If omitted, starts a new conversation).
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**:
  ```json
  {
    "text": "What is Python programming?"
  }
  ```
- **Response (200 OK)**: Returns the saved user query and the rule bot response in order:
  ```json
  [
    {
      "id": "a98a0e88-6627-4c74-9844-8cb9d506d860",
      "session_id": "a189f7f8-9a99-4c28-9fa4-7e8e19c9ad6a",
      "sender": "user",
      "text": "What is Python programming?",
      "intent_matched": "Python",
      "created_at": "2026-07-12T14:35:10Z"
    },
    {
      "id": "b182fb0d-52ef-4573-b6d4-8d4e135cb101",
      "session_id": "a189f7f8-9a99-4c28-9fa4-7e8e19c9ad6a",
      "sender": "bot",
      "text": "Python is a high-level, interpreted programming language known for its readability and simplicity. It is widely used in Web Development, Data Science, automation, and Artificial Intelligence.",
      "intent_matched": "Python",
      "created_at": "2026-07-12T14:35:11Z"
    }
  ]
  ```

### 5. Get User Chat Sessions
- **Endpoint**: `GET /history`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Description**: Returns all sessions created by the authorized user, ordered by date descending.
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "a189f7f8-9a99-4c28-9fa4-7e8e19c9ad6a",
      "title": "What is Python programming?",
      "created_at": "2026-07-12T14:35:10Z"
    }
  ]
  ```

### 6. Get Chat Session Details
- **Endpoint**: `GET /history/{id}`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Description**: Gets messages inside a specific session.
- **Response (200 OK)**:
  ```json
  {
    "id": "a189f7f8-9a99-4c28-9fa4-7e8e19c9ad6a",
    "user_id": "e672da51-4043-4cb5-829d-9d413158c3db",
    "title": "What is Python programming?",
    "created_at": "2026-07-12T14:35:10Z",
    "messages": [
      {
        "id": "a98a0e88-6627-4c74-9844-8cb9d506d860",
        "session_id": "a189f7f8-9a99-4c28-9fa4-7e8e19c9ad6a",
        "sender": "user",
        "text": "What is Python programming?",
        "intent_matched": "Python",
        "created_at": "2026-07-12T14:35:10Z"
      },
      {
        "id": "b182fb0d-52ef-4573-b6d4-8d4e135cb101",
        "session_id": "a189f7f8-9a99-4c28-9fa4-7e8e19c9ad6a",
        "sender": "bot",
        "text": "Python is a high-level, interpreted programming language known for...",
        "intent_matched": "Python",
        "created_at": "2026-07-12T14:35:11Z"
      }
    ]
  }
  ```

### 7. Delete Chat Session
- **Endpoint**: `DELETE /history/{id}`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response**: `204 No Content` (Successfully deleted)

---

## Analytics Endpoints

### 8. Get Admin Dashboard Stats
- **Endpoint**: `GET /analytics`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>` (Must be admin role)
- **Response (200 OK)**:
  ```json
  {
    "total_users": 15,
    "total_chats": 42,
    "most_asked_questions": [
      {
        "question": "Python",
        "count": 14
      },
      {
        "question": "AI",
        "count": 9
      },
      {
        "question": "Time",
        "count": 7
      }
    ],
    "daily_chats": [
      {
        "date": "2026-07-06",
        "count": 2
      },
      {
        "date": "2026-07-07",
        "count": 5
      },
      {
        "date": "2026-07-12",
        "count": 12
      }
    ]
  }
  ```
