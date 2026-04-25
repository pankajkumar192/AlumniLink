#!/usr/bin/env node

/**
 * Migration Script: MongoDB to MySQL
 * Use this script to migrate existing MongoDB data to MySQL
 * 
 * Usage: node scripts/migrate-from-mongo.js
 */

import fs from 'fs';
import path from 'path';
import prisma from '../src/config/database.js';
import { hashPassword } from '../src/services/authService.js';

async function migrateUsers(mongoUsers) {
  console.log(`\n📝 Migrating ${mongoUsers.length} users...`);
  
  for (const mongoUser of mongoUsers) {
    try {
      const user = await prisma.user.create({
        data: {
          name: mongoUser.name,
          email: mongoUser.email,
          password: mongoUser.password, // Should already be hashed from MongoDB
          role: (mongoUser.role || 'student').toUpperCase(),
          bio: mongoUser.bio || null,
          avatar: mongoUser.avatar,
          phone: mongoUser.phone || null,
          company: mongoUser.company || null,
          position: mongoUser.position || null,
          yearsOfExperience: mongoUser.yearsOfExperience || null,
          university: mongoUser.university || null,
          graduationYear: mongoUser.graduationYear || null,
          skills: mongoUser.skills ? JSON.stringify(mongoUser.skills) : null,
          interests: mongoUser.interests ? JSON.stringify(mongoUser.interests) : null,
          isVerified: mongoUser.isVerified || false,
          isMentor: mongoUser.isMentor || false,
          mentorBio: mongoUser.mentorBio || null,
          mentorRating: mongoUser.mentorRating || 0,
        },
      });
      console.log(`✓ Migrated user: ${user.email}`);
    } catch (error) {
      console.error(`✗ Failed to migrate user ${mongoUser.email}: ${error.message}`);
    }
  }
}

async function migrateMentors(mongoUsers) {
  console.log(`\n👨‍🏫 Migrating mentor profiles...`);
  
  const mentorUsers = mongoUsers.filter(u => u.isMentor);
  
  for (const mongoUser of mentorUsers) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: mongoUser.email },
      });
      
      if (!user) {
        console.warn(`⚠ User not found: ${mongoUser.email}`);
        continue;
      }

      const mentor = await prisma.mentor.create({
        data: {
          userId: user.id,
          company: mongoUser.company || 'Unknown',
          skills: mongoUser.skills ? JSON.stringify(mongoUser.skills) : '[]',
          availability: 'flexible', // Default, should be configurable
          hourlyRate: null,
        },
      });
      console.log(`✓ Migrated mentor profile for: ${mongoUser.email}`);
    } catch (error) {
      console.error(`✗ Failed to migrate mentor for ${mongoUser.email}: ${error.message}`);
    }
  }
}

async function migrateJobs(mongoJobs) {
  console.log(`\n💼 Migrating ${mongoJobs.length} job postings...`);
  
  for (const mongoJob of mongoJobs) {
    try {
      const poster = await prisma.user.findFirst({
        where: { email: mongoJob.posterEmail },
      });
      
      if (!poster) {
        console.warn(`⚠ Poster not found for job: ${mongoJob.title}`);
        continue;
      }

      const job = await prisma.jobPosting.create({
        data: {
          title: mongoJob.title,
          description: mongoJob.description,
          company: mongoJob.company,
          location: mongoJob.location || null,
          salary: mongoJob.salary || null,
          jobType: (mongoJob.jobType || 'FULL_TIME').toUpperCase(),
          skills: mongoJob.skills ? JSON.stringify(mongoJob.skills) : '[]',
          postedBy: poster.id,
          deadline: mongoJob.deadline ? new Date(mongoJob.deadline) : null,
        },
      });
      console.log(`✓ Migrated job: ${job.title}`);
    } catch (error) {
      console.error(`✗ Failed to migrate job ${mongoJob.title}: ${error.message}`);
    }
  }
}

async function migrateEvents(mongoEvents) {
  console.log(`\n🎉 Migrating ${mongoEvents.length} events...`);
  
  for (const mongoEvent of mongoEvents) {
    try {
      const organizer = await prisma.user.findFirst({
        where: { email: mongoEvent.organizerEmail },
      });
      
      if (!organizer) {
        console.warn(`⚠ Organizer not found for event: ${mongoEvent.title}`);
        continue;
      }

      const event = await prisma.event.create({
        data: {
          title: mongoEvent.title,
          description: mongoEvent.description || null,
          date: new Date(mongoEvent.date),
          location: mongoEvent.location || null,
          eventType: (mongoEvent.eventType || 'NETWORKING').toUpperCase(),
          organizerId: organizer.id,
          capacity: mongoEvent.capacity || null,
          image: mongoEvent.image || null,
        },
      });
      console.log(`✓ Migrated event: ${event.title}`);
    } catch (error) {
      console.error(`✗ Failed to migrate event ${mongoEvent.title}: ${error.message}`);
    }
  }
}

async function runMigration() {
  try {
    console.log('🚀 Starting MongoDB to MySQL migration...\n');

    // Import your MongoDB data files here
    // Example:
    // const mongoUsers = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/users.json'), 'utf8'));
    // const mongoJobs = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/jobs.json'), 'utf8'));
    // const mongoEvents = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/events.json'), 'utf8'));

    // For now, we'll use empty arrays
    const mongoUsers = [];
    const mongoJobs = [];
    const mongoEvents = [];

    if (mongoUsers.length > 0) {
      await migrateUsers(mongoUsers);
      await migrateMentors(mongoUsers);
    } else {
      console.log('⚠ No users to migrate. Add user data to start migration.');
    }

    if (mongoJobs.length > 0) {
      await migrateJobs(mongoJobs);
    }

    if (mongoEvents.length > 0) {
      await migrateEvents(mongoEvents);
    }

    console.log('\n✅ Migration completed!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
runMigration().catch(console.error);
