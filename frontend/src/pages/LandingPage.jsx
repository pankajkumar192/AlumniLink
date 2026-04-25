import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, MessageSquare, Briefcase, Calendar, Clock, Globe,
  Users, ArrowRight, Star, MapPin, ChevronRight, Menu, X,
  UserCircle, TrendingUp, Rocket, Zap, Play, ExternalLink, Video
} from "lucide-react";

/* ─────────────── Animated Section Wrapper ─────────────── */
const FadeInSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
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

/* ─────────────── Feature Data ─────────────── */
const features = [
  { icon: Sparkles, title: "AI Mentor Matching", desc: "Our AI analyzes your goals and matches you with the perfect mentor from our alumni network.", color: "from-blue-500 to-cyan-500" },
  { icon: MessageSquare, title: "Real-time Chat", desc: "Connect instantly with mentors and peers through our built-in encrypted messaging system.", color: "from-purple-500 to-pink-500" },
  { icon: Briefcase, title: "Job Opportunities", desc: "Access exclusive job postings and internships shared directly by our alumni network.", color: "from-emerald-500 to-teal-500" },
  { icon: Calendar, title: "Event Management", desc: "Discover and attend workshops, seminars, career fairs, and networking events.", color: "from-orange-500 to-rose-500" },
  { icon: Clock, title: "Smart Scheduling", desc: "Book 1-on-1 mentorship sessions with integrated calendar and video call links.", color: "from-indigo-500 to-blue-500" },
  { icon: Globe, title: "Alumni Network", desc: "Join a thriving community of 10,000+ alumni and students sharing knowledge.", color: "from-violet-500 to-purple-500" },
];

const testimonials = [
  { name: "Sarah Chen", role: "Software Engineer at Google", quote: "AlumniLink completely transformed my career. I found an amazing mentor who helped me land my dream job at Google.", avatar: "https://i.pravatar.cc/150?img=32" },
  { name: "James Rodriguez", role: "Product Manager at Stripe", quote: "The AI matching is incredibly accurate. Within a week, I was connected with 3 mentors who perfectly aligned with my goals.", avatar: "https://i.pravatar.cc/150?img=53" },
  { name: "Dr. Priya Sharma", role: "VP Engineering at Meta", quote: "As a mentor, this platform makes it effortless to give back. The scheduling and chat features are world-class.", avatar: "https://i.pravatar.cc/150?img=47" },
];

const stats = [
  { value: "10000", suffix: "+", label: "Alumni Connected" },
  { value: "5000", suffix: "+", label: "Active Students" },
  { value: "2000", suffix: "+", label: "Jobs Posted" },
  { value: "500", suffix: "+", label: "Mentorship Sessions" },
];

const mentors = [
  { name: "Dr. Alex Kim", role: "Senior Staff Engineer", company: "Google", skills: ["System Design", "Go", "Kubernetes"], rating: 4.9, avatar: "https://i.pravatar.cc/150?img=11" },
  { name: "Maria Santos", role: "Engineering Manager", company: "Apple", skills: ["Leadership", "iOS", "Swift"], rating: 5.0, avatar: "https://i.pravatar.cc/150?img=26" },
];

const jobs = [
  { title: "Senior Frontend Developer", company: "Vercel", location: "Remote", type: "Full-time", salary: "$150k – $200k" },
  { title: "ML Engineering Intern", company: "OpenAI", location: "San Francisco", type: "Internship", salary: "$8,000/mo" },
];

const events = [
  { title: "Annual Tech Alumni Meetup", date: "MAY 15", location: "Main Campus Auditorium", time: "6:00 PM – 9:00 PM", attendees: 156, capacity: 200 },
  { title: "AI & Machine Learning Workshop", date: "MAY 22", location: "Virtual Event", time: "2:00 PM – 5:00 PM", attendees: 89, capacity: 150 },
  { title: "Career Fair 2025", date: "JUN 01", location: "Convention Center", time: "10:00 AM – 4:00 PM", attendees: 423, capacity: 500 },
];

