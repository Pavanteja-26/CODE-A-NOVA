const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments({ status: 'confirmed' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    // Most popular event logic
    const events = await Event.find();
    let mostPopularEvent = null;
    let maxRegs = 0;
    
    for (const event of events) {
      const regCount = await Registration.countDocuments({ event: event._id, status: 'confirmed' });
      if (regCount > maxRegs) {
        maxRegs = regCount;
        mostPopularEvent = { title: event.title, count: regCount };
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        totalRegistrations,
        totalStudents,
        mostPopularEvent
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getStats
};
