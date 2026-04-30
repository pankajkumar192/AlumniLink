import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, MessageSquare, Briefcase, Calendar, Clock, Globe,
  Users, ArrowRight, Star, Menu, X,
  UserCircle, Rocket, ExternalLink, Activity
} from "lucide-react";
import "../styles/landing.css";

/* ─────────────── Animated Section Wrapper ─────────────── */
const FadeInSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────── Animated Counter ─────────────── */
const AnimatedCounter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(target.replace(/,/g, ""));
    const duration = 2000;
    const steps = 60;
    const increment = num / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);
  
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─────────────── Data ─────────────── */
const features = [
  { icon: Sparkles, title: "AI Mentor Matching", desc: "Our engine analyzes your goals and matches you with the perfect alumni mentor.", color: "from-blue-500 to-cyan-500" },
  { icon: MessageSquare, title: "Real-time Chat", desc: "Connect instantly with mentors and peers through our built-in encrypted messaging.", color: "from-purple-500 to-pink-500" },
  { icon: Briefcase, title: "Exclusive Jobs", desc: "Access high-tier job postings and internships shared directly by the network.", color: "from-emerald-500 to-teal-500" },
  { icon: Calendar, title: "Premium Events", desc: "Discover and attend workshops, career fairs, and exclusive networking events.", color: "from-orange-500 to-rose-500" },
  { icon: Clock, title: "Smart Scheduling", desc: "Book 1-on-1 sessions instantly with integrated calendar syncing and video links.", color: "from-indigo-500 to-blue-500" },
  { icon: Globe, title: "Global Community", desc: "Join a thriving network of 10,000+ verified professionals sharing knowledge.", color: "from-violet-500 to-purple-500" },
];

const stats = [
  { value: "10000", suffix: "+", label: "Alumni Connected" },
  { value: "5000", suffix: "+", label: "Active Students" },
  { value: "2000", suffix: "+", label: "Jobs Posted" },
  { value: "98", suffix: "%", label: "Match Success" },
];

const testimonials = [
  { name: "Sarah Chen", role: "Software Engineer @ Google", quote: "AlumniLink completely transformed my career trajectory. I found an amazing mentor who helped me land my dream role.", avatar: "https://i.pravatar.cc/150?img=32" },
  { name: "James Rodriguez", role: "Product Manager @ Stripe", quote: "The AI matching is incredibly accurate. Within a week, I was connected with 3 mentors who perfectly aligned with my goals.", avatar: "https://i.pravatar.cc/150?img=53" },
  { name: "Dr. Priya Sharma", role: "VP Engineering @ Meta", quote: "As a mentor, this platform makes it effortless to give back. The scheduling and chat features are world-class.", avatar: "https://i.pravatar.cc/150?img=47" },
  { name: "David Kim", role: "Founder @ TechNova", quote: "I hired my first 5 engineers directly through the AlumniLink job board. The talent quality here is unmatched.", avatar: "https://i.pravatar.cc/150?img=11" },
];

