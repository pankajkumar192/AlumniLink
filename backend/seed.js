import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const seedData = async () => {
  try {
    console.log('Clearing existing data...');
    // Delete in reverse order of dependencies
    await prisma.notification.deleteMany();
    await prisma.eventAttendee.deleteMany();
    await prisma.jobApplication.deleteMany();
    await prisma.mentorshipRequest.deleteMany();
    await prisma.event.deleteMany();
    await prisma.jobPosting.deleteMany();
    await prisma.mentor.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('Existing data cleared.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    console.log('Creating users...');
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@alumnilink.com',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true
      }
    });

    const mentorUser = await prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@alumnilink.com',
        password: hashedPassword,
        role: 'ALUMNI',
        isVerified: true,
        isMentor: true,
        company: 'Tech Giant Inc',
        position: 'Senior Staff Engineer',
        mentorBio: 'I love mentoring junior developers and discussing system design.',
        mentorRating: 4.9,
        skills: JSON.stringify(['System Design', 'Node.js', 'React']),
        mentor: {
          create: {
            company: 'Tech Giant Inc',
            skills: JSON.stringify(['System Design', 'Node.js', 'React']),
            availability: 'weekends',
            hourlyRate: 50
          }
        }
      }
    });
    console.log('Users created.');

    console.log('Creating jobs...');
    await prisma.jobPosting.create({
      data: {
        title: 'Frontend Developer',
        description: 'We are looking for a skilled Frontend Developer to join our team.',
        company: 'InnovateTech',
        location: 'New York, NY (Hybrid)',
        salary: '$110,000 - $140,000',
        jobType: 'FULL_TIME',
        skills: JSON.stringify(['React', 'JavaScript', 'CSS']),
        postedBy: mentorUser.id
      }
    });

    await prisma.jobPosting.create({
      data: {
        title: 'Backend Engineer Intern',
        description: 'Join us for a 3-month summer internship working on our core API.',
        company: 'Startup Co.',
        location: 'Remote',
        salary: '$30/hr',
        jobType: 'INTERNSHIP',
        skills: JSON.stringify(['Node.js', 'MySQL', 'Express']),
        postedBy: adminUser.id
      }
    });
    console.log('Jobs created.');

    console.log('Creating events...');
    await prisma.event.create({
      data: {
        title: 'Annual Tech Symposium 2026',
        description: 'A gathering of alumni to discuss the future of AI and Web Development.',
        date: new Date('2026-06-15T10:00:00Z'),
        location: 'Main Campus Auditorium',
        eventType: 'SEMINAR',
        organizerId: adminUser.id,
        capacity: 500,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
      }
    });

    await prisma.event.create({
      data: {
        title: 'Virtual Networking Night',
        description: 'Connect with fellow alumni and industry leaders.',
        date: new Date('2026-05-20T18:00:00Z'),
        location: 'Online (Zoom)',
        eventType: 'NETWORKING',
        organizerId: mentorUser.id,
        capacity: 100,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
      }
    });
    console.log('Events created.');

    console.log('Data Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedData();
