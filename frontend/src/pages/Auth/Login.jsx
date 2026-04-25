import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, Github, Chrome } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Toaster, toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      toast.success("Login successful! Welcome back 👋");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden">
      <Toaster position="top-right" richColors />

      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animated-blob w-[700px] h-[700px] bg-blue-500/15 -top-72 -left-72 animate-blob" />
        <div className="animated-blob w-[600px] h-[600px] bg-purple-500/15 -bottom-48 -right-48 animate-blob" style={{ animationDelay: "2s" }} />
        <div className="animated-blob w-[400px] h-[400px] bg-cyan-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blob" style={{ animationDelay: "4s" }} />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
            AlumniLink
          </h1>
          <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">Connect · Learn · Grow</p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          className="glass-card p-8 border border-white/10 shadow-premium-hover"
          variants={itemVariants}
        >
          <motion.div className="mb-8" variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in to your account to continue</p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="space-y-5" variants={itemVariants}>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-focus w-full border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-focus w-full border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-600 focus:outline-none transition-all text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/10 border border-white/20 checked:bg-blue-500 cursor-pointer accent-blue-500"
                />
                <span className="text-gray-400 group-hover:text-gray-300 transition font-medium">Remember me</span>
              </label>
              <span className="text-blue-400 hover:text-blue-300 transition cursor-pointer font-medium">Forgot password?</span>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-primary hover:shadow-glow-secondary text-sm tracking-wide"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /><span>Signing in...</span></>
              ) : (
                <span>Sign In</span>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div className="relative my-7" variants={itemVariants}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[#111]/80 text-gray-500 text-xs font-medium tracking-widest uppercase">or continue with</span>
            </div>
          </motion.div>

          {/* Social */}
          <motion.div className="grid grid-cols-2 gap-3" variants={itemVariants}>
            {[
              { icon: Chrome, label: "Google" },
              { icon: Github, label: "GitHub" },
            ].map(({ icon: Icon, label }) => (
              <motion.button
                key={label}
                type="button"
                className="border border-white/10 hover:border-white/20 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />{label}
              </motion.button>
            ))}
          </motion.div>

          {/* Sign Up */}
          <motion.p className="text-center text-gray-500 text-sm mt-7" variants={itemVariants}>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-bold transition">
              Create one free
            </Link>
          </motion.p>
        </motion.div>

        <motion.p className="text-center text-gray-600 text-xs mt-6" variants={itemVariants}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
