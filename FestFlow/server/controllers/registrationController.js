const Registration = require('../models/Registration');
const Event = require('../models/Event');
const sendEmail = require('../utils/sendEmail');

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private/Student
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Check capacity
    const registrationsCount = await Registration.countDocuments({ event: eventId, status: 'confirmed' });
    if (registrationsCount >= event.capacity) {
      return res.status(400).json({ success: false, error: 'Event is at full capacity' });
    }
    
    // Check deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ success: false, error: 'Registration deadline has passed' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      student: req.user.id,
      event: eventId
    });

    if (existingRegistration) {
      if (existingRegistration.status === 'cancelled') {
        // Reactivate registration
        existingRegistration.status = 'confirmed';
        await existingRegistration.save();
        return res.status(200).json({ success: true, data: existingRegistration });
      }
      return res.status(400).json({ success: false, error: 'Already registered for this event' });
    }

    const registration = await Registration.create({
      student: req.user.id,
      event: eventId
    });

    // Send confirmation email
    const message = `
      <h1>Registration Confirmed!</h1>
      <p>Hello ${req.user.name},</p>
      <p>You have successfully registered for <strong>${event.title}</strong>.</p>
      <h3>Event Details:</h3>
      <ul>
        <li><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${event.time}</li>
        <li><strong>Venue:</strong> ${event.venue}</li>
      </ul>
      <p>We look forward to seeing you there!</p>
    `;

    try {
      await sendEmail({
        email: req.user.email,
        subject: `Registration Confirmation: ${event.title}`,
        message
      });
      
      registration.confirmationEmailSent = true;
      await registration.save();
    } catch (err) {
      console.error('Email could not be sent', err);
      // We still return success since registration was successful
    }

    res.status(201).json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get logged in user's registrations
// @route   GET /api/registrations/my
// @access  Private/Student
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user.id })
      .populate('event', 'title date time venue')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: registrations.length, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all registrations for a specific event
// @route   GET /api/registrations/event/:eventId
// @access  Private/Admin
const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('student', 'name email college department')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: registrations.length, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Cancel a registration
// @route   DELETE /api/registrations/:id
// @access  Private/Student
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }

    // Make sure user owns registration
    if (registration.student.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to cancel this registration' });
    }

    registration.status = 'cancelled';
    await registration.save();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration
};
