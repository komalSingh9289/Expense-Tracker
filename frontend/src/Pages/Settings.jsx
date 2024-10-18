import { useEffect, useState } from "react";
import { useTheme } from "../Context/ThemeContext";

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 w-screen text-gray-800 dark:text-gray-200">
      <h2 className="mt-6 text-2xl flex justify-center font-bold mb-6 text-gray-900 dark:text-white">
        Settings
      </h2>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Notification Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input type="checkbox" id="email-notifications" className="mr-2 " />
            <label
              htmlFor="email-notifications"
              className="text-gray-800 text-sm dark:text-gray-200"
            >
              Receive Email Notifications
            </label>
          </div>
        
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Theme Settings
        </h3>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded text-sm bg-blue-600 dark:bg-yellow-400 text-white dark:text-black"
        >
          Toggle to {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Security Settings
        </h3>
        <button className="text-sm bg-red-600 dark:bg-red-500 p-2 rounded text-white">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
