import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Activity, Users, MoreHorizontal, Clock, Wifi } from "lucide-react";
import { notificationAPI } from "../../utils/api";
import useAuthStore from "../../store/authStore";

// Relative time formatter
const timeAgo = (date) => {
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now - d) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NOTIFICATION_AVATARS = [
  "https://i.pravatar.cc/150?u=101",
  "https://i.pravatar.cc/150?u=102",
  "https://i.pravatar.cc/150?u=103",
  "https://i.pravatar.cc/150?u=104",
  "https://i.pravatar.cc/150?u=105",
];

const RightPanel = () => {
  const user = useAuthStore((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [onlineCount] = useState(Math.floor(Math.random() * 15) + 8);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (user) {
          const { data } = await notificationAPI.getNotifications();
          setNotifications(data.data?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error("Error fetching right panel notifications", error);
      }
    };
    fetchNotifications();
  }, [user]);

  const mockActivities = [
    { id: 1, user: "Sneha Joshi", avatar: "https://i.pravatar.cc/150?u=30", text: "posted a new job: Senior React Developer", time: new Date(Date.now() - 2 * 60 * 60 * 1000), color: "bg-blue-500" },
    { id: 2, user: "Rahul Sharma", avatar: "https://i.pravatar.cc/150?u=31", text: "accepted a mentorship request", time: new Date(Date.now() - 4 * 60 * 60 * 1000), color: "bg-emerald-500" },
    { id: 3, user: "Priya Verma", avatar: "https://i.pravatar.cc/150?u=32", text: "registered for: Tech Talk on System Design", time: new Date(Date.now() - 5 * 60 * 60 * 1000), color: "bg-purple-500" },
    { id: 4, user: "Arjun Patel", avatar: "https://i.pravatar.cc/150?u=33", text: "commented on your post in Community", time: new Date(Date.now() - 8 * 60 * 60 * 1000), color: "bg-amber-500" },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <aside className="w-[340px] h-screen hidden xl:flex flex-col border-l border-white/[0.04] bg-[#080b12]/95 backdrop-blur-xl overflow-y-auto custom-scrollbar sticky top-0 right-0 z-10">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-full h-40 bg-gradient-to-b from-purple-500/[0.02] to-transparent pointer-events-none" />

      <div className="p-6 relative z-10 flex-1 flex flex-col">
        {/* Profile Mini View */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="User" className="w-11 h-11 rounded-xl object-cover border border-white/10" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#080b12] pulse-dot" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-200 leading-tight">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
          <button className="text-gray-600 hover:text-white transition p-1.5 hover:bg-white/[0.03] rounded-lg">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Online Users Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/[0.1]"
        >
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-sm text-emerald-400/80 font-medium">{onlineCount} users online</span>
          </div>
          <Wifi className="w-3.5 h-3.5 text-emerald-400/50" />
        </motion.div>

        {/* Notifications Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2.5">
              <Bell className="w-4 h-4" /> Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="bg-[#4f8cff]/15 text-[#4f8cff] text-xs px-3 py-0.5 rounded-full font-bold border border-[#4f8cff]/20">
                {unreadCount} NEW
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-600 italic px-1">No new notifications.</p>
            ) : (
              notifications.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={`p-3 rounded-xl border transition-all cursor-default group ${
                    !notif.read 
                      ? "bg-[#4f8cff]/[0.04] border-[#4f8cff]/[0.08] hover:bg-[#4f8cff]/[0.06]" 
                      : "bg-white/[0.01] border-white/[0.03] hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={NOTIFICATION_AVATARS[i % NOTIFICATION_AVATARS.length]}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-100 transition line-clamp-2">{notif.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3.5 h-3.5 text-gray-600" />
                        <p className="text-xs text-gray-600 font-medium">{timeAgo(notif.createdAt)}</p>
                      </div>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-[#4f8cff] shadow-[0_0_6px_rgba(79,140,255,0.4)] shrink-0 mt-1" />
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="flex-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2.5 mb-5">
            <Activity className="w-4 h-4" /> Recent Activity
          </h3>
          
          <div className="relative pl-5 space-y-5 border-l border-white/[0.04] ml-2">
            {mockActivities.map((act, i) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="relative group"
              >
                <span className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full ${act.color} ring-4 ring-[#080b12] shadow-[0_0_6px_${act.color === 'bg-blue-500' ? 'rgba(79,140,255,0.4)' : 'rgba(0,0,0,0.3)'}]`} />
                <div className="flex items-start gap-3">
                  <img src={act.avatar} alt={act.user} className="w-7 h-7 rounded-lg object-cover border border-white/10 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      <span className="text-gray-100 font-semibold">{act.user}</span>{" "}
                      {act.text}
                    </p>
                    <p className="text-xs text-gray-600 mt-1.5 font-medium">{timeAgo(act.time)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pro Card */}
        <div className="mt-6 pt-4">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#4f8cff]/[0.08] to-[#8b5cf6]/[0.05] border border-[#4f8cff]/[0.12] text-center relative overflow-hidden cursor-default"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4f8cff]/30 to-transparent" />
            <p className="text-sm font-bold text-[#4f8cff] mb-1.5">AlumniLink Pro</p>
            <p className="text-xs text-gray-400 leading-relaxed">Unlock advanced analytics and priority mentorship matching.</p>
          </motion.div>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
