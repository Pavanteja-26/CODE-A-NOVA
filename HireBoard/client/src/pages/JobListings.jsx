import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Briefcase, DollarSign, Filter, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    jobType: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.location) params.append('location', filters.location);
      if (filters.category) params.append('category', filters.category);
      if (filters.jobType) params.append('jobType', filters.jobType);

      const res = await axios.get(`${API_URL}/jobs?${params.toString()}`);
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
          <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-lg">
            <Filter className="w-5 h-5" /> Filters
          </div>
          <form onSubmit={handleFilterSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  className="input-field pl-9" 
                  placeholder="Job title..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="input-field pl-9" 
                  placeholder="City, state..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange} className="input-field">
                <option value="">All Categories</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
              <select name="jobType" value={filters.jobType} onChange={handleFilterChange} className="input-field">
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-full">Apply Filters</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Recommended Jobs</h1>
          <span className="text-slate-500">{jobs.length} jobs found</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job._id} className="card p-6 flex flex-col sm:flex-row gap-6 items-start group">
                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 font-bold text-slate-400 text-xl">
                  {job.company.substring(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <Link to={`/jobs/${job._id}`} className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors truncate block">
                      {job.title}
                    </Link>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                      New
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium mb-3">{job.company}</div>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</div>
                    <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.jobType}</div>
                    {job.salaryMin && job.salaryMax && (
                      <div className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 mr-1" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    <Link to={`/jobs/${job._id}`} className="btn btn-secondary py-1.5 px-4 text-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default JobListings;
