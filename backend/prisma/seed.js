import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const COLLEGES = ["SRM Institute of Science and Technology", "VIT Vellore", "IIT Madras", "Anna University", "NIT Trichy", "BITS Pilani"];
const COMPANIES = ["TCS", "Infosys", "Wipro", "HCL", "Accenture India", "Flipkart", "Zomato", "Paytm", "Google India", "Microsoft India", "Amazon India", "Zoho"];
const LOCATIONS = ["Chennai", "Bangalore", "Hyderabad", "Mumbai", "Delhi", "Pune", "Gurgaon", "Noida"];
const SKILLS = ["React", "Node.js", "Python", "Java", "C++", "DSA", "System Design", "AWS", "SQL", "MongoDB", "Express", "Tailwind CSS", "Machine Learning", "Data Engineering"];

const NAMES_MALE = ["Pankaj Kumar", "Rahul Sharma", "Arjun Patel", "Aditya Iyer", "Vikram Singh", "Siddharth Rao", "Karthik Natarajan", "Rohan Gupta", "Nitin Desai", "Suresh Menon", "Pranav Reddy", "Aman Verma", "Deepak Chaurasia", "Mohit Agarwal", "Kunal Shah"];
const NAMES_FEMALE = ["Priya Verma", "Ananya Singh", "Sneha Joshi", "Kavya Krishnan", "Neha Kapoor", "Megha Nair", "Pooja Hegde", "Shruti Hassan", "Divya Deshmukh", "Anjali Tiwari", "Rhea Chakraborty", "Ritu Phogat", "Swati Maliwal", "Simran Kaur", "Nidhi Razdan"];
const ALL_NAMES = [...NAMES_MALE, ...NAMES_FEMALE];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log("Cleaning up existing data...");
  await prisma.eventAttendee.deleteMany();
  await prisma.event.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.mentorshipRequest.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.post.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding database with realistic Indian-context data...");

  const defaultPassword = await bcrypt.hash("password123", 10);
  const users = [];
  const mentors = [];

  const firstNames = ["Pankaj", "Rahul", "Arjun", "Aditya", "Vikram", "Siddharth", "Karthik", "Rohan", "Nitin", "Suresh", "Pranav", "Aman", "Deepak", "Mohit", "Kunal", "Priya", "Ananya", "Sneha", "Kavya", "Neha", "Megha", "Pooja", "Shruti", "Divya", "Anjali", "Rhea", "Ritu", "Swati", "Simran", "Nidhi"];
  const lastNames = ["Kumar", "Sharma", "Patel", "Iyer", "Singh", "Rao", "Natarajan", "Gupta", "Desai", "Menon", "Reddy", "Verma", "Chaurasia", "Agarwal", "Shah", "Joshi", "Krishnan", "Kapoor", "Nair", "Hegde", "Hassan", "Deshmukh", "Tiwari", "Chakraborty", "Phogat", "Maliwal", "Kaur", "Razdan"];

  // Generate 60 Users (3 Admins, 25 Alumni/Mentors, 32 Students)
  for (let i = 0; i < 60; i++) {
    const name = `${randomChoice(firstNames)} ${randomChoice(lastNames)}`;
    let role = "STUDENT";
    let isMentor = false;
    let company = null;
    let graduationYear = 2025 + Math.floor(Math.random() * 3);
    
    if (i < 3) {
      role = "ADMIN";
      company = "AlumniLink Staff";
      graduationYear = 2010 + Math.floor(Math.random() * 8);
    } else if (i < 28) {
      role = "ALUMNI";
      isMentor = true;
      company = randomChoice(COMPANIES);
      graduationYear = 2015 + Math.floor(Math.random() * 8);
    }

    const email = `${name.toLowerCase().replace(" ", ".")}.${i}@${role === 'ALUMNI' ? 'gmail.com' : 'alumnilink.edu.in'}`;
    const userSkills = [];
    for(let j=0; j < 4; j++) userSkills.push(randomChoice(SKILLS));

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: defaultPassword,
        role,
        company,
        position: role === 'ALUMNI' ? randomChoice(["SDE I", "SDE II", "Data Analyst", "Product Manager", "UI/UX Designer"]) : "Student",
        university: randomChoice(COLLEGES),
        graduationYear,
        skills: JSON.stringify([...new Set(userSkills)]),
        isVerified: true,
        isMentor,
        avatar: `https://i.pravatar.cc/150?u=${i}`,
        bio: `Hi, I am ${name}. Passionate about technology and learning.`,
      }
    });
    users.push(user);

    if (isMentor) {
      const mentor = await prisma.mentor.create({
        data: {
          userId: user.id,
          company: company,
          skills: JSON.stringify([...new Set(userSkills)]),
          availability: randomChoice(["weekends", "evenings", "flexible"]),
          hourlyRate: 0,
        }
      });
      mentors.push(mentor);
    }
  }

  const students = users.filter(u => u.role === "STUDENT");
  const alumni = users.filter(u => u.role === "ALUMNI");

  console.log("Users created. Generating mentorship requests...");

  for (const student of students) {
    const requestCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < requestCount; i++) {
      const mentorUser = randomChoice(alumni);
      const mentorObj = mentors.find(m => m.userId === mentorUser.id);
      
      if (!mentorObj) continue;

      const statuses = ["PENDING", "ACCEPTED", "COMPLETED", "REJECTED"];
      const status = randomChoice(statuses);

      await prisma.mentorshipRequest.create({
        data: {
          studentId: student.id,
          mentorId: mentorObj.id,
          subject: `Guidance on ${randomChoice(SKILLS)}`,
          message: `Hi ${mentorUser.name.split(' ')[0]} sir, I am preparing for placements, can you guide me?`,
          status: status,
        }
      });
    }
  }

  console.log("Generating jobs...");
  const jobs = [];
  for (let i = 0; i < 15; i++) {
    const poster = randomChoice(alumni);
    const job = await prisma.jobPosting.create({
      data: {
        title: randomChoice(["Software Development Engineer I", "Frontend Developer", "Backend Engineer", "Data Analyst", "Product Manager", "Machine Learning Engineer"]),
        company: poster.company || "TCS",
        location: randomChoice(LOCATIONS),
        salary: randomChoice(["8-12 LPA", "12-18 LPA", "15-25 LPA", "20-30 LPA"]),
        description: "We are looking for a passionate candidate to join our team. You will be working on scalable systems and high-impact projects.",
        postedBy: poster.id,
        skills: JSON.stringify([randomChoice(SKILLS), randomChoice(SKILLS)]),
      }
    });
    jobs.push(job);
  }

  console.log("Generating events...");
  for (let i = 0; i < 10; i++) {
    const organizer = randomChoice(users.filter(u => u.role !== "STUDENT"));
    const event = await prisma.event.create({
      data: {
        title: `Tech Talk: ${randomChoice(SKILLS)} in Production`,
        description: "Join us for an exciting session. Connect with industry experts, network with peers, and learn about the latest trends.",
        date: randomDate(new Date(2024, 0, 1), new Date(2025, 11, 31)),
        location: randomChoice(LOCATIONS),
        eventType: randomChoice(["NETWORKING", "WORKSHOP", "SEMINAR", "CAREER_FAIR"]),
        organizerId: organizer.id,
        capacity: 100
      }
    });

    const numAttendees = 5 + Math.floor(Math.random() * 10);
    for (let j = 0; j < numAttendees; j++) {
      const attendee = randomChoice(users);
      try {
        await prisma.eventAttendee.create({
          data: {
            eventId: event.id,
            userId: attendee.id
          }
        });
      } catch (e) {
        // Ignore unique constraint violations if same user selected twice
      }
    }
  }

  console.log("Generating job applications for students...");
  for (const job of jobs) {
    const numApps = 2 + Math.floor(Math.random() * 5);
    for (let j = 0; j < numApps; j++) {
      const applicant = randomChoice(students);
      try {
        await prisma.jobApplication.create({
          data: {
            jobId: job.id,
            userId: applicant.id,
            status: randomChoice(["PENDING", "REVIEWED", "REJECTED", "ACCEPTED"])
          }
        });
      } catch (e) {
        // Ignore unique constraint
      }
    }
  }

  console.log("Generating community posts, comments, and likes...");
  for (let i = 0; i < 20; i++) {
    const author = randomChoice(users);
    const post = await prisma.post.create({
      data: {
        userId: author.id,
        content: author.role === "STUDENT" 
          ? `Just finished a new project using ${randomChoice(SKILLS)}. Would love some feedback from the community! #learning #tech`
          : `We are looking for freshers skilled in ${randomChoice(SKILLS)} at ${author.company || 'our company'}. Feel free to DM!`,
      }
    });

    const numComments = Math.floor(Math.random() * 5);
    for (let j = 0; j < numComments; j++) {
      const commenter = randomChoice(users);
      await prisma.comment.create({
        data: {
          postId: post.id,
          userId: commenter.id,
          content: randomChoice(["Great work!", "Interested, please check DM.", "Awesome project, keep it up!", "Would love to know more."])
        }
      });
    }

    const numLikes = Math.floor(Math.random() * 15);
    for (let j = 0; j < numLikes; j++) {
      const liker = randomChoice(users);
      try {
        await prisma.like.create({
          data: {
            postId: post.id,
            userId: liker.id
          }
        });
      } catch(e) {}
    }
  }

  console.log("Generating scheduled meetings between mentors and students...");
  for (let i = 0; i < 15; i++) {
    const student = randomChoice(students);
    const mentorUser = randomChoice(alumni);
    const mentorObj = mentors.find(m => m.userId === mentorUser.id);
    if (!mentorObj) continue;

    await prisma.meeting.create({
      data: {
        studentId: student.id,
        mentorId: mentorObj.id,
        title: `Resume Review & ${randomChoice(SKILLS)} Mock Interview`,
        date: randomDate(new Date(), new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)), // Next 14 days
        duration: randomChoice([30, 45, 60]),
        link: "https://meet.google.com/abc-defg-hij",
        status: randomChoice(["SCHEDULED", "COMPLETED"])
      }
    });
  }

  console.log("Generating chat messages...");
  for (let i = 0; i < 15; i++) {
    const u1 = randomChoice(users);
    let u2 = randomChoice(users);
    while (u1.id === u2.id) u2 = randomChoice(users);

    let conversation;
    try {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: Math.min(u1.id, u2.id),
          user2Id: Math.max(u1.id, u2.id),
        }
      });
    } catch (e) {
      continue;
    }

    const msgCount = 4 + Math.floor(Math.random() * 6);
    for (let j = 0; j < msgCount; j++) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: j % 2 === 0 ? u1.id : u2.id,
          content: j === 0 ? "Hi, could we connect?" : (j === 1 ? "Sure! Happy to help." : "Thanks! Do you have any tips for interviews?"),
          isRead: true
        }
      });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
