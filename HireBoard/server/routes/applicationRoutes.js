const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private (Candidate)
router.post('/', protect, authorize('candidate'), upload.single('resume'), async (req, res) => {
  try {
    const { jobId, coverNote } = req.body;
    
    const existingApplication = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    let resumeUrl = req.user.resumeUrl; // Default to existing profile resume
    if (req.file) {
      resumeUrl = `/uploads/${req.file.filename}`;
      // Optional: Update user's profile with this resume
      req.user.resumeUrl = resumeUrl;
      await req.user.save();
    }

    if (!resumeUrl) {
      return res.status(400).json({ message: 'A resume is required to apply' });
    }

    const application = new Application({
      job: jobId,
      candidate: req.user._id,
      resumeUrl,
      coverNote
    });

    const createdApp = await application.save();
    res.status(201).json(createdApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/applications/my
// @desc    Get candidate's applications
// @access  Private (Candidate)
router.get('/my', protect, authorize('candidate'), async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title company location type')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applicants for a specific job
// @access  Private (Employer)
router.get('/job/:jobId', protect, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private (Employer)
router.put('/:id/status', protect, authorize('employer'), async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
