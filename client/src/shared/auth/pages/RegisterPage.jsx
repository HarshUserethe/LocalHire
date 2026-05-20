import React, { useState, useRef } from 'react';
import {
  Box, Typography, TextField, Button, CircularProgress, Link,
  InputAdornment, IconButton, ToggleButtonGroup, ToggleButton,
  Divider, Alert, Fade, MenuItem, Stepper, Step, StepLabel, Chip,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

const fetchUri = import.meta.env.VITE_FETCH_URI;

// ── Constants ──────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
];
const EXPERIENCE_OPTIONS = [
  { value: 'fresher', label: 'Fresher (0 years)' },
  { value: '0-1', label: 'Less than 1 year' },
  { value: '1-2', label: '1–2 years' },
  { value: '2-5', label: '2–5 years' },
  { value: '5-10', label: '5–10 years' },
  { value: '10+', label: '10+ years' },
];
const COMPANY_TYPES = [
  'Private Limited', 'Public Limited', 'LLP', 'Partnership',
  'Sole Proprietorship', 'Government / PSU', 'NGO / Non-profit', 'Startup',
];
const INDUSTRIES = [
  'Information Technology', 'Finance & Banking', 'Healthcare', 'Education',
  'Manufacturing', 'Retail & E-commerce', 'Media & Entertainment',
  'Construction & Real Estate', 'Logistics & Supply Chain', 'Other',
];
const currentYear = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 20 }, (_, i) => currentYear - i + 4);

// ── Helpers ────────────────────────────────────────────────────────────────
const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: 'Too short', color: '#EF5350' },
    { label: 'Weak', color: '#EF5350' },
    { label: 'Fair', color: '#FFA726' },
    { label: 'Good', color: '#66BB6A' },
    { label: 'Strong', color: '#43A047' },
  ];
  return { score, ...map[score] };
};

// ── Shared sub-components ──────────────────────────────────────────────────
const FieldLabel = ({ children, required }) => (
  <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.75} display="block">
    {children}
    {required && <Box component="span" sx={{ color: 'error.main', ml: 0.25 }}>*</Box>}
  </Typography>
);

const SectionHeading = ({ children }) => (
  <Box mb={2} mt={0.5}>
    <Typography variant="overline" color="text.disabled" fontWeight={700} letterSpacing={1.2} fontSize="0.65rem">
      {children}
    </Typography>
    <Divider sx={{ mt: 0.5 }} />
  </Box>
);

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: 'grey.50',
    fontSize: '0.875rem',
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
    '&.Mui-focused': { bgcolor: 'background.paper' },
  },
};

const PasswordStrengthBar = ({ password }) => {
  const s = getPasswordStrength(password);
  if (!password) return null;
  return (
    <Box mt={1} display="flex" alignItems="center" gap={1.5}>
      <Box display="flex" gap={0.5}>
        {[1, 2, 3, 4].map(i => (
          <Box key={i} sx={{ height: 3, width: 36, borderRadius: 4, bgcolor: i <= s.score ? s.color : 'grey.200', transition: 'background 0.3s' }} />
        ))}
      </Box>
      <Typography variant="caption" sx={{ color: s.color, fontWeight: 600 }}>{s.label}</Typography>
    </Box>
  );
};

const UploadBox = ({ fileRef, file, onChange, label, hint, accept }) => (
  <Box>
    <Box
      onClick={() => fileRef.current?.click()}
      sx={{
        border: '1.5px dashed', borderColor: file ? 'primary.main' : 'divider',
        borderRadius: 2, p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5,
        cursor: 'pointer', bgcolor: file ? 'primary.50' : 'grey.50',
        transition: 'all 0.2s',
        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' },
      }}
    >
      <CloudUploadOutlinedIcon sx={{ fontSize: 22, color: file ? 'primary.main' : 'text.disabled', flexShrink: 0 }} />
      <Box flex={1} minWidth={0}>
        <Typography variant="body2" fontWeight={500} color={file ? 'primary.main' : 'text.secondary'} noWrap>
          {file ? file.name : label}
        </Typography>
        <Typography variant="caption" color="text.disabled">{hint}</Typography>
      </Box>
      {file && <CheckCircleOutlineIcon sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />}
    </Box>
    <input ref={fileRef} type="file" accept={accept} hidden onChange={onChange} />
  </Box>
);

