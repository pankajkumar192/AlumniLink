import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutDashboard, Users, MessageSquare, Briefcase, Calendar, User, LogOut, Globe, Activity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Mentors", path: "/mentors" },
    { icon: MessageSquare, label: "Mentorship", path: "/mentorship-requests" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: Globe, label: "Community", path: "/community" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
  ];

  const bottomNavItems = [
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={`fixed left-0 top-0 h-screen w-72 z-40 lg:sticky lg:z-10 lg:block flex flex-col bg-[#080b12]/95 backdrop-blur-xl border-r border-white/[0.04] transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        initial={false}
      >
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Subtle ambient glow */}
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-500/[0.03] to-transparent pointer-events-none" />

          {/* Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-white/[0.04] shrink-0 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f8cff] to-[#8b5cf6] flex items-center justify-center shadow-[0_0_20px_rgba(79,140,255,0.3)]">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                Alumni<span className="text-[#4f8cff]">Link</span>
              </h1>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-0.5 overflow-y-auto custom-scrollbar relative z-10">
            <div className="px-3 mb-3">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-600">Overview</p>
            </div>
            
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={i} to={item.path} onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }} className="block">
                  <motion.div
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      active 
                        ? "active bg-[#4f8cff]/[0.08] text-[#4f8cff] shadow-[inset_0_0_20px_rgba(79,140,255,0.05)]" 
                        : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-colors ${active ? "text-[#4f8cff] drop-shadow-[0_0_6px_rgba(79,140,255,0.4)]" : ""}`} />
                    <span className={`text-sm ${active ? "font-semibold" : "font-medium"}`}>{item.label}</span>
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4f8cff] shadow-[0_0_8px_rgba(79,140,255,0.5)]"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}

            <div className="px-3 mt-8 mb-3">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-600">Settings</p>
            </div>

            {bottomNavItems.map((item, i) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={i} to={item.path} onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }} className="block">
                  <motion.div
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      active 
                        ? "active bg-[#4f8cff]/[0.08] text-[#4f8cff]" 
                        : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] ${active ? "text-[#4f8cff]" : ""}`} />
                    <span className={`text-[13px] ${active ? "font-semibold" : "font-medium"}`}>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-3 border-t border-white/[0.04] bg-[#080b12]/80 shrink-0 relative z-10">
            {/* Mini user card */}
            <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="relative">
                <img 
                  src={user?.avatar || "https://i.pravatar.cc/150"} 
                  alt="User" 
                  className="w-8 h-8 rounded-lg object-cover border border-white/10" 
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#080b12] pulse-dot" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { logout(); window.location.href = "/login"; }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/[0.06] rounded-xl transition-all font-medium text-sm"
            >
              <LogOut className="w-[18px] h-[18px]" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
