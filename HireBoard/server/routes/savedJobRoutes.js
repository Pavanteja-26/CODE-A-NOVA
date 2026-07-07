const express = require('express');
const router = express.Router();
const SavedJob = require('../models/SavedJob');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @route   POST /api/saved-jobs
// @desc    Save a job
// @access  Private (Candidate)
router.post('/', protect, authorize('candidate'), async (req, res) => {
  try {
    const { jobId } = req.body;

    const existingSave = await SavedJob.findOne({ candidate: req.user._id, job: jobId });
    if (existingSave) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const savedJob = new SavedJob({
      candidate: req.user._id,
      job: jobId
    });

    const createdSavedJob = await savedJob.save();
    res.status(201).json(createdSavedJob);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Job already saved' });
    }
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/saved-jobs/my
// @desc    Get candidate's saved jobs
// @access  Private (Candidate)
router.get('/my', protect, authorize('candidate'), async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ candidate: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });
    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/saved-jobs/:id
// @desc    Remove a saved job
// @access  Private (Candidate)
router.delete('/:id', protect, authorize('candidate'), async (req, res) => {
  try {
    const savedJob = await SavedJob.findById(req.params.id);

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    if (savedJob.candidate.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await savedJob.deleteOne();
    res.json({ message: 'Job removed from saved list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
