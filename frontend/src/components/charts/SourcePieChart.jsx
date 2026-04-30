import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#4f8cff", "#8b5cf6", "#10b981", "#f59e0b"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f1520]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2.5">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
        <span className="text-sm text-white font-bold">{payload[0].name}</span>
      </div>
      <p className="text-sm text-gray-400 mt-1">{payload[0].value}%</p>
    </div>
  );
};

const SourcePieChart = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="chart-container p-8 h-[440px] flex flex-col"
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-100 tracking-tight">User Demographics</h3>
        <p className="text-base text-gray-500 mt-1">Platform role distribution</p>
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="45%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value" stroke="none" isAnimationActive={true} animationDuration={1200} animationEasing="ease-out">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ paddingBottom: '10%' }}>
          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="text-4xl font-extrabold text-white tracking-tight">
            {total}
          </motion.span>
          <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">Total</span>
        </div>
      </div>

      <div className="flex justify-center gap-8 mt-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i], boxShadow: `0 0 6px ${COLORS[i]}50` }} />
            <span className="text-sm text-gray-400 font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SourcePieChart;
