import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const steps = ['Basic', 'Education & Experience', 'Skills & Projects'];

const sx = {
  root: {
    padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 5vw, 2.5rem)',
    maxWidth: 760,
    width: '100%',
    fontFamily: 'inherit',
  },
};

/* ─── Tiny primitives ─────────────────────────────────────────── */

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  fontFamily: 'inherit',
  fontSize: 14,
  color: 'inherit',
  background: 'transparent',
  border: '0.5px solid rgba(0,0,0,0.18)',
  borderRadius: 8,
  padding: '9px 12px',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.15s',
};

const Input = (props) => (
  <input
    {...props}
    style={inputStyle}
    onFocus={e => (e.target.style.borderColor = 'rgba(0,0,0,0.6)')}
    onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.18)')}
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    rows={props.rows || 3}
    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
    onFocus={e => (e.target.style.borderColor = 'rgba(0,0,0,0.6)')}
    onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.18)')}
  />
);

const Grid2 = ({ children }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  }}>
    {children}
  </div>
);

const SectionLabel = ({ children, first }) => (
  <p style={{
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'rgba(0,0,0,0.35)',
    marginBottom: '1rem',
    marginTop: first ? 0 : '2rem',
    paddingBottom: '0.5rem',
    borderBottom: '0.5px solid rgba(0,0,0,0.1)',
  }}>
    {children}
  </p>
);

const Divider = () => (
  <div style={{ borderBottom: '0.5px solid rgba(0,0,0,0.1)', margin: '0.75rem 0' }} />
);

/* ─── Array row (education / experience / project) ───────────── */

const ArrayRow = ({ index, total, onRemove, children }) => (
  <div style={{ paddingTop: '1rem', paddingBottom: '1rem', borderBottom: total > 1 ? '0.5px solid rgba(0,0,0,0.08)' : 'none' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
      <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.3)', fontWeight: 500 }}>Entry {index + 1}</span>
      {total > 1 && (
        <button
          onClick={onRemove}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.35)',
            padding: '4px 8px', borderRadius: 6,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.target.style.color = '#c0392b')}
          onMouseLeave={e => (e.target.style.color = 'rgba(0,0,0,0.35)')}
        >
          Remove
        </button>
      )}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {children}
    </div>
  </div>
);

const AddButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      marginTop: '0.75rem',
      width: '100%',
      background: 'none',
      border: '0.5px dashed rgba(0,0,0,0.2)',
      borderRadius: 8,
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 500,
      color: 'rgba(0,0,0,0.45)',
      padding: '9px 16px',
      transition: 'all 0.15s',
    }}
    onMouseEnter={e => { e.target.style.borderColor = 'rgba(0,0,0,0.5)'; e.target.style.color = 'rgba(0,0,0,0.7)'; }}
    onMouseLeave={e => { e.target.style.borderColor = 'rgba(0,0,0,0.2)'; e.target.style.color = 'rgba(0,0,0,0.45)'; }}
  >
    {children}
  </button>
);

/* ─── Loading spinner ─────────────────────────────────────────── */

