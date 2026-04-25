import prisma from "../config/database.js";

export const getMeetings = async (req, res) => {
  try {
    const isMentor = req.user.isMentor;
    let meetings = [];
    
    if (isMentor) {
      const mentor = await prisma.mentor.findUnique({ where: { userId: req.user.id } });
      if (mentor) {
        const mentorMeetings = await prisma.meeting.findMany({
          where: { mentorId: mentor.id },
          include: { student: { select: { id: true, name: true, avatar: true } } },
          orderBy: { date: 'asc' }
        });
        
        // Also fetch meetings where this mentor is a student (acting as a user)
        const studentMeetings = await prisma.meeting.findMany({
          where: { studentId: req.user.id },
          include: { mentor: { include: { user: { select: { id: true, name: true, avatar: true } } } } },
          orderBy: { date: 'asc' }
        });
        meetings = [...mentorMeetings, ...studentMeetings];
      }
    } else {
      meetings = await prisma.meeting.findMany({
        where: { studentId: req.user.id },
        include: { mentor: { include: { user: { select: { id: true, name: true, avatar: true } } } } },
        orderBy: { date: 'asc' }
      });
    }

    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMeeting = async (req, res) => {
  try {
    const { mentorId, date, title, duration } = req.body;
    
    if (!mentorId || !date || !title) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Generate mock video link
    const link = `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;

    const meeting = await prisma.meeting.create({
      data: {
        studentId: req.user.id,
        mentorId: parseInt(mentorId),
        date: new Date(date),
        title,
        duration: parseInt(duration) || 30,
        link
      }
    });

    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
