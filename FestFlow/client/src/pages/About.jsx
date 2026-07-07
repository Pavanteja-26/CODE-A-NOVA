const About = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">About FestFlow</h1>
          <p className="text-xl text-gray-500">The premier technical festival celebrating innovation, technology, and creativity.</p>
        </div>

        <div className="prose prose-lg prose-primary mx-auto text-gray-600">
          <p>
            FestFlow started in 2010 as a small gathering of tech enthusiasts and has since grown into one of the largest technical festivals in the country. Our mission is to provide a platform for students to showcase their technical prowess, learn from industry experts, and connect with like-minded peers.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Past Editions</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-8 not-prose">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">FestFlow 2025</h3>
              <p className="text-gray-600 mb-4">Focused on AI and Machine Learning. Hosted over 5000 students and featured speakers from top tech giants.</p>
              <div className="flex gap-4 text-sm font-medium text-primary-600">
                <span>50+ Events</span>
                <span>•</span>
                <span>$10k+ Prizes</span>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">FestFlow 2024</h3>
              <p className="text-gray-600 mb-4">Theme: Web3 and Decentralization. Featured the biggest college hackathon of the year.</p>
              <div className="flex gap-4 text-sm font-medium text-primary-600">
                <span>40+ Events</span>
                <span>•</span>
                <span>3000+ Attendees</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Contact Us</h2>
          <p>
            Have questions? Reach out to our organizing team at <a href="mailto:info@festflow.com" className="text-primary-600 hover:underline">info@festflow.com</a> or visit our Contact page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
