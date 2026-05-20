import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../../shared/context/AuthContext';
import { toast } from 'react-hot-toast';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

const fetchUri = import.meta.env.VITE_FETCH_URI || 'http://localhost:5000';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    description: '',
    website: '',
    location: '',
    industry: '',
    hiringRoles: [],
    benefits: []
  });

  const [newRole, setNewRole] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id && !user?._id) return;
      try {
        const userId = user.id || user._id;
        const response = await fetch(`${fetchUri}/api/v1/users/${userId}`);
        const data = await response.json();
        
        if (data.success && data.data?.user) {
          const u = data.data.user;
          const profile = u.organizationProfile || {};
          
          setFormData({
            companyName: u.companyName || u.name || '',
            phone: u.phone || '',
            description: profile.description || '',
            website: profile.website || '',
            location: profile.location || '',
            industry: profile.industry || '',
            hiringRoles: profile.hiringRoles || [],
            benefits: profile.benefits || []
          });
        }
      } catch (err) {
        toast.error('Failed to load profile data');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChip = (type, value, setInput) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }));
    setInput('');
  };

  const handleRemoveChip = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        companyName: formData.companyName,
        phone: formData.phone,
        organizationProfile: {
          description: formData.description,
          website: formData.website,
          location: formData.location,
          industry: formData.industry,
          hiringRoles: formData.hiringRoles,
          benefits: formData.benefits
        }
      };

      const userId = user.id || user._id;
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${fetchUri}/api/v1/users/${userId}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Company profile updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
        Company Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Complete your organization's profile to attract the best talent.
      </Typography>

      <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Industry"
                name="industry"
                placeholder="e.g. Information Technology, Healthcare"
                value={formData.industry}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website URL"
                name="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location / Headquarters"
                name="location"
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Description"
                name="description"
                multiline
                rows={4}
                placeholder="Tell candidates about your company's mission, vision, and culture..."
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            {/* Hiring Details */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Hiring & Culture
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Open Roles / Frequently Hired
                </Typography>
                <Box display="flex" gap={1} mb={1}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="e.g. Frontend Developer"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChip('hiringRoles', newRole, setNewRole))}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={() => handleAddChip('hiringRoles', newRole, setNewRole)}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    Add
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.hiringRoles.map((role, idx) => (
                    <Chip
                      key={idx}
                      label={role}
                      onDelete={() => handleRemoveChip('hiringRoles', idx)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Company Benefits & Perks
                </Typography>
                <Box display="flex" gap={1} mb={1}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="e.g. Remote Work, Health Insurance"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChip('benefits', newBenefit, setNewBenefit))}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={() => handleAddChip('benefits', newBenefit, setNewBenefit)}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    Add
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.benefits.map((benefit, idx) => (
                    <Chip
                      key={idx}
                      label={benefit}
                      onDelete={() => handleRemoveChip('benefits', idx)}
                      color="success"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ px: 4 }}
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </Box>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CompanyProfile;
