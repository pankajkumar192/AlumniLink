import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

const BAR_COLORS = ["#4f8cff", "#8b5cf6", "#10b981", "#f59e0b"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f1520]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl shadow-black/40">
      <p className="text-sm text-white font-bold">{payload[0].payload.name}</p>
      <p className="text-sm text-gray-400 mt-1">
        <span className="text-white font-semibold">{payload[0].value?.toLocaleString()}</span> views
      </p>
    </div>
  );
};

const TrafficChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="chart-container p-8 h-[380px] flex flex-col"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-100 tracking-tight">Engagement Overview</h3>
        <p className="text-base text-gray-500 mt-1">Interactions across different modules</p>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <defs>
              {BAR_COLORS.map((color, i) => (
                <linearGradient key={i} id={`barGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 13, fontWeight: 500 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 13, fontWeight: 500 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
            <Bar dataKey="views" radius={[6, 6, 0, 0]} maxBarSize={48} isAnimationActive={true} animationDuration={1200} animationEasing="ease-out">
              {data.map((_, i) => (
                <Cell key={i} fill={`url(#barGrad-${i % BAR_COLORS.length})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TrafficChart;
