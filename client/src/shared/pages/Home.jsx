import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import heroImage from '../assets/job_portal_hero.png';
import { MdOutlineWork } from 'react-icons/md';

const fetchUri = import.meta.env.VITE_FETCH_URI || '';

const Home = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${fetchUri}/api/login`, {
        email,
        password
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userid', user._id);
        navigate(`/dashboard/${user._id}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.err || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="login-container">
        <motion.div
          className="login-visual"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={heroImage} alt="Job Portal" />
          <div className="visual-overlay">
            <h1>Find Your Dream Job</h1>
            <p>Connect with top employers and advance your career</p>
          </div>
        </motion.div>

        <motion.div
          className="login-form-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="login-card">
            <div className="login-header">
              <div className="logo">
                <MdOutlineWork className="logo-icon" />
                <h2>Local<span>Hire</span></h2>
              </div>
              <h3>Welcome Back</h3>
              <p>Sign in to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading || !email || !password}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="register-prompt">
                Don't have an account? <span>Contact administrator</span>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;