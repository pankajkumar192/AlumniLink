import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Command, X, LayoutDashboard, Users, Briefcase, Calendar, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const quickActions = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Find Mentors", path: "/mentors" },
  { icon: Briefcase, label: "Job Postings", path: "/jobs" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: Globe, label: "Community", path: "/community" },
];

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ⌘K shortcut
  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsSearchOpen(true);
    }
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const filteredActions = quickActions.filter(a =>
    a.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <nav className="h-[72px] px-6 lg:px-8 flex items-center justify-between border-b border-white/[0.04] bg-[#080b12]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-4 flex-1">
          <motion.button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </motion.button>

          {/* Search Bar */}
          <motion.button
            onClick={() => setIsSearchOpen(true)}
            whileHover={{ scale: 1.01 }}
            className="hidden sm:flex items-center gap-3 px-5 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-500 w-80 hover:border-white/[0.08] hover:bg-white/[0.03] transition-all group"
          >
            <Search className="w-5 h-5 group-hover:text-gray-400 transition-colors" />
            <span className="text-base font-medium flex-1 text-left">Search everything...</span>
            <div className="flex items-center gap-1.5 bg-white/[0.05] px-2.5 py-1 rounded-md text-xs font-semibold tracking-widest text-gray-500 border border-white/[0.04]">
              <Command className="w-3.5 h-3.5" /> K
            </div>
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/[0.06] border border-emerald-500/[0.12]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Live</span>
          </div>

          {/* Profile shortcut for mobile */}
          <motion.button
            onClick={() => navigate('/profile')}
            className="xl:hidden p-1.5 hover:bg-white/5 rounded-xl transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src={user?.avatar || "https://i.pravatar.cc/150"} 
              alt="User" 
              className="w-8 h-8 rounded-xl object-cover border border-white/10" 
            />
          </motion.button>
        </div>
      </nav>

      {/* Command Palette (⌘K) */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
            />
            <motion.div
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-[#0f1520]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
                  <Search className="w-5 h-5 text-gray-500 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type a command or search..."
                    className="bg-transparent border-none outline-none text-sm w-full text-gray-200 placeholder-gray-600 font-medium"
                    autoFocus
                  />
                  <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="text-gray-500 hover:text-white transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-3 py-2">Quick Actions</p>
                  {filteredActions.map((action, i) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        onClick={() => {
                          navigate(action.path);
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:border-[#4f8cff]/20 transition-colors">
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#4f8cff] transition-colors" />
                        </div>
                        <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">{action.label}</span>
                      </motion.button>
                    );
                  })}
                  {filteredActions.length === 0 && (
                    <p className="text-xs text-gray-600 text-center py-6">No results found</p>
                  )}
                </div>

                {/* Footer hint */}
                <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between">
                  <span className="text-[10px] text-gray-600 font-medium">Navigate with ↑↓ • Select with ↵</span>
                  <span className="text-[10px] text-gray-600 font-medium">ESC to close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
