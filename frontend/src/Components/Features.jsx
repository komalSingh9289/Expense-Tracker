import React from 'react';
import { FaChartLine, FaTags, FaFileAlt } from 'react-icons/fa';

const Features = () => {
  return (
    <section className="bg-slate-50 text-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-200 p-6 rounded-lg transition-transform transform hover:scale-105">
            <div className="flex justify-center mb-4">
              <FaChartLine className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Budget Tracking</h3>
            <p>Set and manage your budget easily with our intuitive interface.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-slate-200 p-6 rounded-lg transition-transform transform hover:scale-105">
            <div className="flex justify-center mb-4">
              <FaTags className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expense Categorization</h3>
            <p>Automatically categorize your expenses for better analysis.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-slate-200 p-6 rounded-lg transition-transform transform hover:scale-105">
            <div className="flex justify-center mb-4">
              <FaFileAlt className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reports & Analytics</h3>
            <p>Get insights into your spending habits with detailed reports.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
