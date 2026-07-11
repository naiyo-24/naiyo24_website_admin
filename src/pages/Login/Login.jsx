import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Key, Eye, EyeOff } from 'lucide-react';
import logoImage from '../../../assets/naiyo24_logo.jpeg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const response = await fetch('https://backend.naiyo24.com/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('adminToken', data.access_token);
          navigate('/');
        } else {
          alert('Invalid email or password.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred while trying to log in.');
      }
    } else {
      alert("Please enter both email and password.");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="neo-card" style={{ width: '100%', maxWidth: '440px', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src={logoImage} alt="Naiyo24 Logo" style={{ maxWidth: '120px', height: 'auto', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>Admin Login</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', zIndex: 10 }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neo-input"
                style={{ paddingLeft: '40px' }}
                placeholder="admin@naiyo24.com"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', zIndex: 10 }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neo-input"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="icon-btn"
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="neo-button primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px', padding: '14px' }}>
            <LogIn size={20} /> Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
