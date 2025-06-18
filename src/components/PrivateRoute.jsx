import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Optionally, render a loading spinner or message while authentication status is being determined
    return <div className="text-white text-center py-10">Chargement...</div>;
  }

  if (!currentUser) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    // Authenticated but not authorized, redirect to dashboard or show an error
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute; 