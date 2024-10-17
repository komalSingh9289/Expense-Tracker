import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Main Container */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo or Brand Name */}
          <div className="text-white text-2xl font-bold">
            ExpenseMate
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <NavLink to="/" className="hover:text-white transition duration-300">
              Home
            </NavLink>
            <NavLink to="/about" className="hover:text-white transition duration-300">
              About
            </NavLink>
            <NavLink to="/contact" className="hover:text-white transition duration-300">
              Contact
            </NavLink>
          </div>
        </div>

        {/* Subscribe to Newsletter Section */}
        <div className="mt-10 md:mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Subscribe to our Newsletter
          </h3>
          <form className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full md:w-64 px-4 py-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition duration-300"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-400 mt-4">
            Stay updated with the latest news and updates.
          </p>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 text-center text-white text-sm">
          <p>&copy; {new Date().getFullYear()} ExpenseMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
