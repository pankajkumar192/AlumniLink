# AlumniLink Backend - MongoDB to MySQL Migration Guide

## ✅ Migration Complete

The backend has been successfully refactored from MongoDB + Mongoose to MySQL + Prisma ORM.

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14+)
- MySQL Server (v5.7+)
- npm or yarn

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `@prisma/client` - Prisma Client for Node.js
- `mysql2` - MySQL driver
- `prisma` - Prisma CLI (dev dependency)

### Step 2: Configure Environment Variables

Update `.env` with your MySQL credentials:

```env
PORT=5000

# MySQL Connection String Format: mysql://username:password@host:port/database_name
DATABASE_URL="mysql://root:password@localhost:3306/alumnilink"

JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Example with MySQL on localhost:**
```env
DATABASE_URL="mysql://root:root@localhost:3306/alumnilink"
```

**Example with hosted MySQL:**
```env
DATABASE_URL="mysql://user:password@db.example.com:3306/alumnilink"
```

### Step 3: Create MySQL Database

```sql
CREATE DATABASE alumnilink;
USE alumnilink;
```

Or using command line:

```bash
mysql -u root -p -e "CREATE DATABASE alumnilink;"
```

### Step 4: Initialize Prisma

Generate Prisma Client and run migrations:

```bash
npx prisma migrate dev --name init
```

This will:
1. Create the database schema
2. Generate Prisma Client
3. Create migration files

### Step 5: Install Prisma CLI (Optional)

For development convenience:

```bash
npm install -g prisma
```

Then you can use simpler commands:
```bash
prisma studio      # Visual database explorer
prisma migrate dev # Run migrations
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Prisma client configuration
│   ├── controllers/             # API endpoint handlers
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── jobController.js
│   │   ├── mentorController.js
│   │   ├── mentorshipController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authentication middleware
│   ├── routes/                  # API routes
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── mentorRoutes.js
│   │   ├── mentorshipRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/                # Business logic layer
│   │   ├── authService.js       # Auth operations
│   │   ├── mentorService.js     # Mentor operations
│   │   ├── mentorshipService.js # Mentorship operations
│   │   ├── jobService.js        # Job operations
│   │   ├── eventService.js      # Event operations
│   │   └── notificationService.js # Notification operations
│   └── server.js                # Express app entry point
├── prisma/
│   └── schema.prisma            # Prisma database schema
├── .env                         # Environment variables
└── package.json
```

---

## 🗄️ Database Schema

### Models

1. **User** - Core user entity
   - Authentication and profile information
   - Relations: Mentor (optional), JobPostings, Events, Notifications

2. **Mentor** - Extended mentor profile
   - Skills, availability, hourly rate
   - Relation: One-to-one with User

3. **MentorshipRequest** - Mentorship requests
   - Links students to mentors
   - Status tracking (pending/accepted/rejected/completed)

4. **JobPosting** - Job listings
   - Company, title, description, requirements
   - Tracks applications

5. **JobApplication** - Application submissions
   - Tracks which users applied to which jobs
   - Status tracking

6. **Event** - Events and workshops
   - Organizer, date, capacity
   - Tracks attendees

7. **EventAttendee** - Event registrations
   - Links users to events

8. **Notification** - User notifications
   - Type-based notifications (mentorship, jobs, events)
   - Read/unread tracking

---

## 🔑 Key Schema Features

### Relationships

```
User (1) ──── (1) Mentor
User (1) ──── (Many) MentorshipRequest (as Student)
Mentor (1) ──── (Many) MentorshipRequest (as Mentor)
User (1) ──── (Many) JobPosting
JobPosting (1) ──── (Many) JobApplication
User (1) ──── (Many) JobApplication
User (1) ──── (Many) Event
Event (1) ──── (Many) EventAttendee
User (1) ──── (Many) EventAttendee
User (1) ──── (Many) Notification
```

### Indexes

All foreign keys are automatically indexed for optimal query performance:
- `User.email` - Unique, indexed
- `User.isMentor` - Indexed
- `User.role` - Indexed
- Foreign keys on all relations
- `Notification.createdAt` - Indexed for sorting

### Enums

```
Role: STUDENT, ALUMNI, ADMIN
MentorshipStatus: PENDING, ACCEPTED, REJECTED, COMPLETED
JobType: FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT
ApplicationStatus: PENDING, REVIEWED, REJECTED, ACCEPTED
EventType: NETWORKING, WORKSHOP, SEMINAR, CAREER_FAIR
NotificationType: MENTORSHIP_REQUEST, JOB_APPLICATION, EVENT_INVITE, PROFILE_UPDATE, SYSTEM
```

---

## 🚀 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will start on `http://localhost:5000`

---

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Mentors
- `GET /api/mentors` - Get all mentors
- `GET /api/mentors/:id` - Get mentor by ID
- `POST /api/mentors` - Create mentor profile (protected)
- `PUT /api/mentors/:id` - Update mentor profile (protected)
- `GET /api/mentors/search?skill=skill_name` - Search by skill

