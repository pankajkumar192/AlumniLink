import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, DollarSign, Clock, ExternalLink, Loader2, Users, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { jobAPI, aiAPI } from "../utils/api";
import useAuthStore from "../store/authStore";

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "", company: "", location: "", jobType: "full-time", salary: "", description: "", skills: "",
  });

  const [manageJob, setManageJob] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const user = useAuthStore((state) => state.user);

  const fetchJobs = async () => {
    try {
      const { data } = await jobAPI.getJobs();
      setJobs(data.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (id) => {
    try {
      setApplyingId(id);
      await jobAPI.applyForJob(id);
      await fetchJobs();
    } catch (error) {
      console.error("Error applying for job:", error);
      alert(error.response?.data?.message || "Error applying for job");
    } finally {
      setApplyingId(null);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    try {
      await jobAPI.createJob({
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setShowPostModal(false);
      setFormData({
        title: "", company: "", location: "", jobType: "full-time", salary: "", description: "", skills: "",
      });
      fetchJobs();
    } catch (error) {
      console.error("Error posting job:", error);
      alert(error.response?.data?.message || "Error posting job");
    } finally {
      setIsPosting(false);
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data } = await aiAPI.generateText(formData.title, "job");
      setFormData(prev => ({ ...prev, description: data.data }));
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateStatus = async (jobId, userId, status) => {
    try {
      setStatusUpdating(userId);
      await jobAPI.updateApplicationStatus(jobId, userId, status);
      await fetchJobs();
      // Update the local state of manageJob so the modal reflects the change immediately
      setManageJob(prev => ({
        ...prev,
        applications: prev.applications.map(app => 
          app.userId.id === userId ? { ...app, status } : app
        )
      }));
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || "Error updating status");
    } finally {
      setStatusUpdating(null);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div className="space-y-10" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="glass-card p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
              Job <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Opportunities</span>
            </h1>
            <p className="text-gray-400 text-lg">Exclusive roles posted by our alumni network.</p>
          </div>
          {user?.role !== "student" && (
            <motion.button
              onClick={() => setShowPostModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-7 py-3.5 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] shrink-0"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              <Briefcase className="w-5 h-5" />
              Post a Job
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Jobs List */}
      <motion.div className="space-y-5" variants={containerVariants}>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 glass-card">
            <Briefcase className="w-16 h-16 text-gray-500 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-gray-300">No Jobs Found</h3>
            <p className="text-gray-500">Check back later for new opportunities.</p>
          </div>
        ) : jobs.map((job) => {
          const hasApplied = job.applications?.some(app => app.userId?.id === (user?.id || user?.id) || app.userId === (user?.id || user?.id));
          const isOwner = job.postedBy?.id === (user?.id || user?.id) || job.postedBy === (user?.id || user?.id);
          
          return (
            <motion.div
              key={job.id}
              className="glass-card p-8 group border border-white/5 hover:border-emerald-500/25 transition-all duration-500 relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="flex items-start justify-between mb-5 relative z-10">
                <div>
                  <h3 className="text-2xl font-bold mb-1.5 group-hover:text-emerald-300 transition-colors tracking-tight">{job.title}</h3>
                  <p className="text-blue-400 font-semibold text-lg">{job.company}</p>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-300 px-4 py-2 rounded-full border border-emerald-500/25 font-bold uppercase tracking-wider shrink-0 ml-4">
                  {job.jobType || "Full-time"}
                </span>
              </div>

              <p className="text-gray-400 mb-6 leading-relaxed relative z-10">{job.description}</p>

              {/* Job Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 pb-5 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">{job.location || "Remote"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">{job.salary || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                {isOwner && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">{job.applications?.length || 0} Applicants</span>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                {(typeof job.skills === 'string' ? JSON.parse(job.skills || "[]") : (job.skills || [])).map((skill, i) => (
                  <span key={i} className="text-xs bg-emerald-500/10 text-emerald-300 px-3 py-2 rounded-full border border-emerald-500/20 font-semibold hover:bg-emerald-500/20 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="relative z-10">
              {isOwner ? (
                <motion.button
                  onClick={() => setManageJob(job)}
                  className="w-full font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30 hover:border-blue-500/50 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Users className="w-4 h-4" />
                  Manage Applications ({job.applications?.length || 0})
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => handleApply(job.id)}
                  disabled={applyingId === job.id || hasApplied}
                  className={`w-full font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm ${
                    hasApplied
                      ? "bg-emerald-500/15 text-emerald-400 cursor-not-allowed border border-emerald-500/25"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-glow-primary hover:shadow-glow-secondary"
                  }`}
                  whileHover={hasApplied ? {} : { scale: 1.02 }}
                  whileTap={hasApplied ? {} : { scale: 0.98 }}
                >
                  {applyingId === job.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : hasApplied ? (
                    "✓ Applied Successfully"
                  ) : (
                    <>
                      Apply Now
                      <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Post Job Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">Post a New Job</h2>
                <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-white transition bg-white/5 p-2 rounded-full hover:bg-red-500/20 hover:text-red-400">✕</button>
              </div>

              <form onSubmit={handlePostJob} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
                    <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-focus w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" placeholder="e.g. Senior Frontend Developer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                    <input required type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="input-focus w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" placeholder="e.g. Google" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="input-focus w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" placeholder="e.g. Remote, San Francisco" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Salary</label>
                    <input type="text" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className="input-focus w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" placeholder="e.g. $120k - $150k" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Job Type</label>
                  <select value={formData.jobType} onChange={(e) => setFormData({ ...formData, jobType: e.target.value })} className="input-focus w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2.5 text-white">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Skills (comma separated)</label>
                  <input type="text" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} className="input-focus w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" placeholder="e.g. React, Node.js, TypeScript" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <button
                      type="button"
                      onClick={handleAIGenerate}
                      disabled={isGenerating || !formData.title}
                      className="text-xs font-bold bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Write with AI
                    </button>
                  </div>
                  <textarea required rows="4" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-focus w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white" placeholder="Describe the role..." />
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setShowPostModal(false)} className="px-6 py-2.5 rounded-lg text-gray-300 hover:bg-white/10 transition font-medium">Cancel</button>
                  <button type="submit" disabled={isPosting} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-2.5 rounded-lg font-semibold transition flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    {isPosting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Job"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Applications Modal */}
      <AnimatePresence>
        {manageJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Manage Applications</h2>
                  <p className="text-gray-400 mt-1">For: {manageJob.title}</p>
                </div>
                <button onClick={() => setManageJob(null)} className="text-gray-400 hover:text-white transition bg-white/5 p-2 rounded-full hover:bg-red-500/20 hover:text-red-400">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {!manageJob.applications || manageJob.applications.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-white/5 rounded-xl border border-white/5">
                    No applications received yet.
                  </div>
                ) : (
                  manageJob.applications.map((app) => (
                    <div key={app.id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <img 
                          src={app.userId?.avatar || "https://i.pravatar.cc/150"} 
                          alt="Applicant" 
                          className="w-12 h-12 rounded-full border border-white/20"
                        />
                        <div>
                          <h4 className="font-bold">{app.userId?.name || "Unknown User"}</h4>
                          <p className="text-sm text-gray-400">{app.userId?.email}</p>
                          <p className="text-xs text-gray-500 mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        {app.status === "pending" || app.status === "reviewed" ? (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(manageJob.id, app.userId.id, "accepted")}
                              disabled={statusUpdating === app.userId.id}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition"
                            >
                              {statusUpdating === app.userId.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(manageJob.id, app.userId.id, "rejected")}
                              disabled={statusUpdating === app.userId.id}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition"
                            >
                              {statusUpdating === app.userId.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border capitalize ${
                            app.status === "accepted" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"
                          }`}>
                            {app.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JobPostings;
