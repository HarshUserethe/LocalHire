import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Button,
  InputAdornment,
  OutlinedInput,
  Divider,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TuneIcon from '@mui/icons-material/Tune';
import JobCard from '../../../shared/ui/components/JobCard';

const jobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp',
    location: 'New York, NY',
    salary: '$80k – $120k',
    type: 'Full-time',
    description: 'We are looking for a Senior React Developer to join our team and help build amazing user experiences.',
    logo: '',
    postedAt: '2 days ago',
    tags: ['React', 'JavaScript', 'TypeScript'],
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    company: 'DesignStudio',
    location: 'San Francisco, CA',
    salary: '$70k – $100k',
    type: 'Full-time',
    description: 'Join our creative team as a UX/UI Designer and help shape the future of digital experiences.',
    logo: '',
    postedAt: '1 week ago',
    tags: ['Figma', 'Sketch', 'Prototyping'],
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    salary: '$60k – $90k',
    type: 'Full-time',
    description: 'Exciting opportunity for a Full Stack Developer to work on cutting-edge projects.',
    logo: '',
    postedAt: '3 days ago',
    tags: ['Node.js', 'React', 'MongoDB'],
  },
  {
    id: 4,
    title: 'Product Manager',
    company: 'GrowthCo',
    location: 'Remote',
    salary: '$90k – $130k',
    type: 'Remote',
    description: 'Lead product strategy, work cross-functionally with engineering and design to ship impactful features.',
    logo: '',
    postedAt: '5 days ago',
    tags: ['Product Strategy', 'Roadmap', 'Agile'],
  },
];

const JobListings = () => {
  const [filters, setFilters] = useState({ location: '', experience: '', salary: '', type: '' });
  const [activeChips, setActiveChips] = useState([]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleChip = (label) => {
    setActiveChips((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const quickFilters = ['Remote', 'Full-time', 'Part-time', 'Contract', 'Entry Level', 'Senior'];

  const handleSave = (id) => console.log('Save:', id);
  const handleApply = (id) => console.log('Apply:', id);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Find Your Dream Job
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Discover opportunities that match your skills and interests
        </Typography>
      </Box>

      {/* Filters Panel */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, mb: 3 }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={2.5}>
          <TuneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="subtitle2" fontWeight={600}>Filters</Typography>
        </Box>

        <Grid container spacing={2} mb={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Location</InputLabel>
              <Select
                value={filters.location}
                label="Location"
                onChange={(e) => handleFilterChange('location', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <LocationOnOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </InputAdornment>
                }
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value=""><em>All Locations</em></MenuItem>
                <MenuItem value="new-york">New York</MenuItem>
                <MenuItem value="san-francisco">San Francisco</MenuItem>
                <MenuItem value="austin">Austin</MenuItem>
                <MenuItem value="remote">Remote</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Experience Level</InputLabel>
              <Select
                value={filters.experience}
                label="Experience Level"
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <WorkOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </InputAdornment>
                }
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value=""><em>All Levels</em></MenuItem>
                <MenuItem value="entry">Entry Level</MenuItem>
                <MenuItem value="mid">Mid Level</MenuItem>
                <MenuItem value="senior">Senior Level</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Salary Range</InputLabel>
              <Select
                value={filters.salary}
                label="Salary Range"
                onChange={(e) => handleFilterChange('salary', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <AttachMoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </InputAdornment>
                }
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value=""><em>Any Salary</em></MenuItem>
                <MenuItem value="0-50k">$0 – $50k</MenuItem>
                <MenuItem value="50k-100k">$50k – $100k</MenuItem>
                <MenuItem value="100k+">$100k+</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Job Type</InputLabel>
              <Select
                value={filters.type}
                label="Job Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value=""><em>All Types</em></MenuItem>
                <MenuItem value="full-time">Full-time</MenuItem>
                <MenuItem value="part-time">Part-time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="remote">Remote</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Quick Filter Chips */}
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <Typography variant="caption" color="text.secondary" mr={0.5}>Quick:</Typography>
          {quickFilters.map((label) => (
            <Chip
              key={label}
              label={label}
              size="small"
              clickable
              onClick={() => toggleChip(label)}
              sx={{
                height: 26,
                fontSize: '0.72rem',
                fontWeight: 500,
                bgcolor: activeChips.includes(label) ? 'primary.main' : 'grey.100',
                color: activeChips.includes(label) ? 'white' : 'text.secondary',
                '&:hover': {
                  bgcolor: activeChips.includes(label) ? 'primary.dark' : 'grey.200',
                },
                border: 'none',
              }}
            />
          ))}
          {(activeChips.length > 0 || Object.values(filters).some(Boolean)) && (
            <Button
              size="small"
              onClick={() => { setFilters({ location: '', experience: '', salary: '', type: '' }); setActiveChips([]); }}
              sx={{ fontSize: '0.72rem', textTransform: 'none', color: 'error.main', ml: 'auto' }}
            >
              Clear all
            </Button>
          )}
        </Box>
      </Paper>

      {/* Results Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
        <Typography variant="subtitle1" fontWeight={600}>
          {jobs.length} Jobs Found
        </Typography>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select defaultValue="recent" sx={{ borderRadius: 2, fontSize: '0.85rem' }}>
            <MenuItem value="recent">Most Recent</MenuItem>
            <MenuItem value="relevant">Most Relevant</MenuItem>
            <MenuItem value="salary">Highest Salary</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Job Cards */}
      <Stack spacing={2.5}>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onSave={handleSave} onApply={handleApply} />
        ))}
      </Stack>
    </Box>
  );
};

export default JobListings;