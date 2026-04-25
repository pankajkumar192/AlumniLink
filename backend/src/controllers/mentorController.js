import { getAllMentors, getMentorById as getMentorByIdService, createMentorProfile, updateMentorProfile as updateMentorProfileService, getMentorsBySkill } from "../services/mentorService.js";

// Get all mentors
const getMentors = async (req, res) => {
  try {
    const mentors = await getAllMentors();
    res.status(200).json({ success: true, data: mentors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get mentor by ID
const getMentorById = async (req, res) => {
  try {
    const mentor = await getMentorByIdService(req.params.id);

    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor not found" });
    }

    res.status(200).json({ success: true, data: mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create mentor profile
const createMentor = async (req, res) => {
  try {
    const { company, skills, availability, hourlyRate } = req.body;

    if (!company || !skills || !availability) {
      return res.status(400).json({ success: false, message: "Please provide company, skills, and availability" });
    }

    const mentor = await createMentorProfile(req.user.id, {
      company,
      skills,
      availability,
      hourlyRate,
    });

    res.status(201).json({ success: true, data: mentor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update mentor profile
const updateMentorProfile = async (req, res) => {
  try {
    const { company, skills, availability, hourlyRate } = req.body;

    // First get the mentor ID from the user ID
    const prisma = (await import("../config/database.js")).default;
    const mentor = await prisma.mentor.findUnique({
      where: { userId: req.user.id },
    });

    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor profile not found" });
    }

    const updatedMentor = await updateMentorProfileService(mentor.id, {
      company,
      skills,
      availability,
      hourlyRate,
    });

    res.status(200).json({ success: true, data: updatedMentor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search mentors by skill
const searchMentorsBySkill = async (req, res) => {
  try {
    const { skill } = req.query;

    if (!skill) {
      return res.status(400).json({ success: false, message: "Please provide a skill to search" });
    }

    const mentors = await getMentorsBySkill(skill);
    res.status(200).json({ success: true, data: mentors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getMentors, getMentorById, createMentor, updateMentorProfile, searchMentorsBySkill };
