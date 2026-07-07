import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Briefcase, DollarSign, Clock, Building2, Bookmark, BookmarkCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [file, setFile] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [applyError, setApplyError] = useState('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJob();
    if (user && user.role === 'candidate') {
      checkIfSaved();
    }
  }, [id, user]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`${API_URL}/jobs/${id}`);
      setJob(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const res = await axios.get(`${API_URL}/saved-jobs/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const isSaved = res.data.some(sj => sj.job._id === id);
      setSaved(isSaved);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSaveJob = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'candidate') return;

    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      if (saved) {
        // Need to fetch saved jobs to get the ID of the saved job record
        const res = await axios.get(`${API_URL}/saved-jobs/my`, config);
        const savedRecord = res.data.find(sj => sj.job._id === id);
        if (savedRecord) {
          await axios.delete(`${API_URL}/saved-jobs/${savedRecord._id}`, config);
          setSaved(false);
        }
      } else {
        await axios.post(`${API_URL}/saved-jobs`, { jobId: id }, config);
        setSaved(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError('');
    setApplyMessage('');
    
    if (!file && !user.resumeUrl) {
      setApplyError('Please upload a resume');
      return;
    }

    const formData = new FormData();
    formData.append('jobId', id);
    formData.append('coverNote', coverNote);
    if (file) {
      formData.append('resume', file);
    }

    try {
      await axios.post(`${API_URL}/applications`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setApplyMessage('Application submitted successfully!');
      setTimeout(() => setShowApplyModal(false), 2000);
    } catch (error) {
      setApplyError(error.response?.data?.message || 'Error submitting application');
    }
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!job) return <div className="p-12 text-center">Job not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 p-8 border-b border-slate-200 flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="flex gap-6 items-center">
            <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-3xl font-bold text-slate-400 shadow-sm">
              {job.company.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
              <div className="text-lg text-primary-600 font-medium flex items-center gap-2">
                <Building2 className="w-5 h-5" /> {job.company}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            {(!user || user.role === 'candidate') && (
              <>
                <button 
                  onClick={toggleSaveJob}
                  className="btn btn-secondary px-4 h-12"
                  title={saved ? "Unsave Job" : "Save Job"}
                >
                  {saved ? <BookmarkCheck className="w-5 h-5 text-primary-600" /> : <Bookmark className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => user ? setShowApplyModal(true) : navigate('/login')}
                  className="btn btn-primary px-8 h-12 flex-1 md:flex-none"
                >
                  Apply Now
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col md:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Job Description</h2>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
              {job.description.split('\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 mb-2">Job Overview</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-500">Location</div>
                  <div className="font-medium text-slate-900">{job.location}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-500">Job Type</div>
                  <div className="font-medium text-slate-900 capitalize">{job.jobType}</div>
                </div>
              </div>
              {job.salaryMin && job.salaryMax && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-500">Salary</div>
                    <div className="font-medium text-slate-900">${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-500">Date Posted</div>
                  <div className="font-medium text-slate-900">{new Date(job.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>
            {applyMessage ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center font-medium">
                {applyMessage}
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                {applyError && <div className="text-red-500 text-sm">{applyError}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Resume (PDF/DOC)</label>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={(e) => setFile(e.target.files[0])}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {user?.resumeUrl && !file && (
                    <p className="text-xs text-slate-500 mt-2">You already have a resume on file. Upload a new one to replace it for this application.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cover Note (Optional)</label>
                  <textarea 
                    rows="4" 
                    className="input-field" 
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly explain why you're a good fit..."
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn btn-primary flex-1">Submit Application</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
