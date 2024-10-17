import React from 'react';

const Contact = () => {
  return (
    <section className="bg-white py-16 px-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Title Section */}
        <h2 className="text-4xl font-bold text-slate-700 mb-8">Contact Us</h2>
        <p className="text-gray-600 mb-12">
          We’d love to hear from you! Whether you have questions, feedback, or just want to say hi, feel free to reach out.
        </p>

        {/* Contact Form Section */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-left text-gray-50 mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                className="w-full px-4 py-2 rounded-lg  bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-left text-gray-50 mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded-lg  bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-left text-gray-50 mb-2" htmlFor="message">Message</label>
              <textarea
                id="message"
                rows="5"
                placeholder="Your Message"
                className="w-full px-4 py-2 rounded-lg  bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800"
                required
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition duration-300"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Additional Information Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-slate-700 mb-4">Get in Touch</h3>
          <p className="text-gray-600 mb-2">Email: <a href="mailto:info@expenseMate.com" className="text-blue-600">info@expenseMate.com</a></p>
          
        </div>
      </div>
    </section>
  );
};

export default Contact;
