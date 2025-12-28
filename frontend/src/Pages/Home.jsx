import React from "react";
import expenseMate from "../assets/finance.svg";
import Features from "../Components/Features";
import Working from "../Components/Working";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-slate-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-4 md:px-8 py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 gap-16">
          <div className="flex-1 text-center lg:text-left animate-in slide-in-from-left duration-700">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6 tracking-tight">
              ✨ Smart Financial Management
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-white tracking-tight">
              Master Your Money <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                With ExpenseMate
              </span>
            </h1>
            <p className="text-slate-400 mt-8 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Take control of your financial destiny. Track every rupee, analyze your habits, and reach your goals faster than ever with our intuitive platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <NavLink 
                to="/signup" 
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transition-all duration-200 hover:scale-105 active:scale-95 text-center"
              >
                Start Free Trial
              </NavLink>
              <NavLink 
                to="/about" 
                className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 transition-all duration-200 text-center"
              >
                Explore Features
              </NavLink>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-sm font-bold">Trusted by 10k+ users</p>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl animate-in slide-in-from-right duration-700 delay-200">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-800/80 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-slate-700/50">
                <img
                  src={expenseMate}
                  alt="Expense Tracker Dashboard"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-slate-900">
        <Features />
        <Working />
      </div>
    </div>
  );
};

export default Home;
