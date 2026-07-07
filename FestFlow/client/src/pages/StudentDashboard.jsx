import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const { data } = await api.get('/registrations/my');
        setRegistrations(data.data);
      } catch (err) {
        toast.error('Failed to fetch your registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;

    try {
      await api.delete(`/registrations/${id}`);
      setRegistrations(registrations.map(reg => 
        reg._id === id ? { ...reg, status: 'cancelled' } : reg
      ));
      toast.success('Registration cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel registration');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  const activeRegistrations = registrations.filter(r => r.status === 'confirmed');
  const pastOrCancelledRegistrations = registrations.filter(r => r.status === 'cancelled');

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome, {user.name}!</h1>
              <p className="mt-2 text-gray-600">Manage your event registrations here.</p>
            </div>
            <div className="flex flex-col gap-1 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full font-medium inline-flex items-center w-fit">
                {user.college}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full font-medium inline-flex items-center w-fit">
                {user.department}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Registered Events</h2>

        {activeRegistrations.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
            <Link to="/events" className="text-primary-600 font-medium hover:text-primary-700">Browse Events &rarr;</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {activeRegistrations.map((reg) => (
              <div key={reg._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 uppercase tracking-wider">
                      Confirmed
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    <Link to={`/events/${reg.event._id}`} className="hover:text-primary-600 transition-colors">
                      {reg.event.title}
                    </Link>
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(reg.event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {reg.event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {reg.event.venue}
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6 pt-0 mt-auto">
                  <button 
                    onClick={() => handleCancel(reg._id)}
                    className="flex items-center justify-center w-full py-2 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Registration
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pastOrCancelledRegistrations.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cancelled Registrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastOrCancelledRegistrations.map((reg) => (
                <div key={reg._id} className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden opacity-75">
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-600 uppercase tracking-wider">
                        Cancelled
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-600 mb-2">{reg.event.title}</h3>
                    <p className="text-sm text-gray-500">
                      Cancelled on: {new Date(reg.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
