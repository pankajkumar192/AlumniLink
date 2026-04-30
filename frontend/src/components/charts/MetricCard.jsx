import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const useAnimatedCounter = (end, duration = 1200) => {
  const [count, setCount] = useState(0);
  const endValue = parseInt(end) || 0;
  useEffect(() => {
    if (endValue === 0) return;
    let start = 0;
    const increment = endValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) { setCount(endValue); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [endValue, duration]);
  return count;
};

const generateSparkline = (value) => {
  const base = parseInt(value) || 10;
  return Array.from({ length: 12 }, (_, i) => ({
    v: Math.max(1, base * (0.4 + Math.random() * 0.8) + (i * base * 0.05)),
  }));
};

const GLOW_COLORS = {
  blue: "rgba(79, 140, 255, 0.08)",
  purple: "rgba(139, 92, 246, 0.08)",
  emerald: "rgba(16, 185, 129, 0.08)",
  amber: "rgba(245, 158, 11, 0.08)",
};
const ACCENT_COLORS = {
  blue: "#4f8cff",
  purple: "#8b5cf6",
  emerald: "#10b981",
  amber: "#f59e0b",
};

const MetricCard = ({ title, value, change, changeType, icon: Icon, delay = 0, accent = "blue" }) => {
  const animatedValue = useAnimatedCounter(value);
  const sparkData = useRef(generateSparkline(value)).current;
  const glowColor = GLOW_COLORS[accent] || GLOW_COLORS.blue;
  const accentColor = ACCENT_COLORS[accent] || ACCENT_COLORS.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="metric-card p-7 group cursor-default"
      style={{ "--card-glow": glowColor }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-2xl" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">{title}</p>
            <h3 className="text-4xl font-extrabold text-white tracking-tight tabular-nums">
              {animatedValue.toLocaleString()}
            </h3>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
            style={{ background: `${accentColor}10`, borderColor: `${accentColor}20` }}
          >
            <Icon className="w-6 h-6 transition-colors duration-300" style={{ color: accentColor }} />
          </div>
        </div>

        <div className="h-12 w-full mb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300 sparkline-animate">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={accentColor} strokeWidth={1.5} fill={`url(#spark-${title})`} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full ${
            changeType === "positive" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
            changeType === "negative" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
            "bg-gray-500/10 text-gray-400 border border-gray-500/20"
          }`}>
            {changeType === "positive" ? <TrendingUp className="w-3.5 h-3.5" /> :
             changeType === "negative" ? <TrendingDown className="w-3.5 h-3.5" /> :
             <Minus className="w-3.5 h-3.5" />}
            {changeType === "positive" ? "+" : ""}{change}
          </span>
          <span className="text-sm text-gray-600 font-medium">vs last month</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;
