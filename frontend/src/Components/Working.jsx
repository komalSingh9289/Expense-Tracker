import React from 'react';
import { FaUserPlus, FaMoneyBillWave, FaChartPie } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Working = () => {
  const steps = [
    {
      title: "Create Account",
      desc: "Sign up in seconds and securely connect your favorite devices.",
      icon: <FaUserPlus className="h-8 w-8 text-blue-400" />
    },
    {
      title: "Log Daily Spend",
      desc: "Effortlessly input your income and expenses as they happen.",
      icon: <FaMoneyBillWave className="h-8 w-8 text-emerald-400" />
    },
    {
      title: "Master Finance",
      desc: "Watch your savings grow with real-time analytics and insights.",
      icon: <FaChartPie className="h-8 w-8 text-indigo-400" />
    }
  ];

  return (
    <section className="bg-slate-800/30 py-24 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Your Path to Wealth</h2>
        <p className="text-slate-400 mb-16 max-w-2xl mx-auto font-medium">Getting started with ExpenseMate is simple. Follow these steps to transform your financial life.</p>
        
        <div className="flex flex-col md:flex-row justify-center gap-12 relative">
          {/* Connecting lines for desktop */}
          <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex-1 group relative z-10 animate-in zoom-in duration-500">
              <div className="flex justify-center mb-8 relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-lg border-2 border-slate-900 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <div className="flex items-center justify-center h-24 w-24 rounded-[2rem] bg-slate-900 border border-slate-700/50 shadow-2xl group-hover:border-blue-500/30 transition-all duration-300">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium px-4">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-20">
          <NavLink to="/signup" className="inline-flex items-center px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 active:scale-95 shadow-xl shadow-white/5">
            Get Started Now
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default Working;
