import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Briefcase, MessageSquare, ArrowUpRight, Zap, TrendingUp, MapPin, Award } from "lucide-react";
import useAuthStore from "../store/authStore";
import { mentorAPI, mentorshipAPI, jobAPI, eventAPI } from "../utils/api";

import MetricCard from "../components/charts/MetricCard";
import MainChart from "../components/charts/MainChart";
import TrafficChart from "../components/charts/TrafficChart";
import SourcePieChart from "../components/charts/SourcePieChart";
import StatusBadge from "../components/ui/StatusBadge";
import ProgressBar from "../components/ui/ProgressBar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const InsightCard = ({ icon: Icon, text, accent = "blue", delay = 0 }) => {
  const colors = {
    blue: { bg: "from-blue-500/8 to-blue-500/3", border: "border-blue-500/15", icon: "text-blue-400" },
    purple: { bg: "from-purple-500/8 to-purple-500/3", border: "border-purple-500/15", icon: "text-purple-400" },
    emerald: { bg: "from-emerald-500/8 to-emerald-500/3", border: "border-emerald-500/15", icon: "text-emerald-400" },
  };
  const c = colors[accent] || colors.blue;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="insight-card px-5 py-4 flex items-center gap-4 group cursor-default hover:scale-[1.01] transition-transform"
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shrink-0 border ${c.border}`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <p className="text-sm text-gray-300 font-medium leading-relaxed">{text}</p>
    </motion.div>
  );
};

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ mentors: 0, requests: 0, jobs: 0, events: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [mentors, requests, jobs, events] = await Promise.all([
          mentorAPI.getMentors().catch(() => ({ data: { count: 0, data: [] } })),
          mentorshipAPI.getRequests().catch(() => ({ data: { data: [] } })),
          jobAPI.getJobs().catch(() => ({ data: { count: 0, data: [] } })),
          eventAPI.getEvents().catch(() => ({ data: { count: 0, data: [] } })),
        ]);
        setTotals({
          mentors: mentors.data?.count || mentors.data?.data?.length || 0,
          requests: requests.data?.data?.length || 0,
          jobs: jobs.data?.count || jobs.data?.data?.length || 0,
          events: events.data?.count || events.data?.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStats();
    else setLoading(false);
  }, [user]);

  const generateMainChartData = () => {
    const data = [];
    const baseSessions = 120 + (totals.mentors * 5);
    const baseUsers = 80 + (totals.jobs * 2);
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        sessions: Math.floor(baseSessions * (0.8 + Math.random() * 0.4)),
        users: Math.floor(baseUsers * (0.8 + Math.random() * 0.4)),
      });
    }
    return data;
  };

  const generateTrafficData = () => [
    { name: "Jobs", views: 400 + (totals.jobs * 20) },
    { name: "Events", views: 300 + (totals.events * 15) },
    { name: "Mentors", views: 500 + (totals.mentors * 25) },
    { name: "Messages", views: 200 + (totals.requests * 10) },
  ];

  const generatePieData = () => [
    { name: "Students", value: 65 },
    { name: "Alumni", value: 35 },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#4f8cff]/20 border-t-[#4f8cff] rounded-full animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-[#8b5cf6]/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  return (
    <motion.div className="space-y-8 pb-20 bg-glow" variants={containerVariants} initial="hidden" animate="visible">

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <motion.h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-2" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            Overview
          </motion.h1>
          <p className="text-base lg:text-lg text-gray-500">
            Welcome back, <span className="text-gray-300 font-medium">{user?.name?.split(' ')[0]}</span>. Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-4">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-6 py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-xl text-base font-medium transition text-gray-300 backdrop-blur-sm">
            Export Report
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-glow px-6 py-3 bg-gradient-to-r from-[#4f8cff] to-[#8b5cf6] hover:from-[#3b76e8] hover:to-[#7c4ddb] text-white rounded-xl text-base font-semibold transition shadow-[0_0_24px_rgba(79,140,255,0.25)]">
            New Campaign
          </motion.button>
        </div>
      </motion.div>

      {/* Smart Insights */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2.5 mb-4">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Smart Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard icon={TrendingUp} text={`User growth increased by 12% this week — ${totals.mentors + totals.requests} active connections`} accent="blue" delay={0.1} />
          <InsightCard icon={MapPin} text="Most active city: Bangalore — 34% of all mentorship sessions" accent="emerald" delay={0.2} />
          <InsightCard icon={Award} text={`Top mentor this month has ${totals.requests} completed sessions`} accent="purple" delay={0.3} />
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard title="Total Mentors" value={totals.mentors.toString()} change="12%" changeType="positive" icon={Users} delay={0.1} accent="blue" />
        <MetricCard title="Active Jobs" value={totals.jobs.toString()} change="5%" changeType="positive" icon={Briefcase} delay={0.15} accent="purple" />
        <MetricCard title="Mentorships" value={totals.requests.toString()} change="2%" changeType="neutral" icon={MessageSquare} delay={0.2} accent="emerald" />
        <MetricCard title="Events" value={totals.events.toString()} change="8%" changeType="positive" icon={Calendar} delay={0.25} accent="amber" />
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="col-span-1 lg:col-span-2">
          <MainChart data={generateMainChartData()} />
        </div>
        <div className="col-span-1">
          <SourcePieChart data={generatePieData()} />
        </div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="col-span-1">
          <TrafficChart data={generateTrafficData()} />
        </div>

        {/* System Goals */}
        <div className="col-span-1 lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="chart-container p-8 h-full">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-100 tracking-tight">System Goals</h3>
                <motion.button whileHover={{ scale: 1.05 }} className="text-sm text-[#4f8cff] hover:text-white transition flex items-center gap-1.5 font-medium">
                  View All <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-400 font-medium">Alumni Onboarding</span>
                    <span className="text-gray-200 font-bold tabular-nums">78%</span>
                  </div>
                  <ProgressBar progress={78} color="bg-[#4f8cff]" glowColor="rgba(79,140,255,0.25)" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-400 font-medium">Mentorship Match Rate</span>
                    <span className="text-gray-200 font-bold tabular-nums">92%</span>
                  </div>
                  <ProgressBar progress={92} color="bg-[#10b981]" glowColor="rgba(16,185,129,0.25)" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-400 font-medium">Job Placement Rate</span>
                    <span className="text-gray-200 font-bold tabular-nums">45%</span>
                  </div>
                  <ProgressBar progress={45} color="bg-[#8b5cf6]" glowColor="rgba(139,92,246,0.25)" />
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 flex gap-6">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">Server Status</p>
                  <div className="flex items-center gap-2.5">
                    <StatusBadge status="Active" />
                    <span className="text-sm text-gray-400 font-medium">99.9% Uptime</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">Last Backup</p>
                  <div className="flex items-center gap-2.5">
                    <StatusBadge status="Completed" />
                    <span className="text-sm text-gray-400 font-medium">2h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
