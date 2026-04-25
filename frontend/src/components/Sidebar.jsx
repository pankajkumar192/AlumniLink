import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, Users, MessageSquare, Briefcase, Calendar, User, LogOut, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Mentors", path: "/mentors" },
    { icon: MessageSquare, label: "Mentorship", path: "/mentorship-requests" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: Globe, label: "Community", path: "/community" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const isActive = (path) => location.pathname === path;

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -280, opacity: 0 },
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        className={`fixed left-0 top-0 h-screen w-72 z-40 lg:sticky lg:z-10 lg:block flex flex-col p-4 lg:p-6 transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      >
        <div className="glass-card flex-1 flex flex-col overflow-hidden border border-white/10 shadow-premium relative">
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[1.5rem]" />
          
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AlumniLink
            </h1>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white transition bg-white/5 p-2 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-white/5 bg-white/[0.02] relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={user?.avatar || "https://i.pravatar.cc/150?img=1"} alt={user?.name} className="w-12 h-12 rounded-full border-2 border-white/10 object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-dark" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate text-white">{user?.name}</p>
                <p className="text-gray-400 text-xs capitalize truncate">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto relative z-10">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={i} to={item.path} onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }} className="block relative">
                  <motion.div
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative z-10 ${
                      active ? "text-white" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <Icon className={`w-5 h-5 ${active ? "text-blue-400" : ""}`} />
                    <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                  </motion.div>
                  {active && (
                    <motion.div
                      layoutId="activeSidebarPill"
                      className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-xl z-0 shadow-glow-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/5 relative z-10 bg-white/[0.02]">
            <motion.button
              onClick={() => { logout(); window.location.href = "/login"; }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-semibold border border-transparent hover:border-red-500/20 shadow-sm"
              whileHover={{ x: 4 }}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
