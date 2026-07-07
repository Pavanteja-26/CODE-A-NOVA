const Event = require('../models/Event');

// @desc    Get schedule (events grouped by date and time)
// @route   GET /api/schedule
// @access  Public
const getSchedule = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1, time: 1 });
    
    // Group events by date
    const schedule = events.reduce((acc, event) => {
      const dateStr = new Date(event.date).toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(event);
      return acc;
    }, {});

    res.status(200).json({ success: true, data: schedule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getSchedule
};
