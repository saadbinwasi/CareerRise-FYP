import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [signupData, setSignupData] = useState({
    email: '',
    educationLevel: '',
    institutionName: '',
    major: '',
    graduationMonth: '',
    graduationYear: '',
    password: '',
    name: '',
    about: '',
  });

  const [signinData, setSigninData] = useState({
    email: '',
    password: '',
  });

  const [signupErrors, setSignupErrors] = useState({});
  const [signinErrors, setSigninErrors] = useState({});

  const updateSignupData = (newData) => {
    setSignupData((prev) => ({ ...prev, ...newData }));
    setSignupErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newData).forEach((key) => {
        if (newErrors[key]) delete newErrors[key];
      });
      return newErrors;
    });
  };

  const updateSigninData = (newData) => {
    setSigninData((prev) => ({ ...prev, ...newData }));
    setSigninErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newData).forEach((key) => {
        if (newErrors[key]) delete newErrors[key];
      });
      return newErrors;
    });
  };

  const value = {
    signupData,
    signinData,
    signupErrors,
    signinErrors,
    updateSignupData,
    updateSigninData,
    setSignupErrors,
    setSigninErrors,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};