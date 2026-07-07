import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Tag } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data.data);
      } catch (err) {
        toast.error('Failed to fetch event details');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please login to register');
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      toast.error('Only students can register for events');
      return;
    }

    setRegistering(true);
    try {
      await api.post('/registrations', { eventId: id });
      toast.success('Successfully registered! Confirmation email sent.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading event...</div>;
  }

  if (!event) return null;

  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/events')}
          className="flex items-center text-gray-500 hover:text-primary-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-900"></div>
          
          <div className="p-8 sm:p-10 -mt-10 relative">
            <div className="bg-white rounded-xl shadow-md inline-block px-4 py-2 mb-6 border border-gray-100">
              <span className="text-sm font-bold text-primary-700 uppercase tracking-wide flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                {event.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">{event.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-6 h-6 mr-3 text-primary-500" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date</p>
                  <p className="font-semibold">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-6 h-6 mr-3 text-primary-500" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Time</p>
                  <p className="font-semibold">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-6 h-6 mr-3 text-primary-500" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Venue</p>
                  <p className="font-semibold">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <Users className="w-6 h-6 mr-3 text-primary-500" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Capacity</p>
                  <p className="font-semibold">{event.capacity} seats</p>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this event</h2>
              <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Registration Deadline</p>
                <p className={`font-semibold ${isDeadlinePassed ? 'text-red-500' : 'text-gray-900'}`}>
                  {new Date(event.registrationDeadline).toLocaleDateString()}
                </p>
              </div>
              
              <button
                onClick={handleRegister}
                disabled={isDeadlinePassed || registering}
                className={`px-8 py-3 rounded-lg font-bold text-lg shadow-sm transition-all ${
                  isDeadlinePassed
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-md'
                }`}
              >
                {registering ? 'Registering...' : isDeadlinePassed ? 'Deadline Passed' : 'Register Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
