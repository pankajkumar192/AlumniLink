import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ progress, color = "bg-[#4f8cff]", glowColor = "rgba(79,140,255,0.3)" }) => {
  return (
    <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
        className={`h-full rounded-full ${color} relative`}
        style={{ boxShadow: `0 0 12px ${glowColor}` }}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" 
             style={{ width: '50%', left: '25%' }} />
      </motion.div>
    </div>
  );
};

export default ProgressBar;
