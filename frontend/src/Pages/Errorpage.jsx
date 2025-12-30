import React from 'react';
import { useNavigate } from 'react-router-dom';

const Errorpage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative text-center z-10 max-w-lg w-full">
        {/* 404 Text */}
        <h1 className="text-[12rem] font-bold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 opacity-50 select-none">
          404
        </h1>

        {/* Glass Card */}
        <div className="bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-8 rounded-[2rem] shadow-2xl -mt-16 relative">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Page Not Found
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="group relative w-full inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-slate-900 dark:bg-indigo-600 rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">
              Error Code: 404
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Errorpage;