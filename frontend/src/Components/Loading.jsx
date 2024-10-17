import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-16 w-16 mb-4 text-purple-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8v4a4 4 0 1 0 0 8v4a8 8 0 0 1-8-8z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Loading, please wait...
        </h2>
      </div>
    </div>
  );
};

export default Loading;
