const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description can not be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['technical', 'non-technical', 'workshop']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  time: {
    type: String,
    required: [true, 'Please add a time (e.g., 10:00 AM)']
  },
  venue: {
    type: String,
    required: [true, 'Please add a venue']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add capacity']
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Please add registration deadline']
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
