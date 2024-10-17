import React from 'react';
import { useUser } from "../Context/UserContext";

const Profile = () => {
  const user = useUser();
  console.log(user);
  
 

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen w-screen flex flex-col items-center">
      <div className="max-w-lg w-full bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-center py-6 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:from-gray-700 dark:via-gray-700 dark:to-gray-800">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {user.name}
          </h2>
        </div>

        <div className="text-center p-6">

          <div className="flex justify-center items-center gap-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
           
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <button className="py-2 px-6 bg-blue-500 hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-full transition duration-200">
              Follow
            </button>
            <button className="py-2 px-6 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-full transition duration-200">
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
