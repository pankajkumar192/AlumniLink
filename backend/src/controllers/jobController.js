import { getAllJobPostings, getJobPostingById, createJobPosting, updateJobPosting, deleteJobPosting, applyToJob, getJobApplications, updateApplicationStatus as updateApplicationStatusService, getUserApplications } from "../services/jobService.js";
import { createNotification } from "../services/notificationService.js";

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const filters = {};
    if (req.query.company) filters.company = req.query.company;
    if (req.query.jobType) filters.jobType = req.query.jobType;

    const jobs = await getAllJobPostings(filters);
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a job posting
// @route   POST /api/jobs
// @access  Private (Alumni/Admin)
export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, jobType, skills, deadline } = req.body;

    if (!title || !description || !company) {
      return res.status(400).json({ success: false, message: "Please provide title, description, and company" });
    }

    const job = await createJobPosting(req.user.id, {
      title,
      description,
      company,
      location,
      salary,
      jobType,
      skills,
      deadline,
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await getJobPostingById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private
export const applyJob = async (req, res) => {
  try {
    const job = await getJobPostingById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const application = await applyToJob(req.params.id, req.user.id);

    // Create notification for job poster
    await createNotification(job.postedBy.id, {
      senderId: req.user.id,
      title: "New Job Application",
      message: `${req.user.name} applied for your job posting: ${job.title}`,
      type: "JOB_APPLICATION",
      relatedId: application.id,
    });

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    if (error.message === "Already applied to this job") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/jobs/applications/:applicationId/status
// @access  Private (Job Poster)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { applicationId } = req.params;

    if (!status) {
      return res.status(400).json({ success: false, message: "Please provide a status" });
    }

    const application = await updateApplicationStatusService(applicationId, status.toUpperCase());

    // Notify the applicant
    await createNotification(application.applicant.id, {
      senderId: req.user.id,
      title: `Application ${status.toUpperCase()}`,
      message: `Your application for ${application.job.title} has been ${status.toLowerCase()}.`,
      type: "SYSTEM",
      relatedId: application.id,
    });

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get job applications
// @route   GET /api/jobs/:jobId/applications
// @access  Private (Job Poster)
export const getJobPostApplications = async (req, res) => {
  try {
    const applications = await getJobApplications(req.params.jobId);
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's job applications
// @route   GET /api/jobs/applications/my
// @access  Private
export const getMyApplications = async (req, res) => {
  try {
    const applications = await getUserApplications(req.user.id);
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
