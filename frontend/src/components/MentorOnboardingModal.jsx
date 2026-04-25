import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Building2, Briefcase, Clock, Loader2, Target, Sparkles } from "lucide-react";
import { mentorAPI } from "../utils/api";
import useAuthStore from "../store/authStore";

const MentorOnboardingModal = ({ isOpen, onClose, onSuccess }) => {
  const getMe = useAuthStore((state) => state.getMe);
  
  const [formData, setFormData] = useState({
    company: "",
    skills: "",
    availability: "Flexible schedule",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.skills || !formData.availability) {
      alert("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert comma-separated string to array and trim whitespace
      const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(s => s);

      await mentorAPI.createMentor({
        company: formData.company,
        skills: skillsArray,
        availability: formData.availability,
        hourlyRate: 0 // Optional for now
      });

      // Update global user state so they are recognized as a mentor everywhere
      await getMe();
      
      onSuccess();
    } catch (error) {
      console.error("Error creating mentor profile:", error);
      alert(error.response?.data?.message || "Failed to create mentor profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card w-full max-w-lg bg-[#0f172a] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/10 relative"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl -mr-32 -mt-32 pointer-events-none" />
        
        <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Become a Mentor</h3>
              <p className="text-xs text-gray-400">Share your expertise with the community.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 relative z-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <form id="mentor-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                <Building2 className="w-4 h-4 text-purple-400" />
                Current Company
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Google, Stripe, or Independent"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                <Target className="w-4 h-4 text-purple-400" />
                Areas of Expertise (Comma Separated)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. React, Product Management, Career Advice"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Availability
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="Flexible schedule">Flexible schedule</option>
                <option value="Weekends only">Weekends only</option>
                <option value="Evenings (Weekdays)">Evenings (Weekdays)</option>
                <option value="Limited capacity">Limited capacity</option>
              </select>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            form="mentor-form"
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all flex items-center justify-center gap-2 shadow-glow-primary min-w-[140px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Join as Mentor"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MentorOnboardingModal;
