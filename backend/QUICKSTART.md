# 🚀 AlumniLink Backend - Quick Start Guide

## MongoDB → MySQL Migration Complete ✅

Your AlumniLink backend has been successfully refactored from MongoDB to MySQL using Prisma ORM.

---

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database
Edit `.env` with your MySQL credentials:
```env
DATABASE_URL="mysql://root:password@localhost:3306/alumnilink"
```

### 3. Run Prisma Migration
```bash
npx prisma migrate dev --name init
```

### 4. Start Server
```bash
npm run dev    # Development with auto-reload
# OR
npm start      # Production
```

✅ Server running on `http://localhost:5000`

---

## 📋 What Changed

### Technology Stack
| Component | Before | After |
|-----------|--------|-------|
| Database | MongoDB | MySQL |
| ORM | Mongoose | Prisma |
| Driver | MongoDB client | MySQL2 |
| Schema | Flexible | Relational |

### Code Structure
- ✅ **Services Layer**: New business logic layer (see `src/services/`)
- ✅ **Database Config**: Updated to use Prisma
- ✅ **Controllers**: Refactored to use services
- ✅ **Middleware**: Updated for Prisma
- ✅ **Models**: Removed Mongoose, added Prisma schema

### File Organization
```
backend/
├── src/
│   ├── services/          ← NEW: Business logic
│   ├── controllers/       ← Updated for Prisma
│   ├── routes/           ← API endpoints (unchanged)
│   ├── middleware/       ← Updated for Prisma
│   └── config/          ← Updated for MySQL
├── prisma/
│   └── schema.prisma     ← NEW: Database schema
├── scripts/
│   └── migrate-from-mongo.js  ← NEW: Migration helper
├── PRISMA_SETUP.md       ← Detailed setup guide
├── SAMPLE_QUERIES.md     ← API examples
└── ROUTES_REFERENCE.md   ← Complete API docs
```

---

## 🔑 Key Features

### ✨ What's New

1. **Prisma ORM**
   - Type-safe database queries
   - Auto-generated types
   - Built-in migrations
   - Visual database explorer

2. **Relational Design**
   - Proper foreign keys
   - Normalized schema
   - Optimized indexes
   - Join queries

3. **Services Layer**
   - Clean code separation
   - Reusable business logic
   - Easier testing
   - Better maintainability

### 🎯 Database Schema

**8 Main Tables:**
1. `users` - User accounts
2. `mentors` - Mentor profiles (optional, links to users)
3. `mentorship_requests` - Mentorship connections
4. `job_postings` - Job listings
5. `job_applications` - Job applications
6. `events` - Events and workshops
7. `event_attendees` - Event registrations
8. `notifications` - User notifications

---

## 🧪 Test It Quickly

### Create a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Test123!",
    "confirmPassword": "Test123!",
    "role": "STUDENT"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test123!"
  }'
```

### Get All Mentors
```bash
curl http://localhost:5000/api/mentors
```

✅ All API endpoints in `SAMPLE_QUERIES.md`

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `PRISMA_SETUP.md` | Complete setup & migration guide |
| `SAMPLE_QUERIES.md` | API query examples |
| `ROUTES_REFERENCE.md` | All endpoints & models |
| `prisma/schema.prisma` | Database schema definition |

---

## 🐛 Troubleshooting

### MySQL Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify .env DATABASE_URL is correct
# Format: mysql://username:password@host:port/database
```

### Migration Failed
```bash
# Reset database (⚠️ deletes data)
npx prisma migrate reset

# Or run migrations
npx prisma migrate deploy
```

### Prisma Studio (Visual Explorer)
```bash
npx prisma studio
# Opens at http://localhost:5555
```

---

## 📝 Common Tasks

### View Database Schema
```bash
npx prisma studio
```

### Create New Migration
```bash
# After editing schema.prisma
npx prisma migrate dev --name name_of_migration
```

### Check Migration Status
```bash
npx prisma migrate status
```

### Generate Types
```bash
npx prisma generate
```

---

## 🔐 Environment Variables

```env
PORT=5000
DATABASE_URL="mysql://user:pass@host:3306/db"
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 📱 Frontend Integration

Frontend remains unchanged! All endpoints work the same way:

```javascript
// Before (MongoDB) → After (MySQL) - Identical API
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/mentors', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## 🚀 Production Deployment

### Before Deploying

1. **Verify `.env`**
   ```env
   NODE_ENV=production
   DATABASE_URL=mysql://prod_user:secure_pass@prod_host/alumnilink
   JWT_SECRET=very_secure_secret_key_change_this
   ```

2. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```

3. **Build**
   ```bash
   npm run build  # If applicable
   ```

4. **Test**
   ```bash
   npm start
   ```

### Deploy to:
- **Heroku**: `git push heroku main`
- **AWS**: Elastic Beanstalk / EC2
- **DigitalOcean**: App Platform / Droplet
- **Railway**: Git integration
- **Render**: Git integration

---

## 📊 Performance Tips

1. **Indexing**: All foreign keys are indexed
2. **Eager Loading**: Use `.include()` in Prisma
3. **Pagination**: Implement with `.skip()` and `.take()`
4. **Caching**: Consider Redis for frequent queries

Example:
```javascript
const users = await prisma.user.findMany({
  skip: 10,
  take: 20,
  include: { mentor: true, jobPostings: true }
});
```

---

## 🔗 Useful Links

- [Prisma Documentation](https://www.prisma.io/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Info](https://jwt.io/)

---

## ✅ Checklist

- [ ] Install dependencies: `npm install`
- [ ] Configure `.env` with MySQL credentials
- [ ] Create MySQL database: `CREATE DATABASE alumnilink;`
- [ ] Run migrations: `npx prisma migrate dev --name init`
- [ ] Start server: `npm run dev`
- [ ] Test API endpoints with cURL or Postman
- [ ] Verify frontend still works
- [ ] Review `PRISMA_SETUP.md` for detailed info

---

## 🎉 You're Done!

Your backend is now running on MySQL with Prisma. The API remains unchanged, so your frontend works without modification.

**Need help?** Check the documentation files:
- 📖 `PRISMA_SETUP.md` - Detailed guide
- 🔗 `ROUTES_REFERENCE.md` - All endpoints
- 🧪 `SAMPLE_QUERIES.md` - Test queries

---

**Happy Coding! 🚀**

*Last Updated: April 2026*
