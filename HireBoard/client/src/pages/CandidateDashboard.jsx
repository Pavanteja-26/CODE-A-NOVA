import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Briefcase, Bookmark, FileText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const [appsRes, savedRes] = await Promise.all([
        axios.get(`${API_URL}/applications/my`, config),
        axios.get(`${API_URL}/saved-jobs/my`, config)
      ]);
      setApplications(appsRes.data);
      setSavedJobs(savedRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedJob = async (id) => {
    try {
      await axios.delete(`${API_URL}/saved-jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSavedJobs(savedJobs.filter(job => job._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'applied': 'bg-blue-100 text-blue-800',
      'under review': 'bg-yellow-100 text-yellow-800',
      'rejected': 'bg-red-100 text-red-800',
      'accepted': 'bg-green-100 text-green-800'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colors[status]}`}>{status}</span>;
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
        <p className="text-slate-500">Manage your applications and saved jobs</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            className={`flex-1 py-4 px-6 text-center font-medium flex justify-center items-center gap-2 ${activeTab === 'applications' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('applications')}
          >
            <FileText className="w-5 h-5" /> Applications ({applications.length})
          </button>
          <button 
            className={`flex-1 py-4 px-6 text-center font-medium flex justify-center items-center gap-2 ${activeTab === 'saved' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark className="w-5 h-5" /> Saved Jobs ({savedJobs.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'applications' && (
            <div className="overflow-x-auto">
              {applications.length === 0 ? (
                <div className="text-center py-12 text-slate-500">You haven't applied to any jobs yet.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-sm">
                      <th className="py-3 px-4 font-medium">Job Title</th>
                      <th className="py-3 px-4 font-medium">Company</th>
                      <th className="py-3 px-4 font-medium">Applied Date</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app._id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4 font-medium text-slate-900">
                          <Link to={`/jobs/${app.job._id}`} className="hover:text-primary-600">{app.job.title}</Link>
                        </td>
                        <td className="py-4 px-4 text-slate-600">{app.job.company}</td>
                        <td className="py-4 px-4 text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4">{getStatusBadge(app.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-500">You haven't saved any jobs yet.</div>
              ) : (
                savedJobs.map(({_id, job}) => (
                  <div key={_id} className="card p-5">
                    <h3 className="font-bold text-slate-900 mb-1 truncate">{job.title}</h3>
                    <p className="text-slate-600 text-sm mb-4"><Briefcase className="inline w-4 h-4 mr-1"/>{job.company}</p>
                    <div className="flex gap-2">
                      <Link to={`/jobs/${job._id}`} className="btn btn-primary flex-1 py-1.5 text-sm">View</Link>
                      <button onClick={() => removeSavedJob(_id)} className="btn btn-secondary py-1.5 px-3 text-sm text-red-600 hover:bg-red-50 hover:border-red-200">Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
