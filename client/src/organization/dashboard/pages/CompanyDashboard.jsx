import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Divider,
  Button,
  Paper,
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../../../shared/context/AuthContext';

const stats = [
  {
    title: 'Active Jobs',
    value: '4',
    change: '1 posted this week',
    icon: WorkOutlineIcon,
    color: '#1976D2',
    bgColor: '#E3F2FD',
  },
  {
    title: 'Total Applicants',
    value: '128',
    change: '+15 since yesterday',
    icon: GroupOutlinedIcon,
    color: '#6A1B9A',
    bgColor: '#F3E5F5',
  },
  {
    title: 'Interviews',
    value: '12',
    change: '3 scheduled today',
    icon: EventAvailableOutlinedIcon,
    color: '#E65100',
    bgColor: '#FFF3E0',
  },
  {
    title: 'Hired Candidates',
    value: '5',
    change: '+2 this month',
    icon: CheckCircleOutlineIcon,
    color: '#2E7D32',
    bgColor: '#E8F5E9',
  },
];

const activities = [
  { color: '#1976D2', text: 'Sarah Jenkins applied for Senior React Developer', time: '10 mins ago' },
  { color: '#E65100', text: 'Interview scheduled with Michael Scott', time: '2 hours ago' },
  { color: '#2E7D32', text: 'Offer accepted by Dwight Schrute', time: '1 day ago' },
];

const recentApplicants = [
  {
    id: 1,
    name: 'Alice Freeman',
    role: 'Senior React Developer',
    experience: '5 Years',
    status: 'New',
    statusColor: '#1976D2',
    statusBg: '#E3F2FD',
    appliedAt: '2 hours ago',
  },
  {
    id: 2,
    name: 'Bob Martin',
    role: 'UX/UI Designer',
    experience: '3 Years',
    status: 'Under Review',
    statusColor: '#E65100',
    statusBg: '#FFF3E0',
    appliedAt: '5 hours ago',
  },
  {
    id: 3,
    name: 'Charlie Davis',
    role: 'Backend Node.js Engineer',
    experience: '7 Years',
    status: 'Interviewing',
    statusColor: '#6A1B9A',
    statusBg: '#F3E5F5',
    appliedAt: '1 day ago',
  },
];

const ApplicantCard = ({ applicant }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 3,
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: 'primary.main',
        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.08)',
      },
    }}
  >
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src={`https://ui-avatars.com/api/?name=${applicant.name}&background=random`}
          sx={{ width: 48, height: 48 }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            {applicant.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Applied for <strong>{applicant.role}</strong> • {applicant.experience}
          </Typography>
        </Box>
      </Box>
      <Box textAlign="right">
        <Chip
          label={applicant.status}
          size="small"
          sx={{
            fontWeight: 600,
            color: applicant.statusColor,
            bgcolor: applicant.statusBg,
            mb: 1,
          }}
        />
        <Typography variant="caption" color="text.secondary" display="block">
          {applicant.appliedAt}
        </Typography>
      </Box>
    </Box>
    <Box mt={2} display="flex" gap={1.5}>
      <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
        View Resume
      </Button>
      <Button variant="contained" size="small" disableElevation sx={{ borderRadius: 2 }}>
        Schedule Interview
      </Button>
    </Box>
  </Paper>
);

const CompanyDashboard = () => {
  const { user } = useAuth();
  
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Welcome */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Welcome to the Employer Dashboard, {user?.companyName || user?.name || 'Company'} 🏢
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here is an overview of your job postings and applicants.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2.5} mb={4}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight={700} mt={0.5} lineHeight={1}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                        {stat.change}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{ bgcolor: stat.bgColor, width: 44, height: 44, borderRadius: 2 }}
                    >
                      <Icon sx={{ color: stat.color, fontSize: 22 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Recent Applicants + Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
            <Typography variant="h6" fontWeight={700}>Recent Applicants</Typography>
            <Button
              endIcon={<ArrowForwardIcon fontSize="small" />}
              size="small"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              View all candidates
            </Button>
          </Box>
          <Stack spacing={2.5}>
            {recentApplicants.map((applicant) => (
              <ApplicantCard key={applicant.id} applicant={applicant} />
            ))}
          </Stack>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Typography variant="h6" fontWeight={700} mb={2.5}>Recent Activity</Typography>
          <Paper
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5 }}
          >
            <Stack spacing={0} divider={<Divider flexItem />}>
              {activities.map((activity, i) => (
                <Box key={i} py={1.75}>
                  <Box display="flex" alignItems="flex-start" gap={1.5}>
                    <FiberManualRecordIcon sx={{ fontSize: 8, color: activity.color, mt: 0.7, flexShrink: 0 }} />
                    <Box flex={1}>
                      <Typography variant="body2" lineHeight={1.5}>{activity.text}</Typography>
                      <Typography variant="caption" color="text.disabled" mt={0.25} display="block">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Quick Actions */}
          <Paper
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5, mt: 2.5 }}
          >
            <Typography variant="subtitle2" fontWeight={700} mb={2}>Quick Actions</Typography>
            <Button variant="contained" fullWidth disableElevation sx={{ mb: 1.5, py: 1.5 }}>
              Post a New Job
            </Button>
            <Button variant="outlined" fullWidth sx={{ py: 1.5 }}>
              Review Shortlisted
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyDashboard;
