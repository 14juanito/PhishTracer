import React from 'react';
import { FiUser } from 'react-icons/fi';

const UserStatus = ({ user }) => {
  if (!user) return null;

  return (
    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
      <FiUser className="text-gray-500" />
      <span className="text-gray font-medium">{user.name}</span>
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-green-500 text-sm">Actif</span>
      </div>
    </div>
  );
};

export default UserStatus; 