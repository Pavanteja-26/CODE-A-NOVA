import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    company: ''
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(formData);
      if (user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Join HireBoard to find your next opportunity
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
              <div className="flex gap-4">
                <label className={`flex-1 p-3 border rounded-xl cursor-pointer transition-all ${formData.role === 'candidate' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="role" value="candidate" checked={formData.role === 'candidate'} onChange={handleChange} className="sr-only" />
                  <div className="text-center font-medium text-slate-900">Candidate</div>
                  <div className="text-xs text-center text-slate-500 mt-1">Looking for jobs</div>
                </label>
                <label className={`flex-1 p-3 border rounded-xl cursor-pointer transition-all ${formData.role === 'employer' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="role" value="employer" checked={formData.role === 'employer'} onChange={handleChange} className="sr-only" />
                  <div className="text-center font-medium text-slate-900">Employer</div>
                  <div className="text-xs text-center text-slate-500 mt-1">Hiring talent</div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" required className="input-field" value={formData.name} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <input type="email" name="email" required className="input-field" value={formData.email} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" name="password" required className="input-field" value={formData.password} onChange={handleChange} />
            </div>

            {formData.role === 'employer' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input type="text" name="company" required className="input-field" value={formData.company} onChange={handleChange} />
              </div>
            )}
          </div>

          <div>
            <button type="submit" className="btn btn-primary w-full py-2.5 text-base">
              Create account
            </button>
          </div>
          <div className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
