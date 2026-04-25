import prisma from "../config/database.js";

// Create job posting
export const createJobPosting = async (userId, jobData) => {
  const { title, description, company, location, salary, jobType, skills, deadline } = jobData;

  const job = await prisma.jobPosting.create({
    data: {
      title,
      description,
      company,
      location,
      salary,
      jobType: jobType || "FULL_TIME",
      skills: JSON.stringify(skills || []),
      postedBy: userId,
      deadline,
    },
    include: {
      poster: {
        select: { id: true, name: true, email: true, company: true },
      },
      applications: true,
    },
  });

  return job;
};

// Get all job postings
export const getAllJobPostings = async (filters = {}) => {
  const where = {};

  if (filters.company) {
    where.company = { contains: filters.company, mode: "insensitive" };
  }

  if (filters.jobType) {
    where.jobType = filters.jobType;
  }

  if (filters.postedBy) {
    where.postedBy = filters.postedBy;
  }

  return await prisma.jobPosting.findMany({
    where,
    include: {
      poster: {
        select: { id: true, name: true, email: true, company: true },
      },
      applications: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// Get job posting by ID
export const getJobPostingById = async (jobId) => {
  return await prisma.jobPosting.findUnique({
    where: { id: jobId },
    include: {
      poster: {
        select: { id: true, name: true, email: true, company: true },
      },
      applications: {
        include: {
          applicant: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });
};

// Update job posting
export const updateJobPosting = async (jobId, updateData) => {
  const { title, description, company, location, salary, jobType, skills, deadline } = updateData;

  const data = {};

  if (title) data.title = title;
  if (description) data.description = description;
  if (company) data.company = company;
  if (location) data.location = location;
  if (salary) data.salary = salary;
  if (jobType) data.jobType = jobType;
  if (skills) data.skills = JSON.stringify(skills);
  if (deadline) data.deadline = deadline;

  return await prisma.jobPosting.update({
    where: { id: jobId },
    data,
    include: {
      poster: {
        select: { id: true, name: true, email: true, company: true },
      },
      applications: true,
    },
  });
};

// Delete job posting
export const deleteJobPosting = async (jobId) => {
  return await prisma.jobPosting.delete({
    where: { id: jobId },
  });
};

// Apply to job
export const applyToJob = async (jobId, userId) => {
  // Check if already applied
  const existingApplication = await prisma.jobApplication.findUnique({
    where: { jobId_userId: { jobId, userId } },
  });

  if (existingApplication) {
    throw new Error("Already applied to this job");
  }

  const application = await prisma.jobApplication.create({
    data: {
      jobId,
      userId,
      status: "PENDING",
    },
    include: {
      job: true,
      applicant: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return application;
};

// Get job applications
export const getJobApplications = async (jobId) => {
  return await prisma.jobApplication.findMany({
    where: { jobId },
    include: {
      applicant: {
        select: { id: true, name: true, email: true },
      },
      job: {
        select: { id: true, title: true, company: true },
      },
    },
    orderBy: { appliedAt: "desc" },
  });
};

// Update application status
export const updateApplicationStatus = async (applicationId, status) => {
  const validStatuses = ["PENDING", "REVIEWED", "REJECTED", "ACCEPTED"];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  return await prisma.jobApplication.update({
    where: { id: applicationId },
    data: { status },
    include: {
      job: {
        select: { id: true, title: true, company: true },
      },
      applicant: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// Get user's job applications
export const getUserApplications = async (userId) => {
  return await prisma.jobApplication.findMany({
    where: { userId },
    include: {
      job: {
        include: {
          poster: {
            select: { id: true, name: true, company: true },
          },
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });
};
