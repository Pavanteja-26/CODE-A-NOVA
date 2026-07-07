import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data.data);
      } catch (err) {
        toast.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.category === filter);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading events...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">All Events</h1>
            <p className="mt-2 text-lg text-gray-600">Discover and register for the most exciting events.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Filter by:</span>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="non-technical">Non-Technical</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-gray-100">
            <p className="text-gray-500 text-lg">No events found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <div key={event._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col">
                <div className="h-3 bg-gradient-to-r from-primary-400 to-primary-600"></div>
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary-50 text-primary-700 uppercase tracking-wider">
                      {event.category}
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {event.capacity}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-primary-500" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                      {event.venue}
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6 pt-0 mt-auto">
                  <Link 
                    to={`/events/${event._id}`}
                    className="block w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 text-primary-700 font-medium text-center rounded-lg border border-gray-200 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
