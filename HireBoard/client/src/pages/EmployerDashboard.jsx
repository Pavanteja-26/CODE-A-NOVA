import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Users, Briefcase, Settings, Download } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('postings'); // postings, post-job, applicants
  const [stats, setStats] = useState({ totalPostings: 0, totalApplicants: 0 });
  const [jobs, setJobs] = useState([]);
  const [jobForm, setJobForm] = useState({
    title: '', description: '', location: '', salaryMin: '', salaryMax: '', jobType: 'full-time', category: 'Engineering'
  });
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchMyJobs();
  }, []);

  const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/jobs/employer/stats`, config);
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/jobs/my`, config);
      setJobs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const data = { ...jobForm, company: localStorage.getItem('company') || 'My Company' }; // Ideally get company from user profile
      await axios.post(`${API_URL}/jobs`, data, config);
      alert('Job posted successfully!');
      setJobForm({ title: '', description: '', location: '', salaryMin: '', salaryMax: '', jobType: 'full-time', category: 'Engineering' });
      fetchMyJobs();
      fetchStats();
      setActiveTab('postings');
    } catch (error) {
      alert('Failed to post job');
    }
  };

  const viewApplicants = async (jobId) => {
    try {
      const res = await axios.get(`${API_URL}/applications/job/${jobId}`, config);
      setApplicants(res.data);
      const job = jobs.find(j => j._id === jobId);
      setSelectedJob(job);
      setActiveTab('applicants');
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await axios.put(`${API_URL}/applications/${appId}/status`, { status }, config);
      // Refresh applicants list locally
      setApplicants(applicants.map(app => app._id === appId ? { ...app, status } : app));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">Active Postings</div>
            <div className="text-3xl font-bold text-slate-900">{stats.totalPostings}</div>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500 mb-1">Total Applicants</div>
            <div className="text-3xl font-bold text-slate-900">{stats.totalApplicants}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
          <div className="p-6 font-bold text-slate-900 border-b border-slate-200">
            Dashboard Menu
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <button 
              onClick={() => setActiveTab('postings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'postings' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Briefcase className="w-5 h-5" /> My Postings
            </button>
            <button 
              onClick={() => setActiveTab('post-job')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'post-job' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Plus className="w-5 h-5" /> Post a Job
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === 'postings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">My Job Postings</h2>
                <button onClick={() => setActiveTab('post-job')} className="btn btn-primary py-2 text-sm"><Plus className="w-4 h-4 mr-1" /> New Job</button>
              </div>
              {jobs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-slate-100 border-dashed">You haven't posted any jobs yet.</div>
              ) : (
                <div className="space-y-4">
                  {jobs.map(job => (
                    <div key={job._id} className="card p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
                        <div className="text-sm text-slate-500 flex gap-4 mt-1">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span className="capitalize">{job.jobType}</span>
                          <span>•</span>
                          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button onClick={() => viewApplicants(job._id)} className="btn btn-secondary text-sm px-4">
                        View Applicants
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'post-job' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create a New Job Listing</h2>
              <form onSubmit={handlePostJob} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                    <input type="text" required className="input-field" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea required rows="6" className="input-field" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input type="text" required className="input-field" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select className="input-field" value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})}>
                      <option>Engineering</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>Data Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
                    <select className="input-field" value={jobForm.jobType} onChange={e => setJobForm({...jobForm, jobType: e.target.value})}>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Min Salary ($)</label>
                      <input type="number" className="input-field" value={jobForm.salaryMin} onChange={e => setJobForm({...jobForm, salaryMin: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Max Salary ($)</label>
                      <input type="number" className="input-field" value={jobForm.salaryMax} onChange={e => setJobForm({...jobForm, salaryMax: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button type="submit" className="btn btn-primary py-2.5 px-8">Post Job</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'applicants' && selectedJob && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <button onClick={() => setActiveTab('postings')} className="text-sm text-primary-600 hover:underline mb-2 inline-block">&larr; Back to Postings</button>
                  <h2 className="text-2xl font-bold text-slate-900">Applicants for {selectedJob.title}</h2>
                </div>
                <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{applicants.length} Total</div>
              </div>

              {applicants.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-slate-100 border-dashed">No applicants yet.</div>
              ) : (
                <div className="space-y-4">
                  {applicants.map(app => (
                    <div key={app._id} className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{app.candidate.name}</h3>
                        <div className="text-slate-500 text-sm">{app.candidate.email}</div>
                        <div className="text-xs text-slate-400 mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</div>
                        {app.coverNote && (
                          <div className="mt-3 p-3 bg-slate-50 rounded text-sm text-slate-700 border border-slate-100 italic">
                            "{app.coverNote}"
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <a href={`${BASE_URL}${app.resumeUrl}`} target="_blank" rel="noreferrer" className="btn btn-outline py-2 w-full sm:w-auto text-sm">
                          <Download className="w-4 h-4 mr-2" /> Resume
                        </a>
                        <select 
                          className="input-field py-2 w-full sm:w-auto"
                          value={app.status}
                          onChange={(e) => updateStatus(app._id, e.target.value)}
                        >
                          <option value="applied">Applied</option>
                          <option value="under review">Under Review</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
