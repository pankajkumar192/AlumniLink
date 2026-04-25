# AlumniLink Backend Routes - Complete Reference

All routes are prefixed with `/api`

---

## Authentication Routes (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login user |
| GET | `/auth/me` | ✅ | Get current user profile |
| PUT | `/auth/profile` | ✅ | Update user profile |

### Request/Response Examples

**Register**
```
POST /api/auth/register
Body: { name, email, password, confirmPassword, role? }
Response: { success, token, user }
```

**Login**
```
POST /api/auth/login
Body: { email, password }
Response: { success, token, user }
```

**Get Me**
```
GET /api/auth/me
Headers: Authorization: Bearer TOKEN
Response: { success, data: User }
```

**Update Profile**
```
PUT /api/auth/profile
Headers: Authorization: Bearer TOKEN
Body: { name?, bio?, phone?, company?, position?, yearsOfExperience?, university?, graduationYear?, skills?, interests? }
Response: { success, data: User }
```

---

## Mentor Routes (`/api/mentors`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/mentors` | ❌ | Get all mentors |
| GET | `/mentors/:id` | ❌ | Get mentor by ID |
| POST | `/mentors` | ✅ | Create mentor profile |
| PUT | `/mentors/:id` | ✅ | Update mentor profile |
| GET | `/mentors/search?skill=:skill` | ❌ | Search mentors by skill |

### Request/Response Examples

**Get All Mentors**
```
GET /api/mentors
Response: { success, data: [Mentor] }
```

**Get Mentor by ID**
```
GET /api/mentors/1
Response: { success, data: Mentor }
```

**Create Mentor Profile**
```
POST /api/mentors
Headers: Authorization: Bearer TOKEN
Body: { company, skills[], availability, hourlyRate? }
Response: { success, data: Mentor }
```

**Update Mentor Profile**
```
PUT /api/mentors/1
Headers: Authorization: Bearer TOKEN
Body: { company?, skills[]?, availability?, hourlyRate? }
Response: { success, data: Mentor }
```

**Search by Skill**
```
GET /api/mentors/search?skill=JavaScript
Response: { success, data: [Mentor] }
```

---

## Mentorship Routes (`/api/mentorship`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/mentorship` | ✅ | Create mentorship request |
| GET | `/mentorship` | ✅ | Get all mentorship requests |
| PUT | `/mentorship/:id` | ✅ | Update request status |

### Request/Response Examples

**Create Request**
```
POST /api/mentorship
Headers: Authorization: Bearer TOKEN
Body: { mentorId, subject, message? }
Response: { success, data: MentorshipRequest }
```

**Get All Requests**
```
GET /api/mentorship
Headers: Authorization: Bearer TOKEN
Response: { success, data: [MentorshipRequest] }
```

**Update Status**
```
PUT /api/mentorship/1
Headers: Authorization: Bearer TOKEN
Body: { status: "PENDING|ACCEPTED|REJECTED|COMPLETED" }
Response: { success, data: MentorshipRequest }
```

---

## Job Routes (`/api/jobs`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/jobs` | ❌ | Get all job postings |
| GET | `/jobs/:id` | ❌ | Get job by ID |
| POST | `/jobs` | ✅ | Create job posting |
| POST | `/jobs/:id/apply` | ✅ | Apply for job |
| GET | `/jobs/:jobId/applications` | ✅ | Get job applications |
| GET | `/jobs/applications/my` | ✅ | Get my applications |
| PUT | `/jobs/applications/:applicationId/status` | ✅ | Update application status |

### Request/Response Examples

**Get All Jobs**
```
GET /api/jobs?company=Tech&jobType=FULL_TIME
Query: company?, jobType?
Response: { success, count, data: [JobPosting] }
```

**Get Job by ID**
```
GET /api/jobs/1
Response: { success, data: JobPosting }
```

**Create Job Posting**
```
POST /api/jobs
Headers: Authorization: Bearer TOKEN
Body: { title, description, company, location?, salary?, jobType?, skills[]?, deadline? }
Response: { success, data: JobPosting }
```

**Apply for Job**
```
POST /api/jobs/1/apply
Headers: Authorization: Bearer TOKEN
Response: { success, data: JobApplication }
```

**Get Job Applications**
```
GET /api/jobs/1/applications
Headers: Authorization: Bearer TOKEN
Response: { success, data: [JobApplication] }
```

**Get My Applications**
```
GET /api/jobs/applications/my
Headers: Authorization: Bearer TOKEN
Response: { success, data: [JobApplication] }
```

**Update Application Status**
```
PUT /api/jobs/applications/1/status
Headers: Authorization: Bearer TOKEN
Body: { status: "PENDING|REVIEWED|REJECTED|ACCEPTED" }
Response: { success, data: JobApplication }
```

---

## Event Routes (`/api/events`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/events` | ❌ | Get all events |
| GET | `/events/:id` | ❌ | Get event by ID |
| POST | `/events` | ✅ | Create event |
| POST | `/events/:id/register` | ✅ | Register for event |
| GET | `/events/:id/attendees` | ❌ | Get event attendees |

