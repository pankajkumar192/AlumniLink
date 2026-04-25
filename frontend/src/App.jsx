import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "./store/authStore";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import FindMentors from "./pages/FindMentors";
import MentorshipRequests from "./pages/MentorshipRequests";
import JobPostings from "./pages/JobPostings";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Community from "./pages/Community";
import LandingPage from "./pages/LandingPage";

// Components
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// Styles
import "./styles/index.css";
import "./styles/landing.css";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main Layout
const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(window.innerWidth >= 1024);

  // Handle resize to auto-open/close sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex bg-dark text-white min-h-screen relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 bg-noise pointer-events-none z-0" />
      <div className="animated-blob w-[600px] h-[600px] bg-blue-500/20 top-[-200px] left-[-200px] animate-blob z-0" />
      <div className="animated-blob w-[500px] h-[500px] bg-purple-500/20 bottom-[-100px] right-[-100px] animate-blob animation-delay-2000 z-0" />
      <div className="animated-blob w-[400px] h-[400px] bg-emerald-500/10 top-[40%] left-[60%] animate-blob animation-delay-4000 z-0" />

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <motion.main
          className="flex-1 overflow-auto p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </motion.main>
      </div>
    </div>
  );
};

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const getMe = useAuthStore((state) => state.getMe);

  useEffect(() => {
    if (isAuthenticated) {
      getMe();
    }
  }, [isAuthenticated, getMe]);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentors"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FindMentors />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentorship-requests"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MentorshipRequests />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <MainLayout>
                <JobPostings />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Events />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Community />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Community />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Messages />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect */}
        {/* Landing + Redirect */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
