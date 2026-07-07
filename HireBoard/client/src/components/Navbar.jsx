import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">HireBoard</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/jobs" className="text-slate-600 hover:text-primary-600 font-medium px-3 py-2 rounded-md transition-colors">Find Jobs</Link>
            
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                <Link 
                  to={user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User className="h-4 w-4 text-slate-500" />
                  </div>
                  <span>{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium">Log in</Link>
                <Link to="/register" className="btn btn-primary text-sm py-1.5">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