const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <div style={{
      width: 24, height: 24,
      border: '2px solid rgba(0,0,0,0.1)',
      borderTopColor: 'rgba(0,0,0,0.6)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ─── Main component ──────────────────────────────────────────── */

const ProfileForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [newSkill, setNewSkill] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    objective: '',
    jobType: '',
    address: '',
    skills: [],
    education: [{ degree: '', institution: '', year: '', cgpa: '' }],
    experience: [{ role: '', company: '', description: '' }],
    projects: [{ name: '', description: '', link: '' }],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id && !user?._id) return;
      try {
        const userId = user.id || user._id;
        const response = await axios.get(`/users/${userId}`);
        const data = response.data;
        if (data.success && data.data?.user) {
          const u = data.data.user;
          const profile = u.aspirantProfile || {};
          setFormData({
            name: u.name || '',
            phone: u.phone || '',
            objective: profile.objective || '',
            jobType: profile.jobType || '',
            address: profile.address || '',
            skills: profile.skills || [],
            education: profile.education?.length ? profile.education : [{ degree: '', institution: '', year: '', cgpa: '' }],
            experience: profile.experience?.length ? profile.experience : [{ role: '', company: '', description: '' }],
            projects: profile.projects?.length ? profile.projects : [{ name: '', description: '', link: '' }],
          });
        }
      } catch {
        toast.error('Failed to load profile data');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => {
      const arr = [...prev[arrayName]];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [arrayName]: arr };
    });
  };

  const handleAdd = (arrayName, template) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], template] }));
  };

  const handleRemove = (arrayName, index) => {
    setFormData(prev => ({ ...prev, [arrayName]: prev[arrayName].filter((_, i) => i !== index) }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    setNewSkill('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        aspirantProfile: {
          objective: formData.objective,
          jobType: formData.jobType,
          address: formData.address,
          skills: formData.skills,
          education: formData.education,
          experience: formData.experience,
          projects: formData.projects,
        },
      };
      const userId = user.id || user._id;
      const response = await axios.patch(`/users/${userId}/profile`, payload);
      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        setActiveStep(0);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spinner />;

  /* ── Step panels ── */

  const panel0 = (
    <>
      <SectionLabel first>Personal details</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Grid2>
          <Field label="Full name">
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" />
          </Field>
          <Field label="Contact phone">
            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8901" />
          </Field>
        </Grid2>
        <Field label="Professional objective">
          <Textarea name="objective" value={formData.objective} onChange={handleChange} placeholder="A short summary of your career goals..." />
        </Field>
        <Grid2>
          <Field label="Preferred job type">
            <Input name="jobType" value={formData.jobType} onChange={handleChange} placeholder="e.g. Full-Time, Remote" />
          </Field>
          <Field label="City, state">
            <Input name="address" value={formData.address} onChange={handleChange} placeholder="e.g. New York, NY" />
          </Field>
        </Grid2>
      </div>
    </>
  );

  const panel1 = (
    <>
      <SectionLabel first>Education</SectionLabel>
      {formData.education.map((edu, idx) => (
        <ArrayRow key={idx} index={idx} total={formData.education.length} onRemove={() => handleRemove('education', idx)}>
          <Grid2>
            <Field label="Degree / course">
              <Input value={edu.degree} onChange={e => handleArrayChange('education', idx, 'degree', e.target.value)} placeholder="B.Sc. Computer Science" />
            </Field>
            <Field label="Institution">
              <Input value={edu.institution} onChange={e => handleArrayChange('education', idx, 'institution', e.target.value)} placeholder="MIT" />
            </Field>
          </Grid2>
          <Grid2>
            <Field label="Graduation year">
              <Input type="number" value={edu.year} onChange={e => handleArrayChange('education', idx, 'year', e.target.value)} placeholder="2023" />
            </Field>
            <Field label="CGPA / grade">
              <Input value={edu.cgpa} onChange={e => handleArrayChange('education', idx, 'cgpa', e.target.value)} placeholder="3.8 / 4.0" />
            </Field>
          </Grid2>
        </ArrayRow>
      ))}
      <AddButton onClick={() => handleAdd('education', { degree: '', institution: '', year: '', cgpa: '' })}>
        + Add education
      </AddButton>

      <SectionLabel>Work experience</SectionLabel>
      {formData.experience.map((exp, idx) => (
        <ArrayRow key={idx} index={idx} total={formData.experience.length} onRemove={() => handleRemove('experience', idx)}>
          <Grid2>
            <Field label="Job title / role">
              <Input value={exp.role} onChange={e => handleArrayChange('experience', idx, 'role', e.target.value)} placeholder="Software Engineer" />
            </Field>
            <Field label="Company">
              <Input value={exp.company} onChange={e => handleArrayChange('experience', idx, 'company', e.target.value)} placeholder="Acme Corp" />
            </Field>
          </Grid2>
          <Field label="Description of duties">
            <Textarea value={exp.description} onChange={e => handleArrayChange('experience', idx, 'description', e.target.value)} placeholder="Describe your responsibilities and key achievements..." />
          </Field>
        </ArrayRow>
      ))}
      <AddButton onClick={() => handleAdd('experience', { role: '', company: '', description: '' })}>
        + Add experience
      </AddButton>
    </>
  );

  const panel2 = (
    <>
      <SectionLabel first>Key skills</SectionLabel>
      <div style={{ display: 'flex', gap: 8, marginBottom: '0.75rem' }}>
        <Input
          value={newSkill}
          onChange={e => setNewSkill(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
          placeholder="e.g. React, Node.js, Figma"
        />
        <button
          onClick={handleAddSkill}
          style={{
            flexShrink: 0,
            background: 'rgba(0,0,0,0.06)',
            border: '0.5px solid rgba(0,0,0,0.15)',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            color: 'rgba(0,0,0,0.7)',
            padding: '9px 18px',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.target.style.background = 'rgba(0,0,0,0.1)')}
          onMouseLeave={e => (e.target.style.background = 'rgba(0,0,0,0.06)')}
        >
          Add
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 32 }}>
        {formData.skills.map((skill, idx) => (
          <span
            key={idx}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 500,
              background: 'rgba(0,0,0,0.05)',
              border: '0.5px solid rgba(0,0,0,0.12)',
              borderRadius: 100,
              padding: '4px 12px 4px 14px',
              color: 'rgba(0,0,0,0.7)',
            }}
          >
            {skill}
            <button
              onClick={() => handleRemove('skills', idx)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'rgba(0,0,0,0.35)', lineHeight: 1, padding: 0, display: 'flex' }}
              onMouseEnter={e => (e.target.style.color = 'rgba(0,0,0,0.7)')}
              onMouseLeave={e => (e.target.style.color = 'rgba(0,0,0,0.35)')}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <SectionLabel>Projects</SectionLabel>
      {formData.projects.map((proj, idx) => (
        <ArrayRow key={idx} index={idx} total={formData.projects.length} onRemove={() => handleRemove('projects', idx)}>
          <Grid2>
            <Field label="Project name">
              <Input value={proj.name} onChange={e => handleArrayChange('projects', idx, 'name', e.target.value)} placeholder="Portfolio Website" />
            </Field>
            <Field label="Project link">
              <Input type="url" value={proj.link} onChange={e => handleArrayChange('projects', idx, 'link', e.target.value)} placeholder="https://github.com/..." />
            </Field>
          </Grid2>
          <Field label="Description">
            <Textarea value={proj.description} onChange={e => handleArrayChange('projects', idx, 'description', e.target.value)} placeholder="What did you build and what problem did it solve?" />
          </Field>
        </ArrayRow>
      ))}
      <AddButton onClick={() => handleAdd('projects', { name: '', description: '', link: '' })}>
        + Add project
      </AddButton>
    </>
  );

  const panels = [panel0, panel1, panel2];

  return (
    <div style={sx.root}>
      {/* Header */}
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(0,0,0,0.35)', marginBottom: 4 }}>
        Profile
      </p>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: 'inherit', marginBottom: 4 }}>
        Hi, {formData.name || 'Job Seeker'}
      </h1>
      <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.45)', marginBottom: '2rem' }}>
        Complete your profile to stand out to potential employers.
      </p>

      {/* Step tab nav */}
      <nav style={{ display: 'flex', borderBottom: '0.5px solid rgba(0,0,0,0.12)', marginBottom: '2.5rem' }}>
        {steps.map((label, i) => (
          <button
            key={label}
            onClick={() => setActiveStep(i)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeStep === i ? '2px solid rgba(0,0,0,0.75)' : '2px solid transparent',
              cursor: 'pointer',
              padding: '0.6rem 1.1rem',
              fontSize: 13,
              fontWeight: 500,
              color: activeStep === i ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.4)',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 18, height: 18, borderRadius: '50%', fontSize: 11, fontWeight: 600,
              background: activeStep === i ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.1)',
              color: activeStep === i ? '#fff' : 'rgba(0,0,0,0.45)',
              flexShrink: 0,
            }}>
              {i + 1}
            </span>
            {label}
          </button>
        ))}
      </nav>

      {/* Active panel */}
      <div>{panels[activeStep]}</div>

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '2.5rem', paddingTop: '1.5rem',
        borderTop: '0.5px solid rgba(0,0,0,0.1)',
      }}>
        <button
          onClick={() => setActiveStep(s => s - 1)}
          disabled={activeStep === 0}
          style={{
            background: 'none',
            border: '0.5px solid rgba(0,0,0,0.18)',
            borderRadius: 8,
            cursor: activeStep === 0 ? 'default' : 'pointer',
            fontSize: 13, fontWeight: 500,
            color: 'rgba(0,0,0,0.5)',
            padding: '9px 20px',
            opacity: activeStep === 0 ? 0.3 : 1,
            transition: 'all 0.15s',
          }}
        >
          Back
        </button>

        <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.3)', fontWeight: 500 }}>
          Step {activeStep + 1} of {steps.length}
        </span>

        {activeStep < steps.length - 1 ? (
          <button
            onClick={() => setActiveStep(s => s + 1)}
            style={{
              background: 'rgba(0,0,0,0.85)',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13, fontWeight: 500,
              color: '#fff',
              padding: '9px 24px',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.target.style.opacity = '0.8')}
            onMouseLeave={e => (e.target.style.opacity = '1')}
          >
            Next step
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.85)',
              border: 'none',
              borderRadius: 8,
              cursor: loading ? 'default' : 'pointer',
              fontSize: 13, fontWeight: 500,
              color: '#fff',
              padding: '9px 24px',
              transition: 'opacity 0.15s',
            }}
          >
            {loading ? 'Saving…' : 'Save profile'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;