import prisma from "../config/database.js";

// Create mentorship request
export const createMentorshipRequest = async (studentId, mentorId, requestData) => {
  const { subject, message } = requestData;

  // Check if mentor exists
  const mentor = await prisma.mentor.findUnique({
    where: { id: mentorId },
  });

  if (!mentor) {
    throw new Error("Mentor not found");
  }

  // Create mentorship request
  const request = await prisma.mentorshipRequest.create({
    data: {
      studentId,
      mentorId,
      subject,
      message,
      status: "PENDING",
    },
    include: {
      student: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      mentor: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
    },
  });

  return request;
};

// Get mentorship requests for mentor
export const getMentorshipRequestsForMentor = async (mentorId) => {
  return await prisma.mentorshipRequest.findMany({
    where: { mentorId },
    include: {
      student: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      mentor: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// Get mentorship requests for student
export const getMentorshipRequestsForStudent = async (studentId) => {
  return await prisma.mentorshipRequest.findMany({
    where: { studentId },
    include: {
      student: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      mentor: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// Get mentorship request by ID
export const getMentorshipRequestById = async (requestId) => {
  return await prisma.mentorshipRequest.findUnique({
    where: { id: requestId },
    include: {
      student: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      mentor: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
    },
  });
};

// Update mentorship request status
export const updateMentorshipRequestStatus = async (requestId, status, additionalData = {}) => {
  const validStatuses = ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED"];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const updateData = { status, ...additionalData };

  return await prisma.mentorshipRequest.update({
    where: { id: requestId },
    data: updateData,
    include: {
      student: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      mentor: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
    },
  });
};

// Get all mentorship requests
export const getAllMentorshipRequests = async (filters = {}) => {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  return await prisma.mentorshipRequest.findMany({
    where,
    include: {
      student: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      mentor: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
