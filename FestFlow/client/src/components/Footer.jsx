const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start mb-6 md:mb-0">
            <span className="text-xl font-bold text-gray-900 tracking-tight">FestFlow</span>
          </div>
          <div className="flex justify-center space-x-6 md:order-2">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} FestFlow. All rights reserved. Built for College Tech Fests.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