// ══════════════════════════════════════════════════════════════════════════════
// EMPLOYEE FORM
// ══════════════════════════════════════════════════════════════════════════════
const EmployeeForm = ({ onSubmit, loading, error }) => {
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const resumeRef = useRef();

  const [form, setForm] = useState({
    fullname: '', email: '', phone: '', password: '', confirm: '',
    state: '', city: '',
    college: '', degree: '', graduationYear: '', experience: '',
    currentRole: '', skills: '', linkedIn: '',
    resume: null,
  });

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));
  const passwordMatch = form.confirm && form.password === form.confirm;
  const passwordMismatch = form.confirm && form.password !== form.confirm;

  const step1Valid =
    form.fullname && form.email && form.phone &&
    form.password && form.confirm && !passwordMismatch &&
    form.state && form.city;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!step1Valid) { setStep(0); return; }
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v && k !== 'confirm') data.append(k, v); });
    onSubmit(data);
  };

  const pwConfirmSx = {
    ...fieldSx,
    '& .MuiOutlinedInput-root': {
      ...fieldSx['& .MuiOutlinedInput-root'],
      ...(passwordMatch && { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#43A047' } }),
    },
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stepper activeStep={step} sx={{ mb: 3.5 }}>
        {['Personal Info', 'Education & Experience'].map(label => (
          <Step key={label}>
            <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.78rem', fontWeight: 600 }, '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' }, '& .MuiStepIcon-root.Mui-completed': { color: 'primary.main' } }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.82rem', mb: 2.5 }}>{error}</Alert>}

      {/* Step 1 */}
      <Box display={step === 0 ? 'flex' : 'none'} flexDirection="column" gap={2}>
        <SectionHeading>Basic Details</SectionHeading>

        <Box>
          <FieldLabel required>Full Name</FieldLabel>
          <TextField fullWidth size="small" placeholder="John Doe" value={form.fullname} onChange={set('fullname')} required sx={fieldSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
        </Box>

        <Box>
          <FieldLabel required>Email Address</FieldLabel>
          <TextField fullWidth size="small" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required sx={fieldSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
        </Box>

        <Box>
          <FieldLabel required>Mobile Number</FieldLabel>
          <TextField fullWidth size="small" placeholder="10-digit number" value={form.phone} onChange={set('phone')} required inputProps={{ maxLength: 10 }} sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <PhoneOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>+91</Typography>
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 14, alignSelf: 'center' }} />
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <SectionHeading>Location</SectionHeading>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <FieldLabel required>State</FieldLabel>
            <TextField select fullWidth size="small" value={form.state} onChange={set('state')} required sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }}>
              <MenuItem value="" disabled><Typography color="text.disabled" fontSize="0.875rem">Select</Typography></MenuItem>
              {INDIAN_STATES.map(s => <MenuItem key={s} value={s} sx={{ fontSize: '0.875rem' }}>{s}</MenuItem>)}
            </TextField>
          </Box>
          <Box>
            <FieldLabel required>City</FieldLabel>
            <TextField fullWidth size="small" placeholder="Your city" value={form.city} onChange={set('city')} required sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><ApartmentOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
          </Box>
        </Box>

        <SectionHeading>Security</SectionHeading>

        <Box>
          <FieldLabel required>Password</FieldLabel>
          <TextField fullWidth size="small" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={set('password')} required sx={fieldSx}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPw(p => !p)} edge="end" sx={{ color: 'text.disabled' }}>{showPw ? <VisibilityOffOutlinedIcon sx={{ fontSize: 17 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />}</IconButton></InputAdornment>,
            }} />
          <PasswordStrengthBar password={form.password} />
        </Box>

        <Box>
          <FieldLabel required>Confirm Password</FieldLabel>
          <TextField fullWidth size="small" type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} required
            error={passwordMismatch} helperText={passwordMismatch ? 'Passwords do not match' : ''} sx={pwConfirmSx}
            InputProps={{
              startAdornment: <InputAdornment position="start">{passwordMatch ? <CheckCircleOutlineIcon sx={{ fontSize: 17, color: '#43A047' }} /> : <LockOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} />}</InputAdornment>,
              endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowConfirm(p => !p)} edge="end" sx={{ color: 'text.disabled' }}>{showConfirm ? <VisibilityOffOutlinedIcon sx={{ fontSize: 17 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />}</IconButton></InputAdornment>,
            }} />
        </Box>

        <Button variant="contained" disableElevation disabled={!step1Valid} onClick={() => setStep(1)} endIcon={<ArrowForwardIcon />}
          sx={{ mt: 1, py: 1.4, borderRadius: 2, fontWeight: 600, textTransform: 'none' }}>
          Continue
        </Button>
      </Box>

      {/* Step 2 */}
      <Box display={step === 1 ? 'flex' : 'none'} flexDirection="column" gap={2}>
        <SectionHeading>Education</SectionHeading>

        <Box>
          <FieldLabel required>College / University</FieldLabel>
          <TextField fullWidth size="small" placeholder="e.g. IIT Bombay / Delhi University" value={form.college} onChange={set('college')} required sx={fieldSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><SchoolOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
        </Box>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <FieldLabel required>Degree</FieldLabel>
            <TextField fullWidth size="small" placeholder="B.Tech / MBA / B.Sc" value={form.degree} onChange={set('degree')} required sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><SchoolOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
          </Box>
          <Box>
            <FieldLabel required>Graduation Year</FieldLabel>
            <TextField select fullWidth size="small" value={form.graduationYear} onChange={set('graduationYear')} required sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonthOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }}>
              <MenuItem value="" disabled><Typography color="text.disabled" fontSize="0.875rem">Year</Typography></MenuItem>
              {GRAD_YEARS.map(y => <MenuItem key={y} value={y} sx={{ fontSize: '0.875rem' }}>{y}</MenuItem>)}
            </TextField>
          </Box>
        </Box>

        <SectionHeading>Work Experience</SectionHeading>

        <Box>
          <FieldLabel required>Experience Level</FieldLabel>
          <TextField select fullWidth size="small" value={form.experience} onChange={set('experience')} required sx={fieldSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><WorkOutlineIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }}>
            <MenuItem value="" disabled><Typography color="text.disabled" fontSize="0.875rem">Select experience</Typography></MenuItem>
            {EXPERIENCE_OPTIONS.map(o => <MenuItem key={o.value} value={o.value} sx={{ fontSize: '0.875rem' }}>{o.label}</MenuItem>)}
          </TextField>
        </Box>

        {form.experience && form.experience !== 'fresher' && (
          <Box>
            <FieldLabel>Current / Last Job Title</FieldLabel>
            <TextField fullWidth size="small" placeholder="e.g. Software Engineer" value={form.currentRole} onChange={set('currentRole')} sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><BusinessCenterOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
          </Box>
        )}

        <Box>
          <FieldLabel>Key Skills <Typography component="span" variant="caption" color="text.disabled">(comma-separated)</Typography></FieldLabel>
          <TextField fullWidth size="small" placeholder="React, Node.js, Python…" value={form.skills} onChange={set('skills')} sx={fieldSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><WorkOutlineIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
          {form.skills && (
            <Box display="flex" flexWrap="wrap" gap={0.75} mt={1}>
              {form.skills.split(',').filter(s => s.trim()).map((s, i) => (
                <Chip key={i} label={s.trim()} size="small"
                  sx={{ height: 22, fontSize: '0.7rem', fontWeight: 500, bgcolor: 'primary.50', color: 'primary.main', border: '1px solid', borderColor: 'primary.100', '& .MuiChip-label': { px: 1 } }} />
              ))}
            </Box>
          )}
        </Box>

        <SectionHeading>Online Presence</SectionHeading>

        <Box>
          <FieldLabel>LinkedIn Profile URL</FieldLabel>
          <TextField fullWidth size="small" placeholder="linkedin.com/in/yourname" value={form.linkedIn} onChange={set('linkedIn')} sx={fieldSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><LanguageOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
        </Box>

        <Box>
          <FieldLabel>Resume / CV <Typography component="span" variant="caption" color="text.disabled">(PDF · Max 5MB)</Typography></FieldLabel>
          <UploadBox fileRef={resumeRef} file={form.resume} onChange={e => { const f = e.target.files[0]; if (f) setForm(p => ({ ...p, resume: f })); }}
            label="Click to upload your resume" hint="PDF only · Max 5MB" accept=".pdf" />
        </Box>

        <Box display="flex" gap={1.5} mt={1}>
          <Button variant="outlined" onClick={() => setStep(0)} startIcon={<ArrowBackIcon />}
            sx={{ py: 1.4, borderRadius: 2, fontWeight: 600, textTransform: 'none', flex: '0 0 auto' }}>
            Back
          </Button>
          <Button type="submit" variant="contained" disableElevation fullWidth disabled={loading}
            sx={{ py: 1.4, borderRadius: 2, fontWeight: 600, textTransform: 'none', '&.Mui-disabled': { bgcolor: 'grey.300', color: 'grey.500' } }}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// COMPANY FORM
// ══════════════════════════════════════════════════════════════════════════════
const CompanyForm = ({ onSubmit, loading, error }) => {
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const docRef = useRef();

  const [form, setForm] = useState({
    contactName: '', designation: '', email: '', phone: '',
    companyName: '', companyType: '', industry: '', website: '',
    cinGst: '', employeeCount: '', yearFounded: '',
    state: '', city: '', address: '',
    password: '', confirm: '',
    verificationDoc: null,
  });

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));
  const passwordMatch = form.confirm && form.password === form.confirm;
  const passwordMismatch = form.confirm && form.password !== form.confirm;

  const step1Valid =
    form.contactName && form.email && form.phone &&
    form.companyName && form.companyType && form.industry &&
    form.cinGst && form.state && form.city;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!step1Valid) { setStep(0); return; }
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v && k !== 'confirm') data.append(k, v); });
    onSubmit(data);
  };

  const pwConfirmSx = {
    ...fieldSx,
    '& .MuiOutlinedInput-root': {
      ...fieldSx['& .MuiOutlinedInput-root'],
      ...(passwordMatch && { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#43A047' } }),
    },
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stepper activeStep={step} sx={{ mb: 3.5 }}>
        {['Company Info', 'Verification & Security'].map(label => (
          <Step key={label}>
            <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.78rem', fontWeight: 600 }, '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' }, '& .MuiStepIcon-root.Mui-completed': { color: 'primary.main' } }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.82rem', mb: 2.5 }}>{error}</Alert>}

      {/* Step 1 */}
      <Box display={step === 0 ? 'flex' : 'none'} flexDirection="column" gap={2}>
        <SectionHeading>Contact Person</SectionHeading>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <FieldLabel required>Full Name</FieldLabel>
            <TextField fullWidth size="small" placeholder="Jane Smith" value={form.contactName} onChange={set('contactName')} required sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
          </Box>
          <Box>
            <FieldLabel>Designation</FieldLabel>
            <TextField fullWidth size="small" placeholder="HR Manager" value={form.designation} onChange={set('designation')} sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
          </Box>
        </Box>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <FieldLabel required>Work Email</FieldLabel>
            <TextField fullWidth size="small" type="email" placeholder="hr@company.com" value={form.email} onChange={set('email')} required sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
          </Box>
          <Box>
            <FieldLabel required>Phone</FieldLabel>
            <TextField fullWidth size="small" placeholder="10-digit" value={form.phone} onChange={set('phone')} required inputProps={{ maxLength: 10 }} sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
          </Box>
        </Box>

        <SectionHeading>Company Details</SectionHeading>

        <Box>
          <FieldLabel required>Company Name</FieldLabel>
          <TextField fullWidth size="small" placeholder="Acme Pvt. Ltd." value={form.companyName} onChange={set('companyName')} required sx={fieldSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><BusinessOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
        </Box>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <FieldLabel required>Company Type</FieldLabel>
            <TextField select fullWidth size="small" value={form.companyType} onChange={set('companyType')} required sx={fieldSx}>
              <MenuItem value="" disabled><Typography color="text.disabled" fontSize="0.875rem">Select type</Typography></MenuItem>
              {COMPANY_TYPES.map(t => <MenuItem key={t} value={t} sx={{ fontSize: '0.875rem' }}>{t}</MenuItem>)}
            </TextField>
          </Box>
          <Box>
            <FieldLabel required>Industry</FieldLabel>
            <TextField select fullWidth size="small" value={form.industry} onChange={set('industry')} required sx={fieldSx}>
              <MenuItem value="" disabled><Typography color="text.disabled" fontSize="0.875rem">Select industry</Typography></MenuItem>
              {INDUSTRIES.map(i => <MenuItem key={i} value={i} sx={{ fontSize: '0.875rem' }}>{i}</MenuItem>)}
            </TextField>
          </Box>
        </Box>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <FieldLabel>Website</FieldLabel>
            <TextField fullWidth size="small" placeholder="https://company.com" value={form.website} onChange={set('website')} sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><LanguageOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
          </Box>
          <Box>
            <FieldLabel>Year Founded</FieldLabel>
            <TextField fullWidth size="small" placeholder="e.g. 2010" value={form.yearFounded} onChange={set('yearFounded')} inputProps={{ maxLength: 4 }} sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonthOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
          </Box>
        </Box>

        <Box>
          <FieldLabel required>CIN / GST Number <Typography component="span" variant="caption" color="text.disabled">(required for verification)</Typography></FieldLabel>
          <TextField fullWidth size="small" placeholder="U12345MH2010PTC123456 or GST number" value={form.cinGst} onChange={set('cinGst')} required sx={fieldSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><NumbersOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
        </Box>

        <Box>
          <FieldLabel>Team Size</FieldLabel>
          <TextField select fullWidth size="small" value={form.employeeCount} onChange={set('employeeCount')} sx={fieldSx}>
            <MenuItem value="" disabled><Typography color="text.disabled" fontSize="0.875rem">Select range</Typography></MenuItem>
            {['1–10', '11–50', '51–200', '201–500', '501–1000', '1000+'].map(r => (
              <MenuItem key={r} value={r} sx={{ fontSize: '0.875rem' }}>{r} employees</MenuItem>
            ))}
          </TextField>
        </Box>

        <SectionHeading>Location</SectionHeading>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <FieldLabel required>State</FieldLabel>
            <TextField select fullWidth size="small" value={form.state} onChange={set('state')} required sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }}>
              <MenuItem value="" disabled><Typography color="text.disabled" fontSize="0.875rem">Select</Typography></MenuItem>
              {INDIAN_STATES.map(s => <MenuItem key={s} value={s} sx={{ fontSize: '0.875rem' }}>{s}</MenuItem>)}
            </TextField>
          </Box>
          <Box>
            <FieldLabel required>City</FieldLabel>
            <TextField fullWidth size="small" placeholder="City" value={form.city} onChange={set('city')} required sx={fieldSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><ApartmentOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }} />
          </Box>
        </Box>

        <Box>
          <FieldLabel>Registered Address</FieldLabel>
          <TextField fullWidth size="small" multiline rows={2} placeholder="Street, Area, Landmark" value={form.address} onChange={set('address')} sx={fieldSx} />
        </Box>

        <Button variant="contained" disableElevation disabled={!step1Valid} onClick={() => setStep(1)} endIcon={<ArrowForwardIcon />}
          sx={{ mt: 1, py: 1.4, borderRadius: 2, fontWeight: 600, textTransform: 'none' }}>
          Continue
        </Button>
      </Box>

      {/* Step 2 */}
      <Box display={step === 1 ? 'flex' : 'none'} flexDirection="column" gap={2}>
        <SectionHeading>Verification Document</SectionHeading>

        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.100' }}>
          <Box display="flex" alignItems="flex-start" gap={1.25}>
            <VerifiedOutlinedIcon sx={{ fontSize: 18, color: 'primary.main', mt: 0.1, flexShrink: 0 }} />
            <Box>
              <Typography variant="caption" fontWeight={600} color="primary.main" display="block">Why we verify companies</Typography>
              <Typography variant="caption" color="text.secondary" lineHeight={1.6}>
                We review your documents to protect job seekers from fraudulent listings. Your data is kept strictly confidential and used only for verification purposes.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <FieldLabel>Certificate of Incorporation / GST Certificate <Typography component="span" variant="caption" color="text.disabled">(PDF, JPG or PNG)</Typography></FieldLabel>
          <UploadBox fileRef={docRef} file={form.verificationDoc}
            onChange={e => { const f = e.target.files[0]; if (f) setForm(p => ({ ...p, verificationDoc: f })); }}
            label="Click to upload document" hint="PDF, JPG or PNG · Max 10MB" accept=".pdf,.jpg,.jpeg,.png" />
        </Box>

        <SectionHeading>Set Password</SectionHeading>

        <Box>
          <FieldLabel required>Password</FieldLabel>
          <TextField fullWidth size="small" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={set('password')} required sx={fieldSx}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPw(p => !p)} edge="end" sx={{ color: 'text.disabled' }}>{showPw ? <VisibilityOffOutlinedIcon sx={{ fontSize: 17 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />}</IconButton></InputAdornment>,
            }} />
          <PasswordStrengthBar password={form.password} />
        </Box>

        <Box>
          <FieldLabel required>Confirm Password</FieldLabel>
          <TextField fullWidth size="small" type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')} required
            error={passwordMismatch} helperText={passwordMismatch ? 'Passwords do not match' : ''} sx={pwConfirmSx}
            InputProps={{
              startAdornment: <InputAdornment position="start">{passwordMatch ? <CheckCircleOutlineIcon sx={{ fontSize: 17, color: '#43A047' }} /> : <LockOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} />}</InputAdornment>,
              endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowConfirm(p => !p)} edge="end" sx={{ color: 'text.disabled' }}>{showConfirm ? <VisibilityOffOutlinedIcon sx={{ fontSize: 17 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />}</IconButton></InputAdornment>,
            }} />
        </Box>

        <Box display="flex" gap={1.5} mt={1}>
          <Button variant="outlined" onClick={() => setStep(0)} startIcon={<ArrowBackIcon />}
            sx={{ py: 1.4, borderRadius: 2, fontWeight: 600, textTransform: 'none', flex: '0 0 auto' }}>
            Back
          </Button>
          <Button type="submit" variant="contained" disableElevation fullWidth
            disabled={loading || !form.password || passwordMismatch || !form.confirm}
            sx={{ py: 1.4, borderRadius: 2, fontWeight: 600, textTransform: 'none', '&.Mui-disabled': { bgcolor: 'grey.300', color: 'grey.500' } }}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit for Verification'}
          </Button>
        </Box>

        <Typography variant="caption" color="text.disabled" textAlign="center" lineHeight={1.6}>
          Our team will review and verify your company within 1–2 business days.
        </Typography>
      </Box>
    </Box>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
const RegisterPage = () => {
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const panel = {
    employee: {
      headline: <>Start your career{' '}<Box component="span" sx={{ opacity: 0.65 }}>journey today.</Box></>,
      sub: 'Create your profile once and apply to hundreds of local jobs with a single click.',
      perks: ['Free to join, always', 'One-click applications', 'Personalized job alerts'],
    },
    company: {
      headline: <>Find talent that{' '}<Box component="span" sx={{ opacity: 0.65 }}>drives growth.</Box></>,
      sub: 'Post jobs, manage applications, and build your team — all from one dashboard.',
      perks: ['Post unlimited jobs', 'Smart candidate matching', 'Verified company badge'],
    },
  }[role];

  const handleSubmit = async (formData) => {
    setError('');
    setLoading(true);
    try {
      const endpoint = role === 'employee' ? '/api/register/employee' : '/api/register/company';
      const res = await axios.post(`${fetchUri}${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.status === 200 || res.status === 201) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userid', user?.userid || user?._id);
        toast.success(
          role === 'employee'
            ? 'Account created! Welcome to LocalHire.'
            : 'Submitted! We will verify your company shortly.'
        );
        setTimeout(() => {
          navigate(
            role === 'employee'
              ? `/dashboard/${user?.userid || user?._id}`
              : '/company/pending-verification'
          );
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.err || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ height: '100vh', display: 'flex', overflow: 'hidden', bgcolor: 'background.default' }}>

        {/* Left branding panel — fixed, never scrolls */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
          justifyContent: 'space-between', width: '40%', flexShrink: 0,
          bgcolor: 'primary.main', p: 6, position: 'sticky', top: 0,
          height: '100vh', overflow: 'hidden',
        }}>
          <Box sx={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', top: -80, right: -80 }} />
          <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', top: 60, right: 60 }} />
          <Box sx={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', bottom: -60, left: -60 }} />

          <Box display="flex" alignItems="center" gap={1.5}>
            <WorkOutlineIcon sx={{ color: 'white', fontSize: 26 }} />
            <Typography variant="h5" fontWeight={700} color="white" letterSpacing={-0.5}>LocalHire</Typography>
          </Box>

          <Fade in key={role}>
            <Box>
              <Typography variant="h3" fontWeight={700} color="white" letterSpacing={-1} lineHeight={1.2} mb={2}>
                {panel.headline}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, mb: 3 }}>
                {panel.sub}
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                {panel.perks.map(perk => (
                  <Box key={perk} display="flex" alignItems="center" gap={1.25}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{perk}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>

          <Box display="flex" gap={4}>
            {[['12k+', 'Active Jobs'], ['4.2k', 'Companies'], ['98%', 'Placement']].map(([val, label]) => (
              <Box key={label}>
                <Typography variant="h6" fontWeight={700} color="white">{val}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right form panel — scrollable */}
        <Box sx={{ flex: 1, height: '100vh', overflowY: 'auto', display: 'flex', justifyContent: 'center', p: { xs: 2, sm: 4 } }}>
          <Box sx={{ width: '100%', maxWidth: 500, py: 3 }}>

            {/* Mobile brand */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 4 }}>
              <WorkOutlineIcon color="primary" />
              <Typography variant="h6" fontWeight={700} color="primary" letterSpacing={-0.5}>LocalHire</Typography>
            </Box>

            <Box mb={4}>
              <Typography variant="h5" fontWeight={700} letterSpacing={-0.5} gutterBottom>Create your account</Typography>
              <Typography variant="body2" color="text.secondary">Get started — it's completely free</Typography>
            </Box>

            {/* Role toggle */}
            <ToggleButtonGroup value={role} exclusive
              onChange={(_, v) => { if (v) { setRole(v); setError(''); } }}
              fullWidth
              sx={{
                mb: 3.5, bgcolor: 'grey.100', borderRadius: 2, p: 0.5,
                '& .MuiToggleButtonGroup-grouped': {
                  border: 0, borderRadius: '8px !important', mx: 0, py: 1,
                  fontSize: '0.85rem', fontWeight: 600, textTransform: 'none', color: 'text.secondary',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': { bgcolor: 'background.paper', color: 'primary.main', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', '&:hover': { bgcolor: 'background.paper' } },
                  '&:hover': { bgcolor: 'transparent' },
                },
              }}
            >
              <ToggleButton value="employee" disableRipple>
                <PersonOutlineIcon sx={{ fontSize: 17, mr: 0.75 }} />Job Seeker
              </ToggleButton>
              <ToggleButton value="company" disableRipple>
                <BusinessCenterOutlinedIcon sx={{ fontSize: 17, mr: 0.75 }} />Company
              </ToggleButton>
            </ToggleButtonGroup>

            {role === 'employee'
              ? <EmployeeForm key="employee" onSubmit={handleSubmit} loading={loading} error={error} />
              : <CompanyForm key="company" onSubmit={handleSubmit} loading={loading} error={error} />
            }

            <Box display="flex" alignItems="center" gap={1.5} my={3}>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="caption" color="text.disabled" fontWeight={500}>OR</Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <Box sx={{ textAlign: 'center', py: 1.75, px: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to={`/login?role=${role}`} underline="hover" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RegisterPage;