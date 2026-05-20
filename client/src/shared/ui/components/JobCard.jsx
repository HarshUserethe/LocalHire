import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Avatar,
  Stack,
  Divider,
  Tooltip,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const JobCard = ({ job, onSave, onApply }) => {
  const [saved, setSaved] = useState(false);

  const {
    id,
    title,
    company,
    location,
    salary,
    type,
    description,
    logo,
    postedAt,
    tags = [],
  } = job;

  const handleSave = () => {
    setSaved((prev) => !prev);
    onSave && onSave(id);
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderColor: 'primary.light',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              src={logo}
              alt={company}
              variant="rounded"
              sx={{ width: 48, height: 48, bgcolor: 'grey.100', fontSize: 16, fontWeight: 700 }}
            >
              {company?.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                  lineHeight: 1.3,
                }}
              >
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {company}
              </Typography>
            </Box>
          </Box>
          <Tooltip title={saved ? 'Remove from saved' : 'Save job'}>
            <IconButton onClick={handleSave} size="small" sx={{ color: saved ? 'primary.main' : 'text.secondary' }}>
              {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Meta Info */}
        <Stack direction="row" spacing={2} mb={2} flexWrap="wrap" useFlexGap>
          <Box display="flex" alignItems="center" gap={0.5}>
            <LocationOnOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">{location}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <AttachMoneyIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">{salary}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <AccessTimeIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">{postedAt}</Typography>
          </Box>
        </Stack>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>

        {/* Tags */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={2.5}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{
                bgcolor: 'primary.50',
                color: 'primary.main',
                fontWeight: 500,
                fontSize: '0.7rem',
                height: 24,
                border: '1px solid',
                borderColor: 'primary.100',
              }}
            />
          ))}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Footer */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Chip
            label={type}
            size="small"
            sx={{
              bgcolor: 'grey.100',
              color: 'text.secondary',
              fontSize: '0.7rem',
              fontWeight: 500,
              height: 24,
            }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              disableElevation
              onClick={() => onApply && onApply(id)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                px: 2,
              }}
            >
              Apply Now
            </Button>
            <IconButton
              size="small"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
              }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;