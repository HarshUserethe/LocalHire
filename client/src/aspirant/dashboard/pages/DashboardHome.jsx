import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import JobCard from '../../../shared/ui/components/JobCard';
import { useAuth } from '../../../shared/context/AuthContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const DashboardHome = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [statsData, setStatsData] = useState({ totalApplied: 0, activeApplications: 0, shortlisted: 0 });
  const [activities, setActivities] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [applicationStatusData, setApplicationStatusData] = useState({
    under_review: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  });

  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [allLogs, setAllLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch stats
        const statsRes = await axios.get('/dashboard/aspirant/stats');
        if (statsRes.data.success) {
          setStatsData(statsRes.data.data.stats);
        }

        // Fetch recent activity
        const activityRes = await axios.get('/dashboard/aspirant/recent-activity?limit=3');
        if (activityRes.data.success) {
          setActivities(activityRes.data.data.logs);
        }

        // Fetch recommended jobs
        const jobsRes = await axios.get('/dashboard/aspirant/recommended-jobs?limit=5');
        if (jobsRes.data.success) {
          setRecommendedJobs(jobsRes.data.data.jobs);
        }

        // Fetch applications to determine status distribution
        const appsRes = await axios.get('/dashboard/aspirant/applications?limit=100');
        if (appsRes.data.success) {
          const apps = appsRes.data.data.applications;
          const statusCount = { under_review: 0, shortlisted: 0, rejected: 0, hired: 0 };
          apps.forEach(app => {
            if (statusCount[app.status] !== undefined) {
              statusCount[app.status]++;
            } else if (app.status === 'applied') {
              statusCount.under_review++; // treat applied as under review for simplification
            }
          });
          setApplicationStatusData(statusCount);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleViewMoreLogs = async () => {
    setLogsModalOpen(true);
    setLoadingLogs(true);
    try {
      const res = await axios.get('/dashboard/aspirant/recent-activity?limit=50');
      if (res.data.success) {
        setAllLogs(res.data.data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLogs(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const dynamicStats = [
    {
      title: 'Applied Jobs',
      value: statsData.totalApplied || 0,
      change: 'Total submitted',
      icon: WorkOutlineIcon,
      color: '#1976D2',
      bgColor: '#E3F2FD',
    },
    {
      title: 'Active Applications',
      value: statsData.activeApplications || 0,
      change: 'In progress',
      icon: DescriptionOutlinedIcon,
      color: '#2E7D32',
      bgColor: '#E8F5E9',
    },
    {
      title: 'Saved Jobs',
      value: '0', // Placeholder
      change: 'Coming soon',
      icon: BookmarkBorderIcon,
      color: '#6A1B9A',
      bgColor: '#F3E5F5',
    },
    {
      title: 'Profile Views',
      value: '0', // Placeholder
      change: 'Coming soon',
      icon: TrendingUpIcon,
      color: '#E65100',
      bgColor: '#FFF3E0',
    },
  ];

  const getLogColor = (actionType) => {
    switch (actionType) {
      case 'LOGIN': return '#1976D2';
      case 'JOB_APPLY': return '#2E7D32';
      case 'PROFILE_UPDATE': return '#6A1B9A';
      default: return '#757575';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Welcome */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Welcome back, {user?.name || user?.companyName || 'User'} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here's what's happening with your job search today.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2.5} mb={4}>
        {dynamicStats.map((stat, i) => {
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

      {/* Recommended Jobs + Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
            <Typography variant="h6" fontWeight={700}>Recommended for You</Typography>
            <Button
              endIcon={<ArrowForwardIcon fontSize="small" />}
              size="small"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              View all
            </Button>
          </Box>
          <Stack spacing={2.5}>
            {recommendedJobs.length > 0 ? (
              recommendedJobs.map((job) => {
                const mappedJob = {
                  id: job._id,
                  title: job.jobTitle,
                  company: job.companyName,
                  location: `${job.jobcity}, ${job.jobstate || ''}`.replace(/,\s*$/, ''),
                  salary: job.monthlyInHandSalary ? `₹${job.monthlyInHandSalary}/mo` : 'Not Disclosed',
                  type: job.jobType,
                  description: job.jobDescription ? job.jobDescription.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : '',
                  logo: '',
                  postedAt: formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }),
                  tags: job.skills || []
                };
                return <JobCard key={job._id} job={mappedJob} />;
              })
            ) : (
              <Typography color="text.secondary">No recommended jobs yet. Update your profile to get matched!</Typography>
            )}
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
              {activities.length > 0 ? (
                activities.map((activity, i) => (
                  <Box key={activity._id || i} py={1.75}>
                    <Box display="flex" alignItems="flex-start" gap={1.5}>
                      <FiberManualRecordIcon sx={{ fontSize: 8, color: getLogColor(activity.actionType), mt: 0.7, flexShrink: 0 }} />
                      <Box flex={1}>
                        <Typography variant="body2" lineHeight={1.5}>{activity.description}</Typography>
                        <Typography variant="caption" color="text.disabled" mt={0.25} display="block">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No recent activity found.</Typography>
              )}
            </Stack>
            {activities.length > 0 && (
              <Button onClick={handleViewMoreLogs} size="small" fullWidth sx={{ mt: 1 }}>
                View More
              </Button>
            )}
          </Paper>

          {/* Quick Stats */}
          <Paper
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5, mt: 2.5 }}
          >
            <Typography variant="subtitle2" fontWeight={700} mb={2}>Application Status</Typography>
            {[
              { label: 'Under Review', count: applicationStatusData.under_review, color: '#1976D2' },
              { label: 'Shortlisted', count: applicationStatusData.shortlisted, color: '#2E7D32' },
              { label: 'Offer Received / Hired', count: applicationStatusData.hired, color: '#E65100' },
              { label: 'Rejected', count: applicationStatusData.rejected, color: '#C62828' },
            ].map((item, i) => (
              <Box key={i} display="flex" alignItems="center" justifyContent="space-between" mb={i < 3 ? 1.5 : 0}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                  <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                </Box>
                <Chip
                  label={item.count || 0}
                  size="small"
                  sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'grey.100', '& .MuiChip-label': { px: 0.75 } }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={logsModalOpen} onClose={() => setLogsModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Recent Activity (Top 50)</DialogTitle>
        <DialogContent dividers>
          {loadingLogs ? <CircularProgress /> : (
            <List>
              {allLogs.map((log) => (
                <ListItem key={log._id}>
                  <ListItemText 
                    primary={log.description} 
                    secondary={formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })} 
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogsModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardHome;