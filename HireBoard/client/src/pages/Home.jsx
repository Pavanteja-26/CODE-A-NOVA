import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Briefcase, MapPin, Building2, TrendingUp, ArrowRight } from 'lucide-react';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() || location.trim()) {
      navigate(`/jobs?keyword=${keyword}&location=${location}`);
    } else {
      navigate('/jobs');
    }
  };

  const categories = [
    { name: 'Engineering', icon: <Building2 className="w-6 h-6 text-blue-500" />, jobs: '120+ jobs' },
    { name: 'Design', icon: <TrendingUp className="w-6 h-6 text-pink-500" />, jobs: '80+ jobs' },
    { name: 'Marketing', icon: <Briefcase className="w-6 h-6 text-emerald-500" />, jobs: '45+ jobs' },
    { name: 'Data Science', icon: <Search className="w-6 h-6 text-purple-500" />, jobs: '60+ jobs' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">dream job</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Discover thousands of job opportunities with all the information you need. Its your future.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-3">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="Job title, keyword or company" 
                className="bg-transparent border-none focus:ring-0 w-full text-slate-900 placeholder-slate-500 outline-none"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-3">
              <MapPin className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="City, state or remote" 
                className="bg-transparent border-none focus:ring-0 w-full text-slate-900 placeholder-slate-500 outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary py-3 px-8 text-lg rounded-xl shadow-md">
              Search Jobs
            </button>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore by Category</h2>
            <p className="text-slate-600">Find the role that best suits your skills</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link to={`/jobs?category=${category.name}`} key={index} className="card p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-200">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{category.name}</h3>
                <p className="text-slate-500 text-sm">{category.jobs}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Are you an employer?</h2>
            <p className="text-slate-400 mb-8 text-lg">
              Find the best talent for your company. Post a job today and reach thousands of qualified candidates.
            </p>
            <Link to="/register" className="btn bg-white text-slate-900 hover:bg-slate-100 py-3 px-8 text-lg rounded-xl shadow-lg inline-flex items-center gap-2">
              Post a Job Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="hidden md:block">
             {/* A decorative element to make it look premium */}
             <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-500 rounded-3xl transform rotate-3 opacity-20 blur-xl"></div>
                <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl relative">
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                    <div className="pt-4 flex gap-4">
                      <div className="h-10 w-24 bg-primary-600 rounded-lg"></div>
                      <div className="h-10 w-24 bg-slate-700 rounded-lg"></div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
