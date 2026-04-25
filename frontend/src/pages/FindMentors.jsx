import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Star, Building2, MessageCircle, Loader2, Users, Sparkles } from "lucide-react";
import { mentorAPI, mentorshipAPI, aiAPI } from "../utils/api";
import useAuthStore from "../store/authStore";
import MentorOnboardingModal from "../components/MentorOnboardingModal";

const FindMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [isMatchedMode, setIsMatchedMode] = useState(false);
  const user = useAuthStore((state) => state.user);

  const fetchMentorsAndRequests = async () => {
    try {
      const [mentorsRes, requestsRes] = await Promise.all([
        mentorAPI.getMentors(),
        mentorshipAPI.getRequests().catch(() => ({ data: { data: [] } }))
      ]);
      setMentors(mentorsRes.data.data || []);
      setRequests(requestsRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMentorsAndRequests(); }, []);

  const handleRequest = async (mentorId) => {
    try {
      setRequestingId(mentorId);
      await mentorshipAPI.createRequest({
        mentorId,
        subject: "Mentorship Request",
        message: "Hi, I would like to request your mentorship.",
      });
      await fetchMentorsAndRequests();
    } catch (error) {
      console.error("Error requesting mentorship:", error);
      alert(error.response?.data?.message || "Error requesting mentorship");
    } finally {
      setRequestingId(null);
    }
  };

  const handleAutoMatch = async () => {
    setIsMatching(true);
    try {
      const { data } = await aiAPI.matchMentors();
      setMentors(data.data || []);
      setIsMatchedMode(true);
    } catch (error) {
      console.error("Error auto-matching:", error);
      alert("Failed to auto-match.");
    } finally {
      setIsMatching(false);
    }
  };

  const filtered = mentors.filter(m => {
    const name = m.user?.name || m.name || "";
    const skillsList = typeof m.skills === 'string' ? JSON.parse(m.skills || "[]") : (m.skills || []);
    return name.toLowerCase().includes(search.toLowerCase()) || 
      skillsList.some(s => s.toLowerCase().includes(search.toLowerCase()));
  });

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

  return (
    <motion.div className="space-y-10" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="glass-card p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
              Find a <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Mentor</span>
            </h1>
            <p className="text-gray-400 text-lg">Connect with experienced professionals who care about your growth.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm font-semibold text-gray-300 shrink-0">
            <Users className="w-5 h-5 text-blue-400" />
            {mentors.length} Mentors Available
          </div>
        </div>
      </motion.div>

      {/* Become a Mentor Banner */}
      {!user?.isMentor && (
        <motion.div 
          variants={itemVariants}
          className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-indigo-500/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-noise opacity-50 mix-blend-overlay pointer-events-none" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Share your expertise</h3>
              <p className="text-gray-400 text-sm">Become a mentor and help shape the next generation of professionals.</p>
            </div>
          </div>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-glow-primary transition-all relative z-10 shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Become a Mentor
          </motion.button>
        </motion.div>
      )}

      {/* Search */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or skill (e.g. React, Python)..."
            className="input-focus w-full border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none transition-all text-sm"
          />
        </div>
        <motion.button
          onClick={handleAutoMatch}
          disabled={isMatching}
          className="glass-card px-6 py-4 flex items-center justify-center gap-2 border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all text-purple-300 hover:text-white rounded-2xl shadow-glow-secondary disabled:opacity-50 shrink-0"
          whileHover={{ scale: 1.02 }}
        >
          {isMatching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          <span className="text-sm font-bold">Auto-Match</span>
        </motion.button>
      </motion.div>

      {isMatchedMode && (
        <div className="flex justify-between items-center bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl">
          <p className="text-purple-300 text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> AI found your best matches!
          </p>
          <button onClick={() => { setIsMatchedMode(false); fetchMentorsAndRequests(); }} className="text-sm text-gray-400 hover:text-white underline">
            Clear
          </button>
        </div>
      )}

      {/* Mentors Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" variants={containerVariants}>
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            <p className="text-gray-500 text-sm">Finding mentors for you...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full glass-card p-20 text-center flex flex-col items-center gap-4">
            <Sparkles className="w-12 h-12 text-gray-500 opacity-30" />
            <h3 className="text-xl font-bold text-gray-300">No mentors found</h3>
            <p className="text-gray-500">Try a different search term.</p>
          </div>
        ) : filtered.map((mentor) => {
          const existingRequest = requests.find(r => r.mentorId?.id === mentor.id || r.mentorId === mentor.id);
          const hasRequested = !!existingRequest;
          const isSelf = mentor.id === (user?.id || user?.id);

          return (
            <motion.div
              key={mentor.id}
              className={`glass-card p-7 group transition-all duration-500 relative overflow-hidden flex flex-col ${isMatchedMode && mentor.matchScore > 0 ? "border border-purple-500/50 shadow-glow-secondary" : "border border-white/5 hover:border-blue-500/25"}`}
              variants={itemVariants}
              whileHover={{ y: -6 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Avatar + Info */}
              <div className="flex items-start gap-4 mb-6">
                <div className="relative shrink-0">
                  <img
                    src={mentor.user?.avatar || mentor.avatar || `https://i.pravatar.cc/150?u=${mentor.id}`}
                    alt={mentor.user?.name || mentor.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 group-hover:border-blue-500/30 transition-colors"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-dark shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate text-white group-hover:text-blue-300 transition-colors">{mentor.user?.name || mentor.name}</h3>
                  <p className="text-gray-400 text-sm truncate">{mentor.user?.position || mentor.position || "Mentor"}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                    <Building2 className="w-3.5 h-3.5 text-blue-400/70" />
                    <span className="truncate">{mentor.company || "Independent"}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-2">
                {mentor.user?.mentorBio || mentor.user?.bio || mentor.bio || "Available for mentoring and guidance."}
              </p>

              {/* Stars */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(mentor.mentorRating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-700"}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-yellow-400">{mentor.mentorRating || 5.0}</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6 flex-1">
                {(typeof mentor.skills === 'string' ? JSON.parse(mentor.skills || "[]") : (mentor.skills || [])).slice(0, 5).map((skill, i) => (
                  <span key={i} className="text-xs bg-blue-500/10 text-blue-300 px-3 py-1.5 rounded-full border border-blue-500/20 font-medium hover:bg-blue-500/20 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Action */}
              {!isSelf && (
                <motion.button
                  onClick={() => handleRequest(mentor.id)}
                  disabled={requestingId === mentor.id || hasRequested}
                  className={`w-full font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm ${
                    hasRequested
                      ? "bg-blue-500/10 text-blue-400 cursor-not-allowed border border-blue-500/20"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-glow-primary hover:shadow-glow-secondary"
                  }`}
                  whileHover={hasRequested ? {} : { scale: 1.02 }}
                  whileTap={hasRequested ? {} : { scale: 0.98 }}
                >
                  {requestingId === mentor.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : hasRequested ? (
                    "Request Sent ✓"
                  ) : (
                    <><MessageCircle className="w-4 h-4" /> Connect</>
                  )}
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <MentorOnboardingModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => {
              setIsModalOpen(false);
              fetchMentorsAndRequests();
            }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FindMentors;
