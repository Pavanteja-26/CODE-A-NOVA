import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-primary-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="block text-primary-400">FestFlow 2026</span>
            <span className="block">The Ultimate Tech Experience</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mb-10">
            Join thousands of students for three days of innovation, competition, and learning. Discover your potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/events" 
              className="bg-primary-500 hover:bg-primary-400 text-white font-bold py-3 px-8 rounded-lg text-center transition-colors shadow-lg"
            >
              Explore Events
            </Link>
            <Link 
              to="/register" 
              className="bg-white hover:bg-gray-100 text-primary-900 font-bold py-3 px-8 rounded-lg text-center transition-colors shadow-lg"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Attend FestFlow?</h2>
            <p className="mt-4 text-lg text-gray-600">Experience the biggest technical festival in the region.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-6">
                <Zap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">50+ Technical Events</h3>
              <p className="text-gray-600">From hackathons to robotics, showcase your skills in diverse competitions.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-6">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Workshops</h3>
              <p className="text-gray-600">Learn from industry leaders and gain hands-on experience with new tech.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-6">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3 Action-Packed Days</h3>
              <p className="text-gray-600">An unforgettable experience of learning, networking, and fun.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
