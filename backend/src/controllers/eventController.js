import { getAllEvents, getEventById as getEventByIdService, createEvent as createEventService, registerForEvent, getEventAttendees } from "../services/eventService.js";
import { createNotification } from "../services/notificationService.js";

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const filters = {};
    if (req.query.eventType) filters.eventType = req.query.eventType;

    const events = await getAllEvents(filters);
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, eventType, capacity, image } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, message: "Please provide title and date" });
    }

    const event = await createEventService(req.user.id, {
      title,
      description,
      date,
      location,
      eventType,
      capacity,
      image,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await getEventByIdService(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
export const registerEvent = async (req, res) => {
  try {
    const event = await getEventByIdService(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const attendee = await registerForEvent(req.params.id, req.user.id);

    // Create notification for event organizer
    await createNotification(event.organizer.id, {
      senderId: req.user.id,
      title: "New Event Registration",
      message: `${req.user.name} registered for your event: ${event.title}`,
      type: "EVENT_INVITE",
      relatedId: attendee.id,
    });

    res.status(200).json({ success: true, data: attendee });
  } catch (error) {
    if (error.message === "Already registered for this event" || error.message === "Event is full") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get event attendees
// @route   GET /api/events/:id/attendees
// @access  Public
export const getEventAttendeesHandler = async (req, res) => {
  try {
    const attendees = await getEventAttendees(req.params.id);
    res.status(200).json({ success: true, data: attendees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
