# 📚 AlumniLink API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

```json
Request:
{
  "name": "John Doe",
  "email": "john@alumni.com",
  "password": "Test@1234",
  "confirmPassword": "Test@1234",
  "role": "student"
}

Response (201):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@alumni.com",
    "role": "student",
    "avatar": "https://i.pravatar.cc/150?img=1"
  }
}
```

### Login
**POST** `/auth/login`

```json
Request:
{
  "email": "john@alumni.com",
  "password": "Test@1234"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@alumni.com",
    "role": "student",
    "avatar": "https://i.pravatar.cc/150?img=1"
  }
}
```

### Get Current User
**GET** `/auth/me` (Protected)

```json
Response (200):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@alumni.com",
    "role": "student",
    "bio": "Passionate about technology",
    "phone": "+1234567890",
    "company": "TechCorp",
    "position": "Software Engineer",
    "yearsOfExperience": 3,
    "university": "Stanford",
    "graduationYear": 2021,
    "skills": ["React", "Node.js", "MongoDB"],
    "interests": ["Web Development", "Startups"],
    "isMentor": false,
    "mentorRating": 0
  }
}
```

### Update Profile
**PUT** `/auth/profile` (Protected)

```json
Request:
{
  "name": "John Doe",
  "bio": "Updated bio",
  "phone": "+1234567890",
  "company": "TechCorp",
  "position": "Senior Engineer",
  "yearsOfExperience": 5,
  "university": "Stanford",
  "graduationYear": 2021,
  "skills": ["React", "Node.js", "MongoDB", "TypeScript"],
  "interests": ["Web Development", "Startups", "AI"]
}

Response (200):
{
  "success": true,
  "data": { ... updated user data ... }
}
```

---

## 👥 Mentor Endpoints

### Get All Mentors
**GET** `/mentors`

```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Sarah Mitchell",
      "email": "sarah@alumni.com",
      "role": "alumni",
      "bio": "Senior Product Manager",
      "company": "TechCorp",
      "position": "Senior PM",
      "yearsOfExperience": 10,
      "skills": ["Product Strategy", "Agile", "Leadership"],
      "isMentor": true,
      "mentorBio": "10+ years of product management",
      "mentorRating": 4.8
    }
  ]
}
```

### Get Mentor by ID
**GET** `/mentors/:id`

```json
Response (200):
{
  "success": true,
  "data": { ... mentor details ... }
}
```

### Update Mentor Profile
**PUT** `/mentors/profile` (Protected)

```json
Request:
{
  "isMentor": true,
  "mentorBio": "Looking to mentor junior engineers",
  "skills": ["React", "Node.js", "System Design", "Leadership"]
}

Response (200):
{
  "success": true,
  "data": { ... updated mentor data ... }
}
```

---

## 📧 Mentorship Endpoints

### Create Mentorship Request
**POST** `/mentorship` (Protected)

```json
Request:
{
  "mentorId": "507f1f77bcf86cd799439012",
  "subject": "Career Guidance in Product Management",
  "message": "I'm interested in learning about product management"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "studentId": "507f1f77bcf86cd799439011",
    "mentorId": "507f1f77bcf86cd799439012",
    "subject": "Career Guidance in Product Management",
    "message": "I'm interested in learning about product management",
    "status": "pending",
    "createdAt": "2026-04-24T10:30:00Z"
  }
}
```

### Get Mentorship Requests
**GET** `/mentorship` (Protected)

```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439013",
      "studentId": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@alumni.com",
        "avatar": "https://i.pravatar.cc/150?img=1"
      },
      "mentorId": {
        "id": "507f1f77bcf86cd799439012",
        "name": "Sarah Mitchell",
        "email": "sarah@alumni.com",
        "avatar": "https://i.pravatar.cc/150?img=2"
      },
      "status": "pending",
      "subject": "Career Guidance",
      "message": "I'm interested in learning",
      "createdAt": "2026-04-24T10:30:00Z"
    }
  ]
}
```

### Update Mentorship Request
**PUT** `/mentorship/:id` (Protected)

```json
Request:
{
  "status": "accepted"
}

Response (200):
{
  "success": true,
  "data": { ... updated request data ... }
}
```

**Status Options**: `pending`, `accepted`, `rejected`, `completed`

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Mentor not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🧪 Sample cURL Commands

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@alumni.com",
    "password": "Test@1234",
    "confirmPassword": "Test@1234",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@alumni.com",
    "password": "Test@1234"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get All Mentors
```bash
curl -X GET http://localhost:5000/api/mentors
```

---

## 📊 Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  role: String (student/alumni/admin),
  bio: String,
  avatar: String,
  phone: String,
  company: String,
  position: String,
  yearsOfExperience: Number,
  university: String,
  graduationYear: Number,
  skills: [String],
  interests: [String],
  isMentor: Boolean,
  mentorBio: String,
  mentorRating: Number (0-5),
  createdAt: Date,
  updatedAt: Date
}
```

### MentorshipRequest
```javascript
{
  studentId: ObjectId (ref: User),
  mentorId: ObjectId (ref: User),
  subject: String,
  message: String,
  status: String (pending/accepted/rejected/completed),
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 Related Endpoints

### Health Check
**GET** `/health`

```json
Response (200):
{
  "success": true,
  "message": "Server is running"
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Passwords are hashed with bcrypt
- JWT tokens expire based on JWT_EXPIRE setting
- Protected endpoints require valid JWT token
- All responses follow success/error format
- API uses CORS for cross-origin requests

---

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens are required for protected endpoints
- CORS is enabled for specified origins
- Helmet provides security headers
- Input validation on all endpoints

---

## 🚀 Rate Limiting

Future implementation:
- Implement rate limiting for auth endpoints
- Add request throttling for API calls
- Monitor and log suspicious activity

