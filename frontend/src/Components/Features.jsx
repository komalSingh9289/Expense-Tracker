import React from 'react';
import { FaChartLine, FaTags, FaFileAlt } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      title: "Smart Budgeting",
      description: "Set and manage your budget effortlessly with our intelligent tracking system.",
      icon: <FaChartLine className="h-8 w-8 text-blue-400" />,
      delay: "duration-500"
    },
    {
      title: "Smart Categories",
      description: "Automatically organize your spending into meaningful categories for better clarity.",
      icon: <FaTags className="h-8 w-8 text-indigo-400" />,
      delay: "duration-700"
    },
    {
      title: "Deep Analytics",
      description: "Gain powerful insights into your financial habits with rich, interactive reports.",
      icon: <FaFileAlt className="h-8 w-8 text-sky-400" />,
      delay: "duration-1000"
    }
  ];

  return (
    <section className="bg-slate-900 py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          Everything You Need to Succeed
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-16 font-medium">
          Powerful tools designed to give you a complete picture of your finances, so you can make smarter decisions every day.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group bg-slate-800/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-700/50 transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-800/60 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom ${feature.delay}`}
            >
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-slate-900 border border-slate-700/50 mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
