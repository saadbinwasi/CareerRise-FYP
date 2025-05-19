import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const AdminRoute = ({ children }) => {
  const { user, token } = useContext(AuthContext);

  if (!user || !token) {
    return <Navigate to="/signin" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;