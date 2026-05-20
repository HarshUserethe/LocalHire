import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:5000/api/v1';
  axios.defaults.withCredentials = true; // Important for cookies

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const res = await axios.get('/auth/me');
        setUser(res.data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      setUser(res.data.user);
      toast.success('Login successful!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const registerEmployee = async (name, email, password) => {
    try {
      const res = await axios.post('/auth/register/employee', { name, email, password });
      setUser(res.data.user);
      toast.success('Registration successful!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const registerCompany = async (companyName, email, password) => {
    try {
      const res = await axios.post('/auth/register/company', { companyName, email, password });
      setUser(res.data.user);
      toast.success('Registration successful!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.get('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerEmployee, registerCompany, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