/* ━━━━━━━━━━━━━━━━━ LANDING PAGE ━━━━━━━━━━━━━━━━━ */
const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* ── Background Effects ── */}
      <div className="lp-bg-effects">
        <div className="lp-blob lp-blob-1" />
        <div className="lp-blob lp-blob-2" />
        <div className="lp-blob lp-blob-3" />
      </div>

      {/* ━━━━━━━ NAVBAR ━━━━━━━ */}
      <nav className={`lp-navbar ${scrolled ? "lp-navbar-scrolled" : ""}`}>
        <div className="lp-navbar-inner">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4f8cff] flex items-center justify-center shadow-[0_0_15px_rgba(79,140,255,0.4)]">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <a href="#hero" className="lp-logo">AlumniLink</a>
          </div>
          
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#testimonials">Testimonials</a>
          </div>
          
          <div className="lp-nav-actions">
            <button onClick={() => navigate("/login")} className="lp-btn-ghost">Sign in</button>
            <motion.button 
              onClick={() => navigate("/signup")} 
              className="lp-btn-primary" 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
          
          <button className="lp-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="absolute top-full left-0 right-0 bg-[#0b0f14]/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl z-50 lg:hidden"
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
            >
              <a href="#features" className="text-gray-300 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-gray-300 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>How it works</a>
              <a href="#testimonials" className="text-gray-300 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
              <div className="h-px bg-white/10 my-2" />
              <button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }} className="text-gray-300 font-medium py-2 text-left">Sign in</button>
              <button onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }} className="bg-[#4f8cff] text-white font-semibold py-3 rounded-lg text-center shadow-lg mt-2">Get Started</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ━━━━━━━ HERO ━━━━━━━ */}
      <section id="hero" className="lp-hero-wrapper lp-container">
        <div className="lp-hero-grid">
          
          {/* Left Text */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 mb-6 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-[#4f8cff]" />
              <span>The Next-Gen Alumni Network</span>
            </motion.div>
            
            <motion.h1 
              className="lp-hero-title"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            >
              Connect.<br />
              <span className="lp-gradient-text">Mentor.</span><br />
              Grow.
            </motion.h1>
            
            <motion.p 
              className="lp-hero-desc"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            >
              A beautifully designed platform to build meaningful connections, find expert mentors, and accelerate your career within an exclusive community.
            </motion.p>
            
            <motion.div 
              className="lp-hero-ctas"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.button onClick={() => navigate("/signup")} className="lp-btn-primary lp-btn-lg flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Start your journey <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button onClick={() => navigate("/login")} className="lp-btn-outline lp-btn-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Explore Platform
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Interactive Dashboard Preview */}
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            style={{ perspective: 1000 }}
          >
            <div className="lp-mockup">
              <div className="lp-mockup-base">
                <div className="lp-mockup-header">
                  <div className="flex gap-1.5"><div className="lp-dot lp-dot-r"/><div className="lp-dot lp-dot-y"/><div className="lp-dot lp-dot-g"/></div>
                  <span className="text-xs text-gray-500 font-medium ml-2">alumnilink.app / dashboard</span>
                </div>
                <div className="lp-mockup-body">
                  <div className="lp-mockup-stats">
                    <div className="lp-mockup-stat-card"><h4>Mentors</h4><p>1,248</p></div>
                    <div className="lp-mockup-stat-card"><h4>Active Jobs</h4><p>342</p></div>
                    <div className="lp-mockup-stat-card"><h4>Events</h4><p>28</p></div>
                  </div>
                  <div className="lp-mockup-chart">
                    {[40, 65, 50, 80, 70, 90, 75, 100, 85, 60, 45, 70].map((h, i) => (
                      <motion.div 
                        key={i} className="lp-mockup-bar" 
                        initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: 0.5 + (i * 0.05) }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements (Layered Depth) */}
              <motion.div 
                className="lp-floating-widget lp-float-1 flex items-center gap-3"
                animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src="https://i.pravatar.cc/40?img=11" alt="Avatar" className="w-10 h-10 rounded-full border border-white/20" />
                <div><p className="text-sm font-bold text-white">New Match!</p><p className="text-xs text-blue-400">Dr. Alex Kim</p></div>
              </motion.div>

              <motion.div 
                className="lp-floating-widget lp-float-2 flex items-center gap-3"
                animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                </div>
                <div><p className="text-sm font-bold text-white">Vercel</p><p className="text-xs text-gray-400">Frontend Engineer</p></div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ━━━━━━━ STATS ━━━━━━━ */}
      <section className="lp-container">
        <div className="lp-stats-grid">
          {stats.map((s, i) => (
            <FadeInSection key={i} delay={i * 0.1} className="lp-stat-item">
              <div className="lp-stat-value lp-gradient-text">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="lp-stat-label">{s.label}</div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ━━━━━━━ FEATURES ━━━━━━━ */}
      <section id="features" className="lp-section lp-container">
        <FadeInSection className="lp-section-header">
          <span className="lp-label">Platform Features</span>
          <h2 className="lp-heading">Everything you need to scale your career</h2>
          <p className="lp-subheading">A complete suite of tools designed to help you connect, learn, and land your next big opportunity.</p>
        </FadeInSection>
        
        <div className="lp-features-grid">
          {features.map((f, i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <motion.div className="lp-glass-card lp-feature-card" whileHover={{ y: -8, borderColor: "rgba(255,255,255,0.2)" }}>
                <div className={`lp-feature-icon bg-gradient-to-br ${f.color}`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ━━━━━━━ HOW IT WORKS ━━━━━━━ */}
      <section id="how-it-works" className="lp-section lp-container">
        <FadeInSection className="lp-section-header">
          <span className="lp-label">Workflow</span>
          <h2 className="lp-heading">Three steps to your next milestone</h2>
        </FadeInSection>
        
        <div className="lp-timeline">
          {[
            { icon: UserCircle, title: "Create Your Identity", desc: "Build a stunning professional profile highlighting your skills, experience, and what you're looking to achieve." },
            { icon: Users, title: "Discover & Connect", desc: "Use our intelligent matching to find mentors, peers, and exclusive job opportunities tailored to your trajectory." },
            { icon: Rocket, title: "Accelerate Growth", desc: "Schedule sessions, attend events, and build long-lasting relationships that propel your career forward." },
          ].map((step, i) => (
            <FadeInSection key={i} delay={i * 0.2} className="lp-timeline-step">
              <div className="lp-step-icon"><step.icon className="w-6 h-6 text-[#4f8cff]" /></div>
              <div className="lp-step-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ━━━━━━━ TESTIMONIALS (AUTO SCROLL) ━━━━━━━ */}
      <section id="testimonials" className="lp-section">
        <FadeInSection className="lp-section-header lp-container">
          <span className="lp-label">Wall of Love</span>
          <h2 className="lp-heading">Trusted by thousands</h2>
        </FadeInSection>
        
        <div className="lp-marquee-container">
          <motion.div 
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="lp-glass-card lp-testimonial-card">
                <div className="lp-stars">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                </div>
                <p className="lp-quote">"{t.quote}"</p>
                <div className="lp-author">
                  <img src={t.avatar} alt={t.name} />
                  <div>
                    <h4>{t.name}</h4>
                    <p>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━ FINAL CTA ━━━━━━━ */}
      <section className="lp-cta-section lp-container">
        <FadeInSection>
          <div className="lp-glass-card lp-cta-inner">
            <h2>Ready to level up?</h2>
            <p>Join the most exclusive alumni network and start building your future today.</p>
            <motion.button 
              onClick={() => navigate("/signup")} 
              className="lp-btn-primary lp-btn-lg inline-flex items-center gap-2" 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </motion.button>
            <p className="text-gray-500 text-sm mt-6">Takes less than 2 minutes. No credit card required.</p>
          </div>
        </FadeInSection>
      </section>

      {/* ━━━━━━━ FOOTER ━━━━━━━ */}
      <footer className="lp-footer lp-container">
        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-[#4f8cff] flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="lp-logo">AlumniLink</span>
            </div>
            <p>The premium platform for alumni engagement, mentorship, and accelerated career growth.</p>
          </div>
          <div className="lp-footer-col">
            <h4>Platform</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#">Pricing</a>
            <a href="#">Security</a>
          </div>
          <div className="lp-footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div className="lp-footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <p>© {new Date().getFullYear()} AlumniLink Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
