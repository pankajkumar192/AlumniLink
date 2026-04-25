import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Briefcase, MessageSquare, TrendingUp, Award, ArrowRight, Loader2, Sparkles, Clock, Video } from "lucide-react";
import useAuthStore from "../store/authStore";
import { mentorAPI, mentorshipAPI, jobAPI, eventAPI, meetingAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [stats, setStats] = useState([
    { icon: Users, label: "Mentors Available", value: "0", color: "from-blue-500 to-cyan-500", shadow: "shadow-glow-primary" },
    { icon: MessageSquare, label: "Mentorship Requests", value: "0", color: "from-purple-500 to-pink-500", shadow: "shadow-glow-secondary" },
    { icon: Briefcase, label: "Job Opportunities", value: "0", color: "from-emerald-500 to-teal-500", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]" },
    { icon: Calendar, label: "Upcoming Events", value: "0", color: "from-orange-500 to-rose-500", shadow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [mentors, requests, jobs, events, meetingsRes] = await Promise.all([
          mentorAPI.getMentors().catch(() => ({ data: { count: 0 } })),
          mentorshipAPI.getRequests().catch(() => ({ data: { data: [] } })),
          jobAPI.getJobs().catch(() => ({ data: { count: 0 } })),
          eventAPI.getEvents().catch(() => ({ data: { count: 0 } })),
          meetingAPI.getMeetings().catch(() => ({ data: { data: [] } })),
        ]);

        setMeetings(meetingsRes.data?.data || []);

        setStats([
          { icon: Users, label: "Mentors Available", value: mentors.data?.count || mentors.data?.data?.length || "0", color: "from-blue-500 to-cyan-500", shadow: "shadow-glow-primary" },
          { icon: MessageSquare, label: "Mentorship Requests", value: requests.data?.data?.length || "0", color: "from-purple-500 to-pink-500", shadow: "shadow-glow-secondary" },
          { icon: Briefcase, label: "Job Opportunities", value: jobs.data?.count || jobs.data?.data?.length || "0", color: "from-emerald-500 to-teal-500", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]" },
          { icon: Calendar, label: "Upcoming Events", value: events.data?.count || events.data?.data?.length || "0", color: "from-orange-500 to-rose-500", shadow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]" },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div className="space-y-10" variants={containerVariants} initial="hidden" animate="visible">
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="relative glass-card p-10 overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Let's make meaningful connections today. Explore new career opportunities, find expert mentors, or attend upcoming alumni events.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              className="glass-card p-6 group cursor-pointer hover:-translate-y-2 transition-all duration-300 border border-white/5 hover:border-white/20 relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} p-3.5 mb-6 group-hover:scale-110 transition-transform duration-300 ${stat.shadow}`}>
                  <Icon className="w-full h-full text-white drop-shadow-md" />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">{stat.label}</p>
                <p className="text-4xl font-bold text-white tracking-tight">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={containerVariants}>
        <motion.div
          className="glass-card p-10 group cursor-pointer border border-white/5 hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ y: -5 }}
          onClick={() => navigate("/mentors")}
        >
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative z-10 flex items-start justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">Find a Mentor</h3>
              <p className="text-gray-400 leading-relaxed max-w-sm">Connect with experienced alumni who can guide your career and offer invaluable industry insights.</p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
              <Users className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <motion.button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition text-sm font-bold uppercase tracking-wider">
            Browse Mentors <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        <motion.div
          className="glass-card p-10 group cursor-pointer border border-white/5 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ y: -5 }}
          onClick={() => navigate("/jobs")}
        >
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative z-10 flex items-start justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">Job Opportunities</h3>
              <p className="text-gray-400 leading-relaxed max-w-sm">Explore exclusive career opportunities and internships posted directly by our alumni network.</p>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
              <Briefcase className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <motion.button className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition text-sm font-bold uppercase tracking-wider">
            View Jobs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Upcoming Meetings Widget */}
      <motion.div className="glass-card p-10 border border-white/5 relative overflow-hidden" variants={itemVariants}>
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold tracking-tight">Upcoming Meetings</h2>
        </div>
        
        {meetings.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
            <p className="text-gray-400 text-lg">No upcoming meetings scheduled.</p>
            <p className="text-gray-500 text-sm mt-2">Go to Mentorship to schedule a session.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map((meeting) => {
              const isStudent = user.id === meeting.studentId;
              const otherPerson = isStudent ? meeting.mentor?.user : meeting.student;
              return (
                <div key={meeting.id} className="p-5 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white mb-1">{meeting.title}</h4>
                    <p className="text-sm text-gray-400 mb-2">With {otherPerson?.name || "Unknown"}</p>
                    <div className="flex gap-4 text-xs font-semibold text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(meeting.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {meeting.duration} min</span>
                    </div>
                  </div>
                  {meeting.link && (
                    <a href={meeting.link} target="_blank" rel="noreferrer" className="p-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl transition flex shrink-0">
                      <Video className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
