import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const LogoutComponent = () => {
  const handleLogout = () => {
    // Handle logout logic here if needed
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <span>Are you sure you want to log out?</span>
      <button onClick={handleLogout} className="flex items-center">
        <AiOutlineClose className="text-lg mr-2" />
        Logout
      </button>
    </div>
  );
};

export default LogoutComponent;