/* ━━━━━━━━━━━━━━━━━ LANDING PAGE ━━━━━━━━━━━━━━━━━ */
const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        <div className="lp-radial-glow" />
      </div>

      {/* ━━━━━━━ NAVBAR ━━━━━━━ */}
      <nav className={`lp-navbar ${scrolled ? "lp-navbar-scrolled" : ""}`}>
        <div className="lp-navbar-inner">
          <a href="#hero" className="lp-logo">AlumniLink</a>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#mentors">Mentors</a>
            <a href="#jobs">Jobs</a>
            <a href="#events">Events</a>
          </div>
          <div className="lp-nav-actions">
            <button onClick={() => navigate("/login")} className="lp-btn-ghost">Log in</button>
            <motion.button onClick={() => navigate("/signup")} className="lp-btn-primary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              Sign Up Free
            </motion.button>
          </div>
          <button className="lp-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div className="lp-mobile-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#mentors" onClick={() => setMobileMenuOpen(false)}>Mentors</a>
              <a href="#jobs" onClick={() => setMobileMenuOpen(false)}>Jobs</a>
              <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
              <button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }} className="lp-btn-ghost" style={{ width: "100%" }}>Log in</button>
              <button onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }} className="lp-btn-primary" style={{ width: "100%" }}>Sign Up Free</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ━━━━━━━ HERO ━━━━━━━ */}
      <section id="hero" className="lp-hero">
        <div className="lp-hero-content">
          <motion.div className="lp-hero-left" initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <div className="lp-hero-badge">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Alumni Platform</span>
            </div>
            <h1 className="lp-hero-title">
              Connect.<br />
              <span className="lp-gradient-text">Mentor.</span><br />
              Grow.
            </h1>
            <p className="lp-hero-sub">
              The all-in-one alumni engagement platform. Build meaningful connections, find expert mentors, discover career opportunities, and grow together.
            </p>
            <div className="lp-hero-ctas">
              <motion.button onClick={() => navigate("/signup")} className="lp-btn-primary lp-btn-lg" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                Get Started <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button onClick={() => navigate("/login")} className="lp-btn-outline lp-btn-lg" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                Explore Mentors
              </motion.button>
            </div>
            <p className="lp-hero-trust">
              <span className="lp-trust-dot" /> Trusted by <strong>10,000+</strong> alumni worldwide
            </p>
          </motion.div>

          <motion.div className="lp-hero-right" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <div className="lp-dashboard-preview">
              <div className="lp-dashboard-header">
                <div className="lp-dashboard-dots"><span /><span /><span /></div>
                <span className="lp-dashboard-title">AlumniLink Dashboard</span>
              </div>
              <div className="lp-dashboard-body">
                <div className="lp-dash-stat-row">
                  <div className="lp-dash-stat"><span className="lp-dash-stat-num">127</span><span className="lp-dash-stat-label">Mentors</span></div>
                  <div className="lp-dash-stat"><span className="lp-dash-stat-num">58</span><span className="lp-dash-stat-label">Jobs</span></div>
                  <div className="lp-dash-stat"><span className="lp-dash-stat-num">12</span><span className="lp-dash-stat-label">Events</span></div>
                </div>
                <div className="lp-dash-chart">
                  <div className="lp-dash-bar" style={{ height: "40%" }} /><div className="lp-dash-bar" style={{ height: "65%" }} /><div className="lp-dash-bar" style={{ height: "50%" }} /><div className="lp-dash-bar" style={{ height: "80%" }} /><div className="lp-dash-bar" style={{ height: "70%" }} /><div className="lp-dash-bar" style={{ height: "90%" }} /><div className="lp-dash-bar" style={{ height: "75%" }} />
                </div>
              </div>
            </div>
            {/* Floating cards */}
            <motion.div className="lp-float-card lp-float-1" animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <img src="https://i.pravatar.cc/40?img=11" alt="" className="lp-float-avatar" />
              <div><p className="lp-float-name">New Mentor Match</p><p className="lp-float-sub">Dr. Alex Kim</p></div>
            </motion.div>
            <motion.div className="lp-float-card lp-float-2" animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <div><p className="lp-float-name">23 New Jobs</p><p className="lp-float-sub">This week</p></div>
            </motion.div>
            <motion.div className="lp-float-card lp-float-3" animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="lp-float-name">4.9 Rating</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━ FEATURES ━━━━━━━ */}
      <section id="features" className="lp-section">
        <FadeInSection className="lp-section-header">
          <span className="lp-label">FEATURES</span>
          <h2 className="lp-heading">Everything you need to thrive</h2>
          <p className="lp-subheading">From AI-powered matching to real-time collaboration, AlumniLink gives you superpowers.</p>
        </FadeInSection>
        <div className="lp-features-grid">
          {features.map((f, i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <motion.div className="lp-feature-card" whileHover={{ y: -8, transition: { duration: 0.3 } }}>
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
      <section className="lp-section lp-section-alt">
        <FadeInSection className="lp-section-header">
          <span className="lp-label">HOW IT WORKS</span>
          <h2 className="lp-heading">Three steps to your next opportunity</h2>
        </FadeInSection>
        <div className="lp-steps">
          {[
            { num: "01", icon: UserCircle, title: "Create Your Profile", desc: "Sign up and build your professional profile with your skills, experience, and career goals." },
            { num: "02", icon: Users, title: "Connect & Discover", desc: "Find mentors, browse jobs, and join events tailored to your interests and expertise." },
            { num: "03", icon: Rocket, title: "Grow Together", desc: "Build meaningful relationships, advance your career, and give back to the community." },
          ].map((s, i) => (
            <FadeInSection key={i} delay={i * 0.15} className="lp-step">
              <div className="lp-step-num">{s.num}</div>
              <div className="lp-step-icon"><s.icon className="w-8 h-8" /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < 2 && <div className="lp-step-connector" />}
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ━━━━━━━ STATS ━━━━━━━ */}
      <section className="lp-stats-section">
        <div className="lp-stats-grid">
          {stats.map((s, i) => (
            <FadeInSection key={i} delay={i * 0.1} className="lp-stat">
              <div className="lp-stat-value lp-gradient-text">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="lp-stat-label">{s.label}</div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ━━━━━━━ TESTIMONIALS ━━━━━━━ */}
      <section className="lp-section">
        <FadeInSection className="lp-section-header">
          <span className="lp-label">TESTIMONIALS</span>
          <h2 className="lp-heading">Loved by alumni worldwide</h2>
        </FadeInSection>
        <div className="lp-testimonials-grid">
          {testimonials.map((t, i) => (
            <FadeInSection key={i} delay={i * 0.12}>
              <motion.div className="lp-testimonial-card" whileHover={{ y: -6 }}>
                <div className="lp-testimonial-stars">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="lp-testimonial-quote">"{t.quote}"</p>
                <div className="lp-testimonial-author">
                  <img src={t.avatar} alt={t.name} className="lp-testimonial-avatar" />
                  <div>
                    <p className="lp-testimonial-name">{t.name}</p>
                    <p className="lp-testimonial-role">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ━━━━━━━ MENTOR & JOB SHOWCASE ━━━━━━━ */}
      <section id="mentors" className="lp-section lp-section-alt">
        <FadeInSection className="lp-section-header">
          <span className="lp-label">DISCOVER</span>
          <h2 className="lp-heading">Featured mentors & opportunities</h2>
        </FadeInSection>
        <div className="lp-showcase-grid">
          <div className="lp-showcase-col">
            <h3 className="lp-showcase-title"><Users className="w-5 h-5 text-blue-400" /> Top Mentors</h3>
            {mentors.map((m, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <motion.div className="lp-mentor-card" whileHover={{ y: -4 }}>
                  <img src={m.avatar} alt={m.name} className="lp-mentor-avatar" />
                  <div className="lp-mentor-info">
                    <h4>{m.name}</h4>
                    <p>{m.role} at <strong>{m.company}</strong></p>
                    <div className="lp-mentor-skills">
                      {m.skills.map((s, j) => <span key={j} className="lp-skill-tag">{s}</span>)}
                    </div>
                  </div>
                  <div className="lp-mentor-rating"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {m.rating}</div>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
          <div id="jobs" className="lp-showcase-col">
            <h3 className="lp-showcase-title"><Briefcase className="w-5 h-5 text-emerald-400" /> Latest Jobs</h3>
            {jobs.map((j, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <motion.div className="lp-job-card" whileHover={{ y: -4 }}>
                  <div>
                    <h4>{j.title}</h4>
                    <p>{j.company} · {j.location}</p>
                    <div className="lp-job-tags">
                      <span className="lp-job-type">{j.type}</span>
                      <span className="lp-job-salary">{j.salary}</span>
                    </div>
                  </div>
                  <button className="lp-btn-sm">Apply <ExternalLink className="w-3.5 h-3.5" /></button>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━ EVENTS ━━━━━━━ */}
      <section id="events" className="lp-section">
        <FadeInSection className="lp-section-header">
          <span className="lp-label">UPCOMING EVENTS</span>
          <h2 className="lp-heading">Don't miss what's next</h2>
        </FadeInSection>
        <div className="lp-events-grid">
          {events.map((e, i) => (
            <FadeInSection key={i} delay={i * 0.12}>
              <motion.div className="lp-event-card" whileHover={{ y: -6 }}>
                <div className="lp-event-img">
                  <div className="lp-event-date-badge">{e.date}</div>
                </div>
                <div className="lp-event-body">
                  <h4>{e.title}</h4>
                  <div className="lp-event-meta">
                    <span><MapPin className="w-4 h-4" /> {e.location}</span>
                    <span><Clock className="w-4 h-4" /> {e.time}</span>
                    <span><Users className="w-4 h-4" /> {e.attendees}/{e.capacity}</span>
                  </div>
                  <motion.button className="lp-btn-primary lp-btn-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Reserve Spot
                  </motion.button>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ━━━━━━━ FINAL CTA ━━━━━━━ */}
      <section className="lp-cta-section">
        <FadeInSection className="lp-cta-inner">
          <div className="lp-cta-glow" />
          <h2>Start your journey today</h2>
          <p>Join 10,000+ alumni and students building meaningful connections.</p>
          <motion.button onClick={() => navigate("/signup")} className="lp-btn-primary lp-btn-xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Join AlumniLink <ArrowRight className="w-6 h-6" />
          </motion.button>
          <span className="lp-cta-fine">Free forever. No credit card required.</span>
        </FadeInSection>
      </section>

      {/* ━━━━━━━ FOOTER ━━━━━━━ */}
      <footer className="lp-footer">
        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <span className="lp-logo">AlumniLink</span>
            <p>The all-in-one platform for alumni engagement, mentorship, and career growth.</p>
          </div>
          <div className="lp-footer-col"><h4>Product</h4><a href="#features">Features</a><a href="#mentors">Mentors</a><a href="#jobs">Jobs</a><a href="#events">Events</a></div>
          <div className="lp-footer-col"><h4>Company</h4><a href="#">About</a><a href="#">Blog</a><a href="#">Careers</a><a href="#">Press</a></div>
          <div className="lp-footer-col"><h4>Legal</h4><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div>
        </div>
        <div className="lp-footer-bottom">
          <span>© 2025 AlumniLink. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
