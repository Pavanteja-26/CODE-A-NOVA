const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salaryMin: {
    type: Number,
  },
  salaryMax: {
    type: Number,
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'remote'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationDeadline: {
    type: Date,
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
