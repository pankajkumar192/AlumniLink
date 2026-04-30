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
import OAuthOnboarding from "./pages/OAuthOnboarding";

// Components
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import RightPanel from "./components/layout/RightPanel";

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

// Main Layout (3-Column SaaS Architecture)
const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(window.innerWidth >= 1024);

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
    <div className="flex bg-[#080b12] text-gray-200 min-h-screen w-full overflow-hidden font-sans">
      {/* Left Column: Navigation */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Center Column: Main Application Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative">
          {/* Subtle top gradient for depth */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#4f8cff]/[0.02] to-transparent pointer-events-none" />
          
          <motion.div
            className="max-w-6xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Right Column: Activity & Notifications */}
      <RightPanel />
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

        {/* OAuth Onboarding */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OAuthOnboarding />
            </ProtectedRoute>
          }
        />

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

        {/* Landing + Redirect */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
