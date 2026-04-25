import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, Settings, CheckCircle2 } from "lucide-react";
import useAuthStore from "../store/authStore";
import { notificationAPI } from "../utils/api";

import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const user = useAuthStore((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationAPI.getNotifications();
      setNotifications(data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <motion.nav
      className="glass-card px-6 py-4 flex items-center justify-between sticky top-4 z-50 mx-4 lg:mx-8 mb-6 border border-white/5 shadow-premium"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
    >
      <div className="flex items-center gap-4">
        <motion.button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-5 h-5 text-gray-300" />
        </motion.button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            className="p-2.5 hover:bg-white/10 rounded-xl transition-all relative group border border-transparent hover:border-white/10"
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className={`w-5 h-5 transition-colors ${unreadCount > 0 ? "text-blue-400" : "text-gray-400 group-hover:text-white"}`} />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75" />
              </>
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-[320px] sm:w-[400px] glass-card border border-white/10 rounded-2xl overflow-hidden shadow-premium-hover z-50"
              >
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] backdrop-blur-3xl">
                  <h3 className="font-bold text-gray-200">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar bg-black/20">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center gap-3 text-gray-500">
                      <Bell className="w-10 h-10 opacity-20" />
                      <span className="text-sm">You're all caught up.</span>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-white/5 flex gap-4 hover:bg-white/5 transition-colors group ${
                          !notification.read ? "bg-blue-500/[0.03]" : ""
                        }`}
                      >
                        <div className="shrink-0 mt-1">
                          {notification.type === "job_application" && <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />}
                          {notification.type === "event_registration" && <div className="w-2.5 h-2.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]" />}
                          {notification.type === "mentorship_request" && <div className="w-2.5 h-2.5 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,0.5)]" />}
                          {notification.type === "system" && <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed ${!notification.read ? "text-gray-200 font-medium" : "text-gray-400"}`}>
                            {notification.message}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1.5 uppercase tracking-wide font-medium">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="shrink-0 text-gray-500 hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                            title="Mark as read"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <motion.button
          onClick={() => navigate('/profile')}
          className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-5 h-5 text-gray-400 hover:text-white transition" />
        </motion.button>

        {/* Avatar */}
        <motion.div
          onClick={() => navigate('/profile')}
          className="ml-2 w-10 h-10 rounded-full p-0.5 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 cursor-pointer shadow-glow-primary hover:shadow-glow-secondary transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={user?.avatar || "https://i.pravatar.cc/150?img=1"}
            alt={user?.name}
            className="w-full h-full rounded-full object-cover border-2 border-dark"
          />
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