### Request/Response Examples

**Get All Events**
```
GET /api/events?eventType=WORKSHOP
Query: eventType?
Response: { success, count, data: [Event] }
```

**Get Event by ID**
```
GET /api/events/1
Response: { success, data: Event }
```

**Create Event**
```
POST /api/events
Headers: Authorization: Bearer TOKEN
Body: { title, description?, date, location?, eventType?, capacity?, image? }
Response: { success, data: Event }
```

**Register for Event**
```
POST /api/events/1/register
Headers: Authorization: Bearer TOKEN
Response: { success, data: EventAttendee }
```

**Get Event Attendees**
```
GET /api/events/1/attendees
Response: { success, data: [EventAttendee] }
```

---

## Notification Routes (`/api/notifications`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | ✅ | Get user notifications |
| GET | `/notifications/count/unread` | ✅ | Get unread count |
| PUT | `/notifications/:id/read` | ✅ | Mark as read |
| PUT | `/notifications/read-all` | ✅ | Mark all as read |
| DELETE | `/notifications/:id` | ✅ | Delete notification |

### Request/Response Examples

**Get Notifications**
```
GET /api/notifications?includeRead=false
Query: includeRead?
Headers: Authorization: Bearer TOKEN
Response: { success, count, data: [Notification] }
```

**Get Unread Count**
```
GET /api/notifications/count/unread
Headers: Authorization: Bearer TOKEN
Response: { success, data: { unreadCount: 5 } }
```

**Mark as Read**
```
PUT /api/notifications/1/read
Headers: Authorization: Bearer TOKEN
Response: { success, data: Notification }
```

**Mark All as Read**
```
PUT /api/notifications/read-all
Headers: Authorization: Bearer TOKEN
Response: { success, message, data }
```

**Delete Notification**
```
DELETE /api/notifications/1
Headers: Authorization: Bearer TOKEN
Response: { success, message }
```

---

## Data Models

### User
```
{
  id: number
  name: string
  email: string (unique)
  password: string (hashed)
  role: "STUDENT" | "ALUMNI" | "ADMIN"
  bio?: string
  avatar?: string
  phone?: string
  company?: string
  position?: string
  yearsOfExperience?: number
  university?: string
  graduationYear?: number
  skills?: string[] (JSON)
  interests?: string[] (JSON)
  isVerified: boolean
  isMentor: boolean
  mentorBio?: string
  mentorRating: number
  createdAt: datetime
  updatedAt: datetime
}
```

### Mentor
```
{
  id: number
  userId: number (FK)
  company: string
  skills: string[] (JSON)
  availability: string
  hourlyRate?: number
  createdAt: datetime
  updatedAt: datetime
  user: User
}
```

### MentorshipRequest
```
{
  id: number
  studentId: number (FK)
  mentorId: number (FK)
  subject: string
  message?: string
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED"
  startDate?: datetime
  endDate?: datetime
  createdAt: datetime
  updatedAt: datetime
}
```

### JobPosting
```
{
  id: number
  title: string
  description: string
  company: string
  location?: string
  salary?: string
  jobType: "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT"
  skills?: string[] (JSON)
  postedBy: number (FK)
  deadline?: datetime
  createdAt: datetime
  updatedAt: datetime
}
```

### JobApplication
```
{
  id: number
  jobId: number (FK)
  userId: number (FK)
  status: "PENDING" | "REVIEWED" | "REJECTED" | "ACCEPTED"
  appliedAt: datetime
  updatedAt: datetime
}
```

### Event
```
{
  id: number
  title: string
  description?: string
  date: datetime
  location?: string
  eventType: "NETWORKING" | "WORKSHOP" | "SEMINAR" | "CAREER_FAIR"
  organizerId: number (FK)
  capacity?: number
  image?: string
  createdAt: datetime
  updatedAt: datetime
}
```

### EventAttendee
```
{
  id: number
  eventId: number (FK)
  userId: number (FK)
  registeredAt: datetime
}
```

### Notification
```
{
  id: number
  recipientId: number (FK)
  senderId?: number (FK)
  title: string
  message: string
  type: "MENTORSHIP_REQUEST" | "JOB_APPLICATION" | "EVENT_INVITE" | "PROFILE_UPDATE" | "SYSTEM"
  read: boolean
  relatedId?: number
  createdAt: datetime
  updatedAt: datetime
}
```

---

## Authentication Headers

All protected routes require:
```
Authorization: Bearer JWT_TOKEN
```

Token is obtained from login/register response and should be stored client-side.

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Query Parameters

### Common Filters
- `?company=value` - Filter by company name
- `?jobType=value` - Filter by job type
- `?eventType=value` - Filter by event type
- `?skill=value` - Search by skill
- `?includeRead=true` - Include read items

### Pagination (future implementation)
- `?skip=10` - Skip first 10 records
- `?take=20` - Take 20 records

---

**Last Updated**: April 2026
**API Version**: 1.0
**Database**: MySQL (Prisma ORM)
