import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#0f1520]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl shadow-black/40">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">{label}</p>
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2.5 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-sm text-gray-300 font-medium capitalize">{item.dataKey}:</span>
          <span className="text-sm text-white font-bold">{item.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const MainChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="chart-container p-8 h-[440px]"
    >
      <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-gradient-to-b from-blue-500/[0.04] to-transparent pointer-events-none rounded-t-2xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-100 tracking-tight">Platform Activity</h3>
            <p className="text-base text-gray-500 mt-1">Daily active users and sessions over time</p>
          </div>
          <div className="flex gap-5">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#4f8cff] shadow-[0_0_8px_rgba(79,140,255,0.4)]" />
              <span className="text-sm text-gray-400 font-medium">Sessions</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
              <span className="text-sm text-gray-400 font-medium">Users</span>
            </div>
          </div>
        </div>

        <div className="h-[310px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.25} />
                  <stop offset="50%" stopColor="#4f8cff" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#4f8cff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="strokeSessions" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.6} />
                  <stop offset="50%" stopColor="#4f8cff" stopOpacity={1} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="strokeUsers" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 13, fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 13, fontWeight: 500 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(79,140,255,0.15)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="sessions" stroke="url(#strokeSessions)" strokeWidth={2.5} fillOpacity={1} fill="url(#gradSessions)" dot={false} activeDot={{ r: 6, fill: "#4f8cff", stroke: "#111827", strokeWidth: 3 }} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
              <Area type="monotone" dataKey="users" stroke="url(#strokeUsers)" strokeWidth={2.5} fillOpacity={1} fill="url(#gradUsers)" dot={false} activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#111827", strokeWidth: 3 }} isAnimationActive={true} animationDuration={1500} animationBegin={300} animationEasing="ease-out" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default MainChart;
