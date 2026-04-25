import prisma from "../config/database.js";

// Create mentor profile
export const createMentorProfile = async (userId, mentorData) => {
  const { company, skills, availability, hourlyRate } = mentorData;

  // Check if mentor profile already exists
  const existingMentor = await prisma.mentor.findUnique({
    where: { userId },
  });

  if (existingMentor) {
    throw new Error("Mentor profile already exists for this user");
  }

  // Create mentor profile
  const mentor = await prisma.mentor.create({
    data: {
      userId,
      company,
      skills: JSON.stringify(skills || []),
      availability,
      hourlyRate,
    },
  });

  // Update user to mark as mentor
  await prisma.user.update({
    where: { id: userId },
    data: { isMentor: true },
  });

  return mentor;
};

// Get all mentors
export const getAllMentors = async () => {
  return await prisma.mentor.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          company: true,
          position: true,
          mentorRating: true,
        },
      },
    },
  });
};

// Get mentor by ID
export const getMentorById = async (mentorId) => {
  return await prisma.mentor.findUnique({
    where: { id: mentorId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          company: true,
          position: true,
          mentorRating: true,
        },
      },
    },
  });
};

// Get mentor by user ID
export const getMentorByUserId = async (userId) => {
  return await prisma.mentor.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          company: true,
          position: true,
          mentorRating: true,
        },
      },
    },
  });
};

// Update mentor profile
export const updateMentorProfile = async (mentorId, updateData) => {
  const { company, skills, availability, hourlyRate } = updateData;

  const updatedData = {};

  if (company) updatedData.company = company;
  if (skills) updatedData.skills = JSON.stringify(skills);
  if (availability) updatedData.availability = availability;
  if (hourlyRate) updatedData.hourlyRate = hourlyRate;

  return await prisma.mentor.update({
    where: { id: mentorId },
    data: updatedData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          company: true,
          position: true,
          mentorRating: true,
        },
      },
    },
  });
};

// Get mentors by skill
export const getMentorsBySkill = async (skill) => {
  const mentors = await prisma.mentor.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          company: true,
          position: true,
          mentorRating: true,
        },
      },
    },
  });

  // Filter by skill (skills are stored as JSON string)
  return mentors.filter((mentor) => {
    const skills = JSON.parse(mentor.skills || "[]");
    return skills.some(s => s.toLowerCase().includes(skill.toLowerCase()));
  });
};
