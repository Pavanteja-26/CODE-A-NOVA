const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  coverNote: {
    type: String
  },
  status: {
    type: String,
    enum: ['applied', 'under review', 'rejected', 'accepted'],
    default: 'applied'
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
