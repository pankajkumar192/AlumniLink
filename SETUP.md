# 🎓 AlumniLink - Complete Setup Guide

## Step-by-Step Installation

### 1️⃣ Prerequisites
- Node.js 16+ (https://nodejs.org)
- npm or yarn package manager
- MongoDB Server or MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- Git (optional)

### 2️⃣ Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment
```bash
# Create .env file (already provided)
# Edit backend/.env with your settings:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/alumnilink
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### Start MongoDB
```bash
# If using local MongoDB:
mongod

# Or use MongoDB Atlas (cloud database)
# Update MONGODB_URI with your connection string
```

#### Run Backend
```bash
npm run dev
```

✅ Backend running on: http://localhost:5000

### 3️⃣ Frontend Setup (New Terminal)

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Development Server
```bash
npm run dev
```

✅ Frontend running on: http://localhost:5173

---

## 🧪 Testing the Application

### 1. Access the App
Open your browser and go to: **http://localhost:5173**

### 2. Register a New Account
- Click "Sign up"
- Fill in credentials (Name, Email, Password)
- Select role (Student or Alumni)
- Click "Create Account"

### 3. Login
- Email: Use your registered email
- Password: Use your password
- Click "Sign In"

### 4. Explore Features
- ✅ **Dashboard**: View statistics and quick actions
- ✅ **Find Mentors**: Browse available mentors
- ✅ **Mentorship**: Track mentorship requests
- ✅ **Jobs**: Explore job opportunities
- ✅ **Events**: Register for upcoming events
- ✅ **Profile**: Manage your profile

---

## 📊 API Testing with Postman

### Import Collection
1. Open Postman
2. Create new request
3. Test endpoints:

#### Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@alumni.com",
  "password": "Test@1234",
  "confirmPassword": "Test@1234",
  "role": "student"
}
```

#### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@alumni.com",
  "password": "Test@1234"
}
```

#### Get Current User (Add Bearer Token)
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer {token_from_login_response}
```

#### Get All Mentors
```
GET http://localhost:5000/api/mentors
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Make sure MongoDB is running
- Or update MONGODB_URI to MongoDB Atlas connection string

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
```bash
# Change PORT in .env file or kill process using port
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: 
- Ensure CLIENT_URL in .env is correct
- Restart backend server

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: 
```bash
npm install
npm install express mongoose dotenv bcryptjs jsonwebtoken cors helmet
```

---

## 📁 Important Files

### Backend
- `backend/src/server.js` - Main server entry point
- `backend/src/models/User.js` - User schema
- `backend/src/controllers/authController.js` - Auth logic
- `backend/.env` - Environment variables

### Frontend
- `frontend/src/App.jsx` - Main app component
- `frontend/src/pages/Auth/Login.jsx` - Login page (Premium UI)
- `frontend/src/store/authStore.js` - State management
- `frontend/src/utils/api.js` - API client
- `frontend/tailwind.config.js` - Tailwind configuration

---

## 🎯 Features Walkthrough

### 1. Authentication Pages
- ✅ Beautiful glassmorphism design
- ✅ Smooth animations and transitions
- ✅ Password strength indicator
- ✅ Social login buttons
- ✅ Form validation with error messages
- ✅ Loading states

### 2. Dashboard
- ✅ Welcome message
- ✅ Statistics cards
- ✅ Quick action buttons
- ✅ Recent activities feed

### 3. Find Mentors
- ✅ Mentor cards with ratings
- ✅ Skill tags
- ✅ Search functionality
- ✅ Request mentorship

### 4. Mentorship Requests
- ✅ Track request status
- ✅ View mentor responses
- ✅ Schedule meetings
- ✅ Status indicators

### 5. Job Board
- ✅ Browse job listings
- ✅ Filter by type
- ✅ View detailed descriptions
- ✅ Apply directly

### 6. Events
- ✅ Upcoming events list
- ✅ Event details and location
- ✅ Attendee count
- ✅ Event registration

### 7. Profile
- ✅ View/edit profile information
- ✅ Update skills and interests
- ✅ Manage mentor status
- ✅ Logout

---

## 🚀 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy to Vercel/Netlify
```bash
# Vercel
vercel

# Netlify
netlify deploy --prod --dir=dist
```

### Deploy Backend to Heroku
```bash
heroku login
heroku create alumnilink-api
git push heroku main
```

---

## 📝 Development Notes

### Code Style
- Use ES6+ syntax
- Follow component naming conventions
- Use Tailwind classes for styling
- Keep components modular and reusable

### Git Workflow
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

### Performance Tips
- Use React lazy loading for pages
- Optimize images
- Implement pagination for lists
- Cache API responses

---

## 🔒 Security Checklist

Before production:
- [ ] Change JWT_SECRET in .env
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Add input sanitization
- [ ] Enable database backups
- [ ] Set secure CORS origins
- [ ] Update all dependencies
- [ ] Review security headers

---

## 📚 Useful Links

- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Express.js**: https://expressjs.com
- **MongoDB**: https://docs.mongodb.com
- **Framer Motion**: https://www.framer.com/motion
- **Vite**: https://vitejs.dev

---

## 💬 Need Help?

1. Check the README.md for feature overview
2. Review API endpoints documentation
3. Check console for error messages
4. Verify environment variables are set correctly
5. Ensure backend and MongoDB are running

---

## 🎉 You're All Set!

Congratulations! AlumniLink is now running. Start building connections and creating value for your alumni community.

**Happy coding!** 🚀
