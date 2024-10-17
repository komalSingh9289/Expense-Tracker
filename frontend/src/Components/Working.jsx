import React from 'react';
import { FaUserPlus, FaMoneyBillWave, FaChartPie } from 'react-icons/fa';

const Working = () => {
  return (
    <section className="bg-slate-700 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">How It Works</h2>
        <p className="text-gray-400 mb-12">
          Follow these simple steps to get started with ExpenseMate:
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8">
          {/* Step 1 */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 w-full md:w-1/3">
            <div className="flex justify-center mb-4">
              <FaUserPlus className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Create an Account</h3>
            <p className="text-gray-300">
              Sign up easily to start tracking your expenses in no time!
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 w-full md:w-1/3">
            <div className="flex justify-center mb-4">
              <FaMoneyBillWave className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Add Your Expenses</h3>
            <p className="text-gray-300">
              Input your expenses and income to have a clear financial picture.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 w-full md:w-1/3">
            <div className="flex justify-center mb-4">
              <FaChartPie className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Track & Analyze</h3>
            <p className="text-gray-300">
              Monitor your spending habits and see where you can save more!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Working;
