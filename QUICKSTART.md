# 🚀 AlumniLink - Quick Start Guide

## ⚡ 60-Second Setup

### Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```
✅ Backend ready at `http://localhost:5000`

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend ready at `http://localhost:5173`

---

## 🎯 First Time User

1. **Open** http://localhost:5173
2. **Click** "Sign up"
3. **Fill in:**
   - Name: `John Doe`
   - Email: `john@alumni.com`
   - Password: `Test@1234`
   - Role: `Student`
4. **Click** "Create Account"
5. 🎉 **You're in!**

---

## 📋 Checklist Before Running

- [ ] Node.js 16+ installed
- [ ] MongoDB running or MongoDB Atlas URL ready
- [ ] Both terminals open
- [ ] Backend .env file configured
- [ ] No ports 5000 or 5173 in use

---

## 🎨 Tour the App

- **Dashboard**: Overview and quick actions
- **Find Mentors**: Browse and connect with alumni
- **Mentorship**: Track your mentorship journey
- **Jobs**: Discover career opportunities
- **Events**: Register for networking events
- **Profile**: Customize your profile

---

## 🔧 Useful Commands

### Backend
```bash
# Start development server
npm run dev

# Start production server
npm start
```

### Frontend
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB error | Ensure MongoDB is running or update MONGODB_URI |
| Port in use | Change PORT in .env or kill process using port |
| Dependencies missing | Run `npm install` in the directory |
| CORS error | Check CLIENT_URL in backend .env |

---

## 📚 Full Documentation

- **Setup Guide**: See [SETUP.md](SETUP.md)
- **API Docs**: See [API_DOCS.md](API_DOCS.md)
- **README**: See [README.md](README.md)

---

## 💡 Tips

- **Hot reload**: Both frontend and backend have hot reload enabled
- **Database**: MongoDB should be running before starting backend
- **JWT**: Tokens expire in 7 days by default
- **Dark mode**: Enabled by default, no toggle needed (yet!)

---

## 🎓 What's Included

✅ Beautiful authentication pages with glassmorphism
✅ Complete mentorship system
✅ Job board with filtering
✅ Event management
✅ User profiles
✅ Responsive design
✅ Smooth animations
✅ Dark theme
✅ Protected routes
✅ JWT authentication

---

## 🚀 Ready?

Let's build something amazing! 🎉

```bash
npm run dev
```

