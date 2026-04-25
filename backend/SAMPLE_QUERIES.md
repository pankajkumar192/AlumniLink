# AlumniLink API - Sample Queries

This file contains sample API queries for testing the AlumniLink backend after migration to MySQL.

## Prerequisites

1. Backend running on `http://localhost:5000`
2. MySQL database configured and migrated
3. You can use any of these methods:
   - cURL (command line)
   - Postman
   - Insomnia
   - VS Code REST Client

---

## 🔐 Authentication

### Register User

**POST** `/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "role": "STUDENT"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "avatar": "https://i.pravatar.cc/150?img=1"
  }
}
```

---

### Login

**POST** `/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

---

### Get Current User

**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Update Profile

**PUT** `/api/auth/profile`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "name": "John Smith",
  "bio": "Passionate developer",
  "phone": "+1-555-0123",
  "company": "Tech Corp",
  "position": "Senior Developer",
  "yearsOfExperience": 5,
  "university": "Stanford University",
  "graduationYear": 2020,
  "skills": ["JavaScript", "React", "Node.js", "MySQL"],
  "interests": ["Web Development", "AI", "Cloud Computing"]
}
```

---

## 👨‍🏫 Mentors

### Get All Mentors

**GET** `/api/mentors`

Query Parameters:
- None for basic list

---

### Get Mentor by ID

**GET** `/api/mentors/:id`

Example: `GET /api/mentors/1`

---

### Create Mentor Profile

**POST** `/api/mentors`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "company": "Tech Giants Inc",
  "skills": ["JavaScript", "React", "Node.js", "AWS"],
  "availability": "weekends",
  "hourlyRate": 75
}
```

---

### Update Mentor Profile

**PUT** `/api/mentors/:id`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "company": "New Company",
  "skills": ["Python", "Django", "PostgreSQL"],
  "availability": "flexible",
  "hourlyRate": 85
}
```

---

### Search Mentors by Skill

**GET** `/api/mentors/search?skill=JavaScript`

Query Parameters:
- `skill` - Skill to search for

---

## 📋 Mentorship Requests

### Create Mentorship Request

**POST** `/api/mentorship`

Headers:
```
Authorization: Bearer STUDENT_JWT_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "mentorId": 2,
  "subject": "JavaScript and React Guidance",
  "message": "I would like to learn advanced React patterns and best practices"
}
```

---

### Get Mentorship Requests

**GET** `/api/mentorship`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Returns requests where user is either student or mentor.

---

### Update Mentorship Request Status

**PUT** `/api/mentorship/:id`

Headers:
```
Authorization: Bearer MENTOR_JWT_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "status": "ACCEPTED"
}
```

Valid statuses: `PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`

---

## 💼 Jobs

### Get All Jobs

**GET** `/api/jobs`

Query Parameters:
- `company` - Filter by company name
- `jobType` - Filter by job type (FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT)

Example: `GET /api/jobs?company=Tech&jobType=FULL_TIME`

---

### Get Job by ID

**GET** `/api/jobs/:id`

Example: `GET /api/jobs/1`

---

### Create Job Posting

**POST** `/api/jobs`

Headers:
```
Authorization: Bearer ALUMNI_JWT_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "title": "Senior React Developer",
  "description": "We are looking for an experienced React developer to join our team. You should have 5+ years of experience with React, JavaScript, and modern web technologies.",
  "company": "Tech Innovations LLC",
  "location": "San Francisco, CA",
  "salary": "$120,000 - $150,000",
  "jobType": "FULL_TIME",
  "skills": ["React", "JavaScript", "Node.js", "TypeScript"],
  "deadline": "2025-12-31T23:59:59Z"
}
```

---

### Apply for Job

**POST** `/api/jobs/:id/apply`

Headers:
```
Authorization: Bearer STUDENT_JWT_TOKEN
```

Example: `POST /api/jobs/1/apply`

---

### Get Job Applications

**GET** `/api/jobs/:jobId/applications`

Headers:
```
Authorization: Bearer ALUMNI_JWT_TOKEN
```

Example: `GET /api/jobs/1/applications`

---

### Update Application Status

**PUT** `/api/jobs/applications/:applicationId/status`

Headers:
```
Authorization: Bearer JOB_POSTER_JWT_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "status": "ACCEPTED"
}
```

Valid statuses: `PENDING`, `REVIEWED`, `REJECTED`, `ACCEPTED`

---

### Get My Job Applications

**GET** `/api/jobs/applications/my`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🎉 Events

### Get All Events

**GET** `/api/events`

Query Parameters:
- `eventType` - Filter by event type (NETWORKING, WORKSHOP, SEMINAR, CAREER_FAIR)

Example: `GET /api/events?eventType=WORKSHOP`

---

### Get Event by ID

**GET** `/api/events/:id`

Example: `GET /api/events/1`

---

### Create Event

