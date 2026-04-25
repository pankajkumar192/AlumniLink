import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, XCircle, Loader2, MessageSquare, Users, MessageCircle, Calendar, X } from "lucide-react";
import { mentorshipAPI, chatAPI, meetingAPI } from "../utils/api";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import { useNavigate } from "react-router-dom";

const MentorshipRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);

  // Scheduling State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [activeMentorId, setActiveMentorId] = useState(null);
  const [scheduleData, setScheduleData] = useState({ title: "", date: "", duration: 30 });
  const [isScheduling, setIsScheduling] = useState(false);

  const currentUser = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const setActiveConversation = useChatStore((state) => state.setActiveConversation);

  const fetchRequests = async () => {
    try {
      const { data } = await mentorshipAPI.getRequests();
      setRequests(data.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setStatusUpdating(id);
      await mentorshipAPI.updateRequest(id, { status });
      await fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || "Error updating status");
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleMessageClick = async (otherUserId) => {
    try {
      const { data } = await chatAPI.createConversation(otherUserId);
      setActiveConversation(data.data);
      navigate("/messages");
    } catch (error) {
      console.error("Error creating/navigating to conversation:", error);
    }
  };

  const handleScheduleSession = async (e) => {
    e.preventDefault();
    setIsScheduling(true);
    try {
      await meetingAPI.createMeeting({
        mentorId: activeMentorId,
        title: scheduleData.title,
        date: scheduleData.date,
        duration: scheduleData.duration,
      });
      setShowScheduleModal(false);
      alert("Session scheduled successfully! Calendar invite sent.");
      setScheduleData({ title: "", date: "", duration: 30 });
    } catch (error) {
      console.error("Error scheduling session:", error);
      alert("Failed to schedule session");
    } finally {
      setIsScheduling(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      accepted: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      pending: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
      rejected: "bg-red-500/10 border-red-500/30 text-red-400",
      completed: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    };
    return map[status] || "bg-gray-500/10 border-gray-500/30 text-gray-400";
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div className="space-y-10" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="glass-card p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Mentorship</span>
            </h1>
            <p className="text-gray-400 text-lg">Manage your mentorship connections and requests.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm font-semibold text-gray-300 shrink-0">
            <Users className="w-5 h-5 text-purple-400" />
            {requests.length} {requests.length === 1 ? "Request" : "Requests"}
          </div>
        </div>
      </motion.div>

      {/* Requests List */}
      <motion.div className="space-y-4" variants={containerVariants}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
            <p className="text-gray-500 text-sm">Loading your requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="glass-card p-20 text-center flex flex-col items-center gap-4 border border-white/5">
            <MessageSquare className="w-14 h-14 text-gray-500 opacity-20" />
            <h3 className="text-xl font-bold text-gray-300">No Requests Yet</h3>
            <p className="text-gray-500">Go to Find Mentors to send your first request.</p>
          </div>
        ) : requests.map((request) => {
          const userId = currentUser?.id;
          const isStudent = userId === request.studentId;
          const isMentor = userId === request.mentor?.userId;
          const otherPerson = isStudent ? request.mentor?.user : request.student;

          return (
            <motion.div
              key={request.id}
              className="glass-card p-7 border border-white/5 hover:border-purple-500/25 transition-all duration-500 group relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -3 }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-5">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={otherPerson?.avatar || `https://i.pravatar.cc/150?u=${otherPerson?.id}`}
                      alt={otherPerson?.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 group-hover:border-purple-500/30 transition-colors"
                    />
                    {request.status?.toLowerCase() === "accepted" && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-dark shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                      {otherPerson?.name || "Unknown User"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {isStudent ? "You requested mentorship" : "Requested your mentorship"}
                      <span className="mx-2 text-gray-600">·</span>
                      {new Date(request.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isMentor && request.status?.toLowerCase() === "pending" ? (
                    <>
                      <motion.button
                        onClick={() => handleUpdateStatus(request.id, "accepted")}
                        disabled={statusUpdating === request.id}
                        className="flex items-center gap-2 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 px-5 py-2.5 rounded-xl text-sm font-bold transition border border-emerald-500/30 hover:border-emerald-500/50"
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      >
                        {statusUpdating === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Accept
                      </motion.button>
                      <motion.button
                        onClick={() => handleUpdateStatus(request.id, "rejected")}
                        disabled={statusUpdating === request.id}
                        className="flex items-center gap-2 bg-red-500/15 text-red-400 hover:bg-red-500/30 px-5 py-2.5 rounded-xl text-sm font-bold transition border border-red-500/30 hover:border-red-500/50"
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      >
                        {statusUpdating === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Decline
                      </motion.button>
                    </>
                  ) : (
                    <span className={`px-5 py-2 rounded-full text-sm font-bold border capitalize ${getStatusBadge(request.status?.toLowerCase())}`}>
                      {request.status?.toLowerCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Message Card */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 group-hover:border-white/10 transition-colors">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">{request.subject}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{request.message}</p>
              </div>

              {request.status?.toLowerCase() === "accepted" && (
                <div className="mt-4 flex gap-3">
                  <motion.button
                    onClick={() => { setActiveMentorId(request.mentor.id); setShowScheduleModal(true); }}
                    className="px-5 py-2.5 bg-blue-500/15 text-blue-400 rounded-xl hover:bg-blue-500/25 transition-all text-sm font-bold border border-blue-500/25 flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Clock className="w-4 h-4" />
                    Schedule Session
                  </motion.button>
                  <motion.button
                    onClick={() => handleMessageClick(otherPerson.id)}
                    className="px-5 py-2.5 bg-purple-500/15 text-purple-400 rounded-xl hover:bg-purple-500/25 transition-all text-sm font-bold border border-purple-500/25 flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </motion.button>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-md bg-[#0f172a] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Schedule Session</h3>
                    <p className="text-xs text-gray-400">Book a 1-on-1 meeting</p>
                  </div>
                </div>
                <button onClick={() => setShowScheduleModal(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form id="schedule-form" onSubmit={handleScheduleSession} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Topic / Title</label>
                  <input required type="text" value={scheduleData.title} onChange={(e) => setScheduleData({ ...scheduleData, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50" placeholder="e.g. Resume Review & Mock Interview" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Date & Time</label>
                  <input required type="datetime-local" value={scheduleData.date} onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Duration</label>
                  <select value={scheduleData.duration} onChange={(e) => setScheduleData({ ...scheduleData, duration: parseInt(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 appearance-none">
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>
              </form>

              <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
                <button type="button" onClick={() => setShowScheduleModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition">Cancel</button>
                <motion.button form="schedule-form" type="submit" disabled={isScheduling} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition flex items-center justify-center gap-2 shadow-glow-primary">
                  {isScheduling ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Booking"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MentorshipRequests;
