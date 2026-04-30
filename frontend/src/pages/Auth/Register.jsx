import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Loader2, Github, Chrome, CheckCircle2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Toaster, toast } from "sonner";
import { signInWithGoogle, signInWithGithub } from "../../firebase";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const oauthLogin = useAuthStore((state) => state.oauthLogin);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
      });
      toast.success("Account created successfully! 🎉");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setOauthLoading(provider);
    try {
      const signInFn = provider === "google" ? signInWithGoogle : signInWithGithub;
      const { idToken } = await signInFn();
      const data = await oauthLogin(idToken, provider);
      toast.success(`Signed in with ${provider === "google" ? "Google" : "GitHub"} 🎉`);
      // Always go to onboarding on Register page (user is signing up for the first time)
      setTimeout(() => navigate(data.isNewUser ? "/onboarding" : "/dashboard"), 400);
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
        toast.info("Sign-in cancelled");
      } else {
        toast.error(error.response?.data?.message || `${provider} login failed. Please try again.`);
        console.error(`OAuth error (${provider}):`, error);
      }
    } finally {
      setOauthLoading(null);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-600";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-emerald-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden py-8">
      <Toaster position="top-right" />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="animated-blob w-96 h-96 -top-48 -left-48"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="animated-blob w-96 h-96 -bottom-48 -right-48"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            AlumniLink
          </h1>
          <p className="text-gray-400 text-sm">Join our Alumni Network</p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          className="glass-card p-8 space-y-5"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 0 30px rgba(59, 130, 246, 0.2)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Welcome Text */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold">Create Account</h2>
            <p className="text-gray-400 text-sm mt-1">Join thousands of alumni and students</p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="space-y-4" variants={itemVariants}>
            {/* Full Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-blue-400 opacity-60" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-focus w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-blue-400 opacity-60" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-focus w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Role Selection */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2 text-gray-300">I am a</label>
              <div className="flex gap-3">
                {["student", "alumni"].map((role) => (
                  <motion.label
                    key={role}
                    className="flex items-center flex-1 cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={handleChange}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-300 capitalize group-hover:text-white transition text-sm">
                      {role}
                    </span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-blue-400 opacity-60" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-focus w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <motion.div className="mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Password strength:</span>
                    <span className={`text-xs font-semibold ${passwordStrength === 4 ? "text-emerald-400" : passwordStrength === 3 ? "text-blue-400" : "text-yellow-400"}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <motion.div
                      className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2 text-gray-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-blue-400 opacity-60" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-focus w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <motion.div className="mt-2 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-red-400">Passwords do not match</span>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Sign Up Button */}
            <motion.button
              type="submit"
              disabled={isLoading || formData.password !== formData.confirmPassword}
              className="ripple w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div className="relative my-5" variants={itemVariants}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-b from-dark to-dark text-gray-400">or continue with</span>
            </div>
          </motion.div>

          {/* Social Sign Up */}
          <motion.div className="grid grid-cols-2 gap-3" variants={itemVariants}>
            {[
              { id: "google", icon: Chrome, label: "Google", color: "hover:border-red-400/40 hover:text-red-300" },
              { id: "github", icon: Github, label: "GitHub", color: "hover:border-white/30 hover:text-white" },
            ].map(({ id, icon: Icon, label, color }) => (
              <motion.button
                key={id}
                type="button"
                id={`oauth-${id}-register`}
                disabled={!!oauthLoading || isLoading}
                onClick={() => handleOAuth(id)}
                className={`border border-white/10 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 text-gray-400 ${color} hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {oauthLoading === id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                {label}
              </motion.button>
            ))}
          </motion.div>

          {/* Sign In Link */}
          <motion.p className="text-center text-gray-400 text-sm" variants={itemVariants}>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">
              Sign in
            </Link>
          </motion.p>
        </motion.div>

        {/* Footer */}
        <motion.p className="text-center text-gray-500 text-xs mt-6" variants={itemVariants}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;
