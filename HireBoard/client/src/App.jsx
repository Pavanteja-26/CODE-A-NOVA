import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobListings />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              
              <Route path="/candidate/dashboard/*" element={
                <ProtectedRoute roleRequired="candidate">
                  <CandidateDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/employer/dashboard/*" element={
                <ProtectedRoute roleRequired="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          
          <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} HireBoard. All rights reserved.
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
