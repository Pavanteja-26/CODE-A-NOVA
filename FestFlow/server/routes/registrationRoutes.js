const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration
} = require('../controllers/registrationController');

const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), registerForEvent);
router.get('/my', protect, authorize('student'), getMyRegistrations);
router.get('/event/:eventId', protect, authorize('admin'), getEventRegistrations);
router.delete('/:id', protect, authorize('student'), cancelRegistration);

module.exports = router;
