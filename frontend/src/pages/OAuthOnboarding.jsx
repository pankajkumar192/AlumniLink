import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Briefcase, Camera, Check, Loader2,
  User, ArrowRight, Sparkles, Upload
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuthStore from "../store/authStore";
import ImageCropper from "../components/ImageCropper";
import { uploadAPI, authAPI } from "../utils/api";

const STEPS = ["role", "avatar", "done"];

const OAuthOnboarding = () => {
  const navigate = useNavigate();
  const { user, clearNewOAuthUser, getMe } = useAuthStore();

  const [step, setStep] = useState(0); // 0=role, 1=avatar, 2=done
  const [role, setRole] = useState("STUDENT");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [cropSrc, setCropSrc] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef();

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = async (croppedFile) => {
    setCropSrc(null);
    const formData = new FormData();
    formData.append("image", croppedFile);
    try {
      const { data } = await uploadAPI.uploadImage(formData);
      setAvatarPreview(data.url);
      toast.success("Photo uploaded ✅");
    } catch (err) {
      console.error("Upload error details:", err.response?.data || err);
      toast.error("Upload failed, try again");
    }
  };

  // ─── Save & Finish ──────────────────────────────────────────────────────────
  const handleFinish = async () => {
    setIsSaving(true);
    try {
      await authAPI.updateProfile({
        role: role,
        ...(avatarPreview && { avatar: avatarPreview }),
      });
      await getMe(); // refresh store
      clearNewOAuthUser();
      setStep(2); // go to done step
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err) {
      toast.error("Could not save profile, please try again");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Animation ──────────────────────────────────────────────────────────────
  const variants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="animated-blob w-[600px] h-[600px] bg-blue-500/15 -top-60 -left-60 animate-blob" />
        <div className="animated-blob w-[500px] h-[500px] bg-emerald-500/10 -bottom-40 -right-40 animate-blob" style={{ animationDelay: "2s" }} />
        <div className="animated-blob w-[350px] h-[350px] bg-purple-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blob" style={{ animationDelay: "4s" }} />
      </div>

      {/* Image Cropper overlay */}
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropSrc(null)}
          aspect={1}
        />
      )}

      <motion.div
        className="relative z-10 w-full max-w-lg px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold tracking-wide uppercase">Welcome to AlumniLink</span>
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2">
            Let's set up your profile
          </h1>
          <p className="text-gray-400 text-sm">Just 2 quick steps to get you started</p>
        </div>

        {/* Step progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Choose role", "Add photo"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                  step > i
                    ? "bg-emerald-500 text-white"
                    : step === i
                    ? "bg-blue-500 text-white ring-2 ring-blue-400/40"
                    : "bg-white/10 text-gray-500"
                }`}
                animate={{ scale: step === i ? 1.1 : 1 }}
              >
                {step > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </motion.div>
              <span className={`text-xs font-medium ${step === i ? "text-white" : "text-gray-500"}`}>{label}</span>
              {i < 1 && <div className={`w-8 h-px mx-1 ${step > i ? "bg-emerald-500" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card border border-white/10 shadow-premium-hover overflow-hidden">
          <AnimatePresence mode="wait">
            {/* ── STEP 0: Role ── */}
            {step === 0 && (
              <motion.div
                key="role"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <h2 className="text-xl font-bold text-white mb-1">I am a...</h2>
                <p className="text-gray-500 text-sm mb-7">This helps us personalise your experience</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    {
                      value: "STUDENT",
                      label: "Student",
                      desc: "Looking for mentors, jobs & career guidance",
                      icon: GraduationCap,
                      gradient: "from-blue-500/20 to-cyan-500/20",
                      border: "border-blue-500/50",
                      glow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
                      iconColor: "text-blue-400",
                    },
                    {
                      value: "ALUMNI",
                      label: "Alumni",
                      desc: "Ready to mentor, post jobs & give back",
                      icon: Briefcase,
                      gradient: "from-emerald-500/20 to-teal-500/20",
                      border: "border-emerald-500/50",
                      glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
                      iconColor: "text-emerald-400",
                    },
                  ].map(({ value, label, desc, icon: Icon, gradient, border, glow, iconColor }) => (
                    <motion.button
                      key={value}
                      id={`role-${value.toLowerCase()}`}
                      onClick={() => setRole(value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                        role === value
                          ? `bg-gradient-to-br ${gradient} ${border} ${glow}`
                          : "border-white/10 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      {role === value && (
                        <motion.div
                          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                      <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 ${role === value ? iconColor : "text-gray-500"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className={`font-bold text-base mb-1 ${role === value ? "text-white" : "text-gray-300"}`}>{label}</p>
                      <p className={`text-xs leading-relaxed ${role === value ? "text-gray-300" : "text-gray-500"}`}>{desc}</p>
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  id="role-next"
                  onClick={() => setStep(1)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-glow-primary transition-all"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* ── STEP 1: Avatar ── */}
            {step === 1 && (
              <motion.div
                key="avatar"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <h2 className="text-xl font-bold text-white mb-1">Add a profile photo</h2>
                <p className="text-gray-500 text-sm mb-8">Upload one or keep your {user?.name?.split(" ")[0] || "account"}'s current photo</p>

                {/* Avatar preview */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <motion.div
                      className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/10 group-hover:ring-blue-500/40 transition-all"
                      whileHover={{ scale: 1.04 }}
                    >
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </motion.div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  <motion.button
                    id="upload-photo-btn"
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-5 flex items-center gap-2 px-5 py-2.5 border border-white/15 hover:border-blue-500/40 hover:bg-blue-500/10 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    {avatarPreview ? "Change photo" : "Upload photo"}
                  </motion.button>

                  {avatarPreview && (
                    <button
                      onClick={() => setAvatarPreview(null)}
                      className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition"
                    >
                      Remove photo
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 py-3.5 border border-white/10 hover:border-white/20 rounded-2xl text-sm font-semibold text-gray-400 hover:text-white transition-all"
                  >
                    Back
                  </button>
                  <motion.button
                    id="finish-onboarding"
                    onClick={handleFinish}
                    disabled={isSaving}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-[2] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : (
                      <><Check className="w-4 h-4" /> Finish Setup</>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Done ── */}
            {step === 2 && (
              <motion.div
                key="done"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="p-10 flex flex-col items-center text-center"
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                >
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </motion.div>
                <motion.h2
                  className="text-2xl font-black text-white mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  You're all set, {user?.name?.split(" ")[0]}! 🎉
                </motion.h2>
                <motion.p
                  className="text-gray-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Taking you to your dashboard...
                </motion.p>
                <motion.div
                  className="mt-6 h-1 bg-white/10 rounded-full w-48 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.6, delay: 0.7, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OAuthOnboarding;
