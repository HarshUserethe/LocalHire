import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import { useAuth } from '../../../shared/context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';

const fetchUri = import.meta.env.VITE_FETCH_URI;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  border: '1px solid #384BFF',
  borderRadius: '16px',
};

const LoginForm = ({ handleClose, open }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        handleClose();
        navigate(`/dashboard`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Modal open={open} onClose={handleClose} aria-labelledby="login-modal">
        <Box sx={style}>
          <div className="login-form-container">
            <div className="login-logo">
              <h2>Local<span>Hire</span></h2>
              <p>Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              {error && <div className="error-message">{error}</div>}

              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !email || !password}
                sx={{
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #384BFF 0%, #192bc2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #192bc2 0%, #384BFF 100%)',
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="login-footer">
              <p>Demo credentials: test@test.com / test</p>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

LoginForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default LoginForm;