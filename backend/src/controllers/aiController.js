import prisma from "../config/database.js";

// Mock AI Engine for generating professional text
export const generateText = async (req, res) => {
  try {
    const { prompt, type } = req.body;
    
    // Simulate AI network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let generatedText = "";

    if (type === "job") {
      generatedText = `We are looking for a highly skilled and motivated ${prompt || "candidate"} to join our dynamic team. The ideal candidate will have strong problem-solving abilities, a passion for innovation, and the ability to work collaboratively in a fast-paced environment. \n\nKey Responsibilities:\n- Lead the design and implementation of core features.\n- Collaborate with cross-functional teams to define requirements.\n- Maintain high standards of code quality and performance.\n\nRequirements:\n- Proven experience in relevant technologies.\n- Excellent communication and teamwork skills.\n- Bachelor's degree or equivalent practical experience.`;
    } else if (type === "event") {
      generatedText = `Join us for an exclusive ${prompt || "networking event"} tailored for our alumni community! This is a fantastic opportunity to connect with industry leaders, share insights, and build meaningful professional relationships. \n\nWhat to expect:\n- Inspiring keynote sessions.\n- Interactive Q&A panels.\n- Dedicated networking opportunities to expand your connections.\n\nDon't miss out on this chance to accelerate your career!`;
    } else if (type === "bio") {
      generatedText = `Passionate professional with a proven track record of driving impact. I specialize in leveraging technology to solve complex problems and am constantly seeking new challenges to grow my skill set. When I'm not working, I enjoy mentoring others and contributing to the tech community.`;
    } else {
      generatedText = "Please specify a valid generation type.";
    }

    res.status(200).json({ success: true, data: generatedText });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// AI Engine for Mentor Matchmaking
export const matchMentors = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    
    const allMentors = await prisma.mentor.findMany({
      include: { user: { select: { name: true, avatar: true, position: true, company: true } } }
    });

    if (!student.skills && !student.interests) {
      return res.status(200).json({ success: true, data: allMentors.slice(0, 3) });
    }

    // Basic matching algorithm based on overlapping skills/interests strings
    const studentKeywords = `${student.skills} ${student.interests} ${student.bio}`.toLowerCase();
    
    const scoredMentors = allMentors.map(mentor => {
      let score = 0;
      const mentorKeywords = `${mentor.skills} ${mentor.company} ${mentor.user.position}`.toLowerCase();
      
      const sWords = studentKeywords.split(/[\s,]+/);
      sWords.forEach(word => {
        if (word.length > 3 && mentorKeywords.includes(word)) {
          score += 10;
        }
      });

      return { ...mentor, matchScore: score };
    });

    scoredMentors.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({ success: true, data: scoredMentors.slice(0, 5) }); // Top 5 matches
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
