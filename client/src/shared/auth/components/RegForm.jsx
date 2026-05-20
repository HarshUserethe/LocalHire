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

const fetchUri = import.meta.env.VITE_FETCH_URI;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  border: '1px solid #384BFF',
  borderRadius: '16px',
};

const RegForm = ({ handleRegClose, regOpen }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const { registerEmployee } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await registerEmployee(formData.fullname, formData.email, formData.password);
      if (success) {
        handleRegClose();
        navigate(`/dashboard`);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Modal open={regOpen} onClose={handleRegClose} aria-labelledby="register-modal">
        <Box sx={style}>
          <div className="register-form-container">
            <div className="register-header">
              <h2>Create Account</h2>
              <p>Join LocalHire today</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {error && <div className="error-message">{error}</div>}

              <TextField
                label="Full Name"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />

              <TextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
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
                disabled={loading || !formData.fullname || !formData.email || !formData.phone || !formData.password}
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="register-footer">
              <p>Already have an account? <span onClick={handleRegClose} style={{ cursor: 'pointer', color: '#384BFF', fontWeight: 600 }}>Sign in</span></p>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

RegForm.propTypes = {
  handleRegClose: PropTypes.func.isRequired,
  regOpen: PropTypes.bool.isRequired,
};

export default RegForm;