**POST** `/api/events`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

Body:
```json
{
  "title": "React Workshop 2024",
  "description": "Learn advanced React concepts including hooks, context API, and performance optimization",
  "date": "2024-06-15T14:00:00Z",
  "location": "San Francisco Convention Center",
  "eventType": "WORKSHOP",
  "capacity": 100,
  "image": "https://example.com/event-image.jpg"
}
```

---

### Register for Event

**POST** `/api/events/:id/register`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Example: `POST /api/events/1/register`

---

### Get Event Attendees

**GET** `/api/events/:id/attendees`

Example: `GET /api/events/1/attendees`

---

## 🔔 Notifications

### Get User Notifications

**GET** `/api/notifications`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Query Parameters:
- `includeRead` - Include read notifications (true/false)

Example: `GET /api/notifications?includeRead=false`

---

### Get Unread Notification Count

**GET** `/api/notifications/count/unread`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Mark Notification as Read

**PUT** `/api/notifications/:id/read`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Example: `PUT /api/notifications/5/read`

---

### Mark All as Read

**PUT** `/api/notifications/read-all`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Delete Notification

**DELETE** `/api/notifications/:id`

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Example: `DELETE /api/notifications/5`

---

## 🧪 Complete Testing Flow

Here's a complete flow to test the entire system:

### 1. Create Student Account
```bash
POST /api/auth/register
{
  "name": "Alice Student",
  "email": "alice@example.com",
  "password": "Pass123!",
  "confirmPassword": "Pass123!",
  "role": "STUDENT"
}
```
Save the JWT token as `STUDENT_TOKEN`

### 2. Create Alumni/Mentor Account
```bash
POST /api/auth/register
{
  "name": "Bob Mentor",
  "email": "bob@example.com",
  "password": "Pass123!",
  "confirmPassword": "Pass123!",
  "role": "ALUMNI"
}
```
Save the JWT token as `MENTOR_TOKEN`

### 3. Create Mentor Profile (as Bob)
```bash
POST /api/mentors
Headers: Authorization: Bearer MENTOR_TOKEN
{
  "company": "Tech Corp",
  "skills": ["JavaScript", "React"],
  "availability": "weekends",
  "hourlyRate": 60
}
```

### 4. Send Mentorship Request (as Alice)
```bash
POST /api/mentorship
Headers: Authorization: Bearer STUDENT_TOKEN
{
  "mentorId": 2,
  "subject": "Learn React",
  "message": "I want to learn React best practices"
}
```

### 5. Accept Mentorship Request (as Bob)
```bash
PUT /api/mentorship/1
Headers: Authorization: Bearer MENTOR_TOKEN
{
  "status": "ACCEPTED"
}
```

### 6. Create Job Posting (as Bob)
```bash
POST /api/jobs
Headers: Authorization: Bearer MENTOR_TOKEN
{
  "title": "Frontend Developer",
  "description": "Build amazing UIs",
  "company": "Tech Corp",
  "jobType": "FULL_TIME",
  "skills": ["React", "JavaScript"]
}
```

### 7. Apply for Job (as Alice)
```bash
POST /api/jobs/1/apply
Headers: Authorization: Bearer STUDENT_TOKEN
```

### 8. Check Notifications (as Bob)
```bash
GET /api/notifications
Headers: Authorization: Bearer MENTOR_TOKEN
```

---

## 📄 cURL Examples

### Register via cURL
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "role": "STUDENT"
  }'
```

### Login via cURL
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Mentors via cURL
```bash
curl http://localhost:5000/api/mentors
```

### Create Mentor Profile via cURL
```bash
curl -X POST http://localhost:5000/api/mentors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "company": "Tech Corp",
    "skills": ["JavaScript", "React"],
    "availability": "weekends",
    "hourlyRate": 60
  }'
```

---

## ✅ Expected Response Formats

### Success Response
```json
{
  "success": true,
  "data": { /* entity data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### List Response
```json
{
  "success": true,
  "count": 5,
  "data": [ /* entities */ ]
}
```

---

## 🔐 Token Usage

Always include JWT token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires in 7 days (configurable in `.env` as `JWT_EXPIRE`)

---

## 📱 Frontend Integration

When integrating with frontend:

1. Store token in localStorage or sessionStorage
2. Include token in all protected requests
3. Handle 401 responses (token expired) - redirect to login
4. Refresh token logic can be added for better UX

Example:
```javascript
const token = localStorage.getItem('token');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

fetch('/api/mentors', { headers })
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## 🐛 Debugging Tips

1. **Check Network Tab**: View actual requests/responses
2. **Console Errors**: Check browser console for errors
3. **Server Logs**: Check terminal where backend is running
4. **Database**: Use `npx prisma studio` to inspect database
5. **Token**: Decode JWT at [jwt.io](https://jwt.io)

---

**Last Updated**: April 2026
