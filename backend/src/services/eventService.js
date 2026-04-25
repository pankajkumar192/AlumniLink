import prisma from "../config/database.js";

// Create event
export const createEvent = async (organizerId, eventData) => {
  const { title, description, date, location, eventType, capacity, image } = eventData;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      date,
      location,
      eventType: eventType || "NETWORKING",
      organizerId,
      capacity,
      image,
    },
    include: {
      organizer: {
        select: { id: true, name: true, email: true },
      },
      attendees: true,
    },
  });

  return event;
};

// Get all events
export const getAllEvents = async (filters = {}) => {
  const where = {};

  if (filters.eventType) {
    where.eventType = filters.eventType;
  }

  if (filters.organizerId) {
    where.organizerId = filters.organizerId;
  }

  return await prisma.event.findMany({
    where,
    include: {
      organizer: {
        select: { id: true, name: true, email: true },
      },
      attendees: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
    orderBy: { date: "asc" },
  });
};

// Get event by ID
export const getEventById = async (eventId) => {
  return await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      organizer: {
        select: { id: true, name: true, email: true },
      },
      attendees: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
    },
  });
};

// Update event
export const updateEvent = async (eventId, updateData) => {
  const { title, description, date, location, eventType, capacity, image } = updateData;

  const data = {};

  if (title) data.title = title;
  if (description) data.description = description;
  if (date) data.date = date;
  if (location) data.location = location;
  if (eventType) data.eventType = eventType;
  if (capacity) data.capacity = capacity;
  if (image) data.image = image;

  return await prisma.event.update({
    where: { id: eventId },
    data,
    include: {
      organizer: {
        select: { id: true, name: true, email: true },
      },
      attendees: true,
    },
  });
};

// Delete event
export const deleteEvent = async (eventId) => {
  return await prisma.event.delete({
    where: { id: eventId },
  });
};

// Register user for event
export const registerForEvent = async (eventId, userId) => {
  // Check if already registered
  const existingAttendee = await prisma.eventAttendee.findUnique({
    where: { eventId_userId: { eventId, userId } },
  });

  if (existingAttendee) {
    throw new Error("Already registered for this event");
  }

  // Check event capacity
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { attendees: true },
  });

  if (event.capacity && event.attendees.length >= event.capacity) {
    throw new Error("Event is full");
  }

  const attendee = await prisma.eventAttendee.create({
    data: {
      eventId,
      userId,
    },
    include: {
      event: {
        select: { id: true, title: true },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return attendee;
};

// Unregister from event
export const unregisterFromEvent = async (eventId, userId) => {
  return await prisma.eventAttendee.delete({
    where: { eventId_userId: { eventId, userId } },
  });
};

// Get user's events
export const getUserEvents = async (userId) => {
  return await prisma.eventAttendee.findMany({
    where: { userId },
    include: {
      event: {
        include: {
          organizer: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
    orderBy: { registeredAt: "desc" },
  });
};

// Get event attendees
export const getEventAttendees = async (eventId) => {
  return await prisma.eventAttendee.findMany({
    where: { eventId },
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  });
};
