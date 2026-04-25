# 🎓 AlumniLink - Alumni Management & Engagement System

A premium, production-ready full-stack web application connecting students with alumni for mentorship, networking, jobs, and events.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech](https://img.shields.io/badge/tech-React%20%2B%20Express%20%2B%20MongoDB-brightgreen)

---

## ✨ Features

- **🔐 Premium Authentication** - Gorgeous login/signup with glassmorphism design
- **👥 Find Mentors** - Browse experienced alumni and request mentorship
- **📧 Mentorship System** - Manage mentorship requests and connections
- **💼 Job Board** - Post and discover job opportunities
- **🎉 Events** - Attend alumni networking events and seminars
- **👤 User Profiles** - Complete profile management and customization
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🎨 Apple-Level UI** - Glassmorphism, animations, and micro-interactions
- **🌙 Dark Mode** - Beautiful dark theme by default

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **React Router DOM** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Sonner** - Toast notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **Helmet** - Security headers

---

## 📁 Project Structure

```
AlumniLink/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── mentorController.js
│   │   │   └── mentorshipController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── MentorshipRequest.js
│   │   │   ├── JobPosting.js
│   │   │   └── Event.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── mentorRoutes.js
│   │   │   └── mentorshipRoutes.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── config/
│   │   │   └── database.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FindMentors.jsx
│   │   │   ├── MentorshipRequests.jsx
│   │   │   ├── JobPostings.jsx
│   │   │   ├── Events.jsx
│   │   │   └── Profile.jsx
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navbar.jsx
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or cloud instance)

### Backend Setup

1. **Clone and navigate to backend**
```bash
cd backend
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

3. **Update `.env`** with your MongoDB URI and other configs:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alumnilink
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. **Start the backend**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Open new terminal and navigate to frontend**
```bash
cd frontend
npm install
```

2. **Start the development server**
```bash
npm run dev
```

App will open at `http://localhost:5173`

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Mentors
- `GET /api/mentors` - Get all mentors
- `GET /api/mentors/:id` - Get mentor details
- `PUT /api/mentors/profile` - Update mentor profile

### Mentorship
- `POST /api/mentorship` - Create mentorship request
- `GET /api/mentorship` - Get mentorship requests
- `PUT /api/mentorship/:id` - Update request status

---

## 🎨 Design System

### Colors
- **Background**: `#0a0a0a` (Dark)
- **Primary**: `#3b82f6` (Blue)
- **Accent**: `#10b981` (Emerald)
- **Glass**: `rgba(255, 255, 255, 0.06)` with backdrop blur

### Typography
- **Font**: Inter / SF Pro
- **Headings**: Bold weights
- **Body**: Regular weights

### Components
- **Glass Cards**: Glassmorphism effect with blur
- **Smooth Shadows**: Subtle, layered shadows
- **Rounded Corners**: `rounded-2xl` by default
- **Animations**: Framer Motion for smooth transitions
- **Micro-interactions**: Hover, focus, click effects

---

## 💾 Sample Data

Default test credentials:
```
Email: test@alumni.com
Password: Test@1234
```

The app includes sample data for:
- Mentors with profiles and ratings
- Job postings from various companies
- Upcoming networking events
- Mentorship requests with different statuses

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Protected API routes
- ✅ Input validation
- ✅ XSS prevention

---

## 📱 Responsive Design

The application is fully responsive:
- **Desktop**: Full sidebar + main content
- **Tablet**: Collapsible sidebar
- **Mobile**: Slide-out navigation menu

---

## 🎯 Usage Examples

### Login
1. Visit `http://localhost:5173/login`
2. Enter email and password
3. Click "Sign In" or use social login

### Find a Mentor
1. Go to "Find Mentors" page
2. Browse available mentors
3. Click "Request Mentorship"
4. Fill in mentorship details

### Post a Job
1. Navigate to "Jobs" section
2. Click "Post Job"
3. Fill in job details and requirements
4. Publish to job board

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎓 Built with Excellence

AlumniLink is built with Apple-level polish and attention to detail. Every interaction has been carefully crafted for maximum user delight.

**Made with ❤️ for the alumni community**

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API endpoints

---

## 🚀 Next Steps

1. Install dependencies for both frontend and backend
2. Configure MongoDB connection
3. Set up environment variables
4. Run both servers
5. Access at `http://localhost:5173`

Happy coding! 🎉
