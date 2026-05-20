import "../../../App.css";
import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import LoginForm from '../../auth/components/LoginForm';
import RegForm from '../../auth/components/RegForm';

const TopNavigation = () => {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [regOpen, setRegOpen] = useState(false);

  const handleLoginOpen = () => {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');

    const isTokenExpired = (token) => {
      if (!token) return true;
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.exp < Date.now() / 1000;
      } catch {
        return true;
      }
    };

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      setLoginOpen(true);
    } else {
      navigate(`/dashboard/${userid}`);
    }
  };

  const handleLoginClose = () => setLoginOpen(false);
  const handleRegOpen = () => setRegOpen(true);
  const handleRegClose = () => setRegOpen(false);

  return (
    <div className='navbar'>
      <LoginForm handleClose={handleLoginClose} open={loginOpen} />
      <RegForm handleRegClose={handleRegClose} regOpen={regOpen} />

      <div className="cont-wrapper">
        <div className="logo-space" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span>JOBS</span><span>LOCAL</span>
        </div>

        <nav className="nav-menu" style={{ display: { xs: 'none', md: 'flex' }, gap: '32px', alignItems: 'center' }}>
          <li className='list-ls lx'><a href="/">Home</a></li>
          <li className='list-ls lx'>Features</li>
          <li className='list-ls lx'>About</li>
          <li className='list-ls lx'>Pricing</li>
          <li className='list-ls lx'>Contact</li>
        </nav>

        <div className="acc-buttons">
          <button onClick={handleLoginOpen} style={{
            padding: '8px 20px',
            fontWeight: 500,
            color: '#333',
            border: '1px solid #e0e0e0',
            background: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.95rem'
          }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#384BFF'; e.currentTarget.style.color = '#384BFF'; e.currentTarget.style.backgroundColor = 'rgba(56,75,255,0.05)'; }}
             onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#333'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
            Login
          </button>
          <button onClick={handleRegOpen} style={{
            padding: '8px 20px',
            fontWeight: 600,
            color: '#fff',
            background: 'linear-gradient(135deg, #384BFF 0%, #192bc2 100%)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.95rem'
          }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
             onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;