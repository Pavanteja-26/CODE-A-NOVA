const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  confirmationEmailSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Prevent a student from registering for the same event multiple times
registrationSchema.index({ student: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
