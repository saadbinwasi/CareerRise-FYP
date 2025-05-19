import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, user } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/signin" />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default PrivateRoute;