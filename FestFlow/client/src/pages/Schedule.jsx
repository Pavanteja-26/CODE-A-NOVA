import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Clock, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Schedule = () => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await api.get('/schedule');
        setSchedule(data.data);
      } catch (err) {
        toast.error('Failed to fetch schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading schedule...</div>;
  }

  const dates = Object.keys(schedule).sort();

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">Event Schedule</h1>
          <p className="text-xl text-gray-500">Plan your fest experience. Check out what's happening when.</p>
        </div>

        {dates.length === 0 ? (
          <div className="text-center text-gray-500">No events scheduled yet.</div>
        ) : (
          <div className="space-y-16">
            {dates.map((date) => (
              <div key={date} className="relative">
                <div className="sticky top-16 z-10 bg-white/90 backdrop-blur-md py-4 border-b border-gray-200 mb-8">
                  <h2 className="text-2xl font-bold text-primary-700">
                    {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h2>
                </div>
                
                <div className="space-y-6 pl-4 md:pl-0">
                  {schedule[date].map((event) => (
                    <div key={event._id} className="relative md:flex items-start md:space-x-8 group">
                      {/* Timeline line */}
                      <div className="hidden md:block absolute left-[8.5rem] top-0 bottom-[-1.5rem] w-px bg-gray-200 group-last:hidden"></div>
                      
                      {/* Time */}
                      <div className="md:w-32 flex-shrink-0 mb-2 md:mb-0 md:text-right pt-4">
                        <span className="font-bold text-gray-900 text-lg flex items-center md:justify-end">
                          <Clock className="w-4 h-4 mr-1 text-primary-500 md:hidden" />
                          {event.time}
                        </span>
                      </div>
                      
                      {/* Timeline dot */}
                      <div className="hidden md:flex relative z-10 items-center justify-center w-8 h-8 rounded-full bg-primary-100 ring-4 ring-white mt-3">
                        <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                      </div>
                      
                      {/* Content Card */}
                      <div className="flex-grow bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                          <div>
                            <Link to={`/events/${event._id}`} className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                              {event.title}
                            </Link>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                                {event.venue}
                              </span>
                              <span className="flex items-center">
                                <Tag className="w-4 h-4 mr-1 text-primary-500" />
                                {event.category}
                              </span>
                            </div>
                          </div>
                          <Link 
                            to={`/events/${event._id}`}
                            className="inline-block px-4 py-2 bg-white text-primary-600 border border-primary-200 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors whitespace-nowrap text-center"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
