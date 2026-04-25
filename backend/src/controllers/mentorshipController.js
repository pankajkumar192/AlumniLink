import { createMentorshipRequest as createMentorshipRequestService, getMentorshipRequestsForStudent, getMentorshipRequestsForMentor, updateMentorshipRequestStatus } from "../services/mentorshipService.js";
import { createNotification } from "../services/notificationService.js";

// Create mentorship request
const createMentorshipRequest = async (req, res) => {
  try {
    const { mentorId, subject, message } = req.body;

    if (!mentorId || !subject) {
      return res.status(400).json({ success: false, message: "Please provide mentorId and subject" });
    }

    const mentorshipRequest = await createMentorshipRequestService(req.user.id, mentorId, {
      subject,
      message,
    });

    // Create notification for mentor
    await createNotification(mentorshipRequest.mentor.userId, {
      senderId: req.user.id,
      title: "New Mentorship Request",
      message: `${req.user.name} sent you a mentorship request.`,
      type: "MENTORSHIP_REQUEST",
      relatedId: mentorshipRequest.id,
    });

    res.status(201).json({ success: true, data: mentorshipRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all mentorship requests
const getMentorshipRequests = async (req, res) => {
  try {
    const prisma = (await import("../config/database.js")).default;
    
    // Get requests where user is student
    const studentRequests = await getMentorshipRequestsForStudent(req.user.id);
    
    // Get requests where user is mentor
    let mentorRequests = [];
    const mentor = await prisma.mentor.findUnique({
      where: { userId: req.user.id }
    });
    
    if (mentor) {
      mentorRequests = await getMentorshipRequestsForMentor(mentor.id);
    }

    // Combine and remove duplicates
    const allRequests = [...studentRequests, ...mentorRequests];
    const uniqueRequests = [...new Map(allRequests.map(r => [r.id, r])).values()];

    res.status(200).json({ success: true, data: uniqueRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update mentorship request status
const updateMentorshipRequest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Please provide a status" });
    }

    const mentorshipRequest = await updateMentorshipRequestStatus(parseInt(req.params.id), status.toUpperCase());

    // Notify the student
    if (status.toUpperCase() === "ACCEPTED" || status.toUpperCase() === "REJECTED") {
      await createNotification(mentorshipRequest.studentId, {
        senderId: req.user.id,
        title: `Mentorship Request ${status.toUpperCase()}`,
        message: `Your mentorship request has been ${status.toLowerCase()}.`,
        type: "SYSTEM",
        relatedId: mentorshipRequest.id,
      });
    }

    res.status(200).json({ success: true, data: mentorshipRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export { createMentorshipRequest, getMentorshipRequests, updateMentorshipRequest };