### Mentorship Requests
- `POST /api/mentorship` - Create request (protected)
- `GET /api/mentorship` - Get all requests (protected)
- `PUT /api/mentorship/:id` - Update request status (protected)

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job posting (protected)
- `POST /api/jobs/:id/apply` - Apply for job (protected)
- `GET /api/jobs/:jobId/applications` - Get applications (protected)
- `PUT /api/jobs/applications/:applicationId/status` - Update status (protected)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (protected)
- `POST /api/events/:id/register` - Register for event (protected)
- `GET /api/events/:id/attendees` - Get attendees (public)

### Notifications
- `GET /api/notifications` - Get user notifications (protected)
- `GET /api/notifications/count/unread` - Get unread count (protected)
- `PUT /api/notifications/:id/read` - Mark as read (protected)
- `PUT /api/notifications/read-all` - Mark all as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

---

## 📝 Example Queries

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "STUDENT"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response:
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

### Create Mentor Profile (Protected)

```bash
curl -X POST http://localhost:5000/api/mentors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "company": "Tech Corp",
    "skills": ["JavaScript", "React", "Node.js"],
    "availability": "weekends",
    "hourlyRate": 50
  }'
```

### Get All Mentors

```bash
curl http://localhost:5000/api/mentors
```

### Create Job Posting (Protected)

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Frontend Developer",
    "description": "Looking for experienced React developer",
    "company": "Acme Corp",
    "location": "San Francisco, CA",
    "salary": "$120,000 - $150,000",
    "jobType": "FULL_TIME",
    "skills": ["React", "JavaScript", "CSS"],
    "deadline": "2024-12-31"
  }'
```

---

## 🛠️ Prisma Commands

### Generate Client

```bash
npx prisma generate
```

### Run Migrations

```bash
npx prisma migrate dev --name migration_name
```

### Reset Database (⚠️ Deletes all data)

```bash
npx prisma migrate reset
```

### View Database

```bash
npx prisma studio
```

Opens interactive database browser at http://localhost:5555

### View Schema

```bash
npx prisma db push
```

Apply schema changes without creating migration

---

## 🐛 Troubleshooting

### Issue: Connection Refused

**Error:** `Can't reach database server`

**Solution:**
1. Check MySQL is running: `mysql -u root -p`
2. Verify connection string in `.env`
3. Check firewall settings
4. Ensure database exists: `CREATE DATABASE alumnilink;`

### Issue: Migration Failed

**Error:** `Migration error`

**Solution:**
```bash
# Reset and start fresh
npx prisma migrate reset

# Or run specific migration
npx prisma migrate deploy
```

### Issue: JWT Token Invalid

**Error:** `Not authorized to access this route`

**Solution:**
1. Ensure token is in `Authorization: Bearer TOKEN` format
2. Verify JWT_SECRET matches in `.env`
3. Check token expiration: `JWT_EXPIRE=7d`

### Issue: Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Change port in .env
PORT=5001

# Or kill process on port 5000
# On Windows: netstat -ano | findstr :5000
# On Mac/Linux: lsof -i :5000
```

---

## 📊 Data Migration (from MongoDB)

If you have existing MongoDB data, use this approach:

1. **Export MongoDB data:**
   ```bash
   mongoexport --db alumnilink --collection users --out users.json
   ```

2. **Create Node.js migration script:**
   ```javascript
   // scripts/migrate.js
   const fs = require('fs');
   const prisma = require('./backend/src/config/database');
   
   async function migrate() {
     const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
     for (const user of users) {
       await prisma.user.create({
         data: {
           name: user.name,
           email: user.email,
           password: user.password, // Already hashed
           role: user.role || 'STUDENT',
           bio: user.bio,
           // ... map other fields
         }
       });
     }
     console.log('Migration complete!');
   }
   
   migrate().catch(console.error).finally(() => process.exit());
   ```

3. **Run migration:**
   ```bash
   node scripts/migrate.js
   ```

---

## ✅ Testing with Postman

1. **Import collection**: Use the API endpoints listed above
2. **Set environment variables**:
   - `baseUrl`: http://localhost:5000
   - `token`: JWT token from login response

3. **Test flow**:
   - Register → Get token
   - Login → Confirm token
   - Update profile
   - Create mentor profile
   - Create job posting
   - Get all jobs
   - Apply for job
   - Get notifications

---

## 🔒 Security Notes

1. **Password Hashing**: Uses bcryptjs with salt rounds = 10
2. **JWT**: Tokens expire in 7 days (configurable)
3. **Authorization**: Role-based access control on protected routes
4. **Database**: No passwords returned in queries by default
5. **SQL Injection**: Protected via Prisma parameterized queries

---

## 📈 Performance Optimization

1. **Indexes**: All foreign keys and commonly filtered fields are indexed
2. **N+1 Prevention**: Use Prisma's `include` for eager loading
3. **Pagination**: Implement with `.skip()` and `.take()`
4. **Caching**: Consider Redis for frequently accessed data

Example pagination:
```javascript
const users = await prisma.user.findMany({
  skip: 10,
  take: 20,
  include: { mentor: true }
});
```

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Authentication](https://jwt.io/)

---

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review Prisma documentation
3. Check MySQL server logs
4. Verify `.env` configuration

---

**Last Updated**: April 2026
**Database**: MySQL 5.7+
**ORM**: Prisma 5.7+
**Status**: ✅ Production Ready
