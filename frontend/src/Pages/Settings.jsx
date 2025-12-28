import { useEffect, useState } from "react";
import { useTheme } from "../Context/ThemeContext";

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-12">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Customize your experience and manage your account preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Notification Settings */}
        <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            Notifications
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-4 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-blue-600 focus:ring-blue-500" />
              <span className="text-slate-600 dark:text-slate-300 font-medium group-hover:text-blue-500 transition-colors">Receive Email Alerts</span>
            </label>
            <label className="flex items-center gap-4 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-blue-600 focus:ring-blue-500" />
              <span className="text-slate-600 dark:text-slate-300 font-medium group-hover:text-blue-500 transition-colors">Daily Summary Reports</span>
            </label>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            Appearance
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Switch between light and dark modes according to your preference.
          </p>
          <button
            onClick={toggleDarkMode}
            className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg ${
              isDarkMode 
              ? 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-yellow-900/20' 
              : 'bg-slate-800 text-white hover:bg-slate-700 shadow-slate-900/20'
            }`}
          >
            Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-8 rounded-[2.5rem] shadow-xl md:col-span-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            Danger Zone
          </h3>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
            <div>
              <h4 className="text-rose-500 font-bold mb-1">Delete Account</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                This action is permanent and cannot be undone. All your data will be wiped.
              </p>
            </div>
            <button className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-900/20">
              Delete Forever
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
