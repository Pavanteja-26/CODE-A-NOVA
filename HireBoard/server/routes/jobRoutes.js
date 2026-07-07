const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @route   GET /api/jobs
// @desc    Get all jobs (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, location, jobType, keyword } = req.query;
    let query = {};

    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (jobType) query.jobType = jobType;
    if (keyword) {
      query.$or = [
        { title: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') },
        { company: new RegExp(keyword, 'i') }
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 }).populate('postedBy', 'name email company');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/jobs/my
// @desc    Get jobs posted by the employer
// @access  Private (Employer)
router.get('/my', protect, authorize('employer'), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company');
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Employer)
router.post('/', protect, authorize('employer'), async (req, res) => {
  try {
    const { title, description, company, location, salaryMin, salaryMax, jobType, category, applicationDeadline } = req.body;
    const job = new Job({
      title, description, company, location, salaryMin, salaryMax, jobType, category, applicationDeadline,
      postedBy: req.user._id
    });
    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Employer)
router.put('/:id', protect, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      if (job.postedBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized to update this job' });
      }

      job.title = req.body.title || job.title;
      job.description = req.body.description || job.description;
      job.company = req.body.company || job.company;
      job.location = req.body.location || job.location;
      job.salaryMin = req.body.salaryMin || job.salaryMin;
      job.salaryMax = req.body.salaryMax || job.salaryMax;
      job.jobType = req.body.jobType || job.jobType;
      job.category = req.body.category || job.category;
      job.applicationDeadline = req.body.applicationDeadline || job.applicationDeadline;

      const updatedJob = await job.save();
      res.json(updatedJob);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Employer)
router.delete('/:id', protect, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      if (job.postedBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized to delete this job' });
      }
      await job.deleteOne();
      res.json({ message: 'Job removed' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/employer/stats
// @desc    Get Employer dashboard stats
// @access  Private (Employer)
router.get('/employer/stats', protect, authorize('employer'), async (req, res) => {
  try {
    const totalPostings = await Job.countDocuments({ postedBy: req.user._id });
    
    // Total applicants would require aggregating across applications, we'll keep it simple:
    const myJobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = myJobs.map(job => job._id);
    const Application = require('../models/Application');
    const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } });

    res.json({ totalPostings, totalApplicants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
