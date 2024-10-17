import React from 'react';

const About = () => {
  return (
    <section className="bg-white py-16 px-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Brand Story Section */}
        <h2 className="text-4xl font-bold text-slate-700 mb-8">About ExpenseMate</h2>
        <p className="text-gray-600 mb-12">
          ExpenseMate is designed to empower users to take control of their finances. With a user-friendly interface, you can easily track your expenses, set budgets, and gain insights into your spending habits.
        </p>

        {/* Mission Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-12">
          <h3 className="text-2xl font-semibold text-slate-50 mb-4">Our Mission</h3>
          <p className="text-gray-300">
            Our mission is to simplify personal finance management, making it accessible and effective for everyone.
          </p>
        </div>

        {/* Key Features Section */}
        <h2 className="text-3xl font-bold text-slate-700 mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-200 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Budget Tracking</h3>
            <p className="text-gray-500">Set and manage your budget easily with our intuitive interface.</p>
          </div>
          <div className="bg-slate-200 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Expense Categorization</h3>
            <p className="text-gray-500">Automatically categorize your expenses for better analysis.</p>
          </div>
          <div className="bg-slate-200 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Reports & Analytics</h3>
            <p className="text-gray-500">Get insights into your spending habits with detailed reports.</p>
          </div>
          <div className="bg-slate-200 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">User-Friendly Interface</h3>
            <p className="text-gray-500">Navigate effortlessly with our clean and intuitive design.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
