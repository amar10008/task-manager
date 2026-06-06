import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from '../useTheme';
import '../App.css';
import '../responsive.css';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password)
      return toast.error('All fields are required!');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters!');
    if (!/[A-Z]/.test(form.password))
      return toast.error('Password must contain at least one uppercase letter!');
    if (!/[0-9]/.test(form.password))
      return toast.error('Password must contain at least one number!');
    if (!/[!@#$%^&*]/.test(form.password))
      return toast.error('Password must contain special character (!@#$%^&*)');

    setLoading(true);
    try {
      const name = `${form.firstName} ${form.lastName}`;
      await axios.post('https://task-manager-backend-h48y.onrender.com/api/auth/register', {
        name,
        email: form.email,
        password: form.password
      });
      toast.success('Account created! Please login.');
      navigate('/');
    } catch {
      toast.error('Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: dark ? '#0f172a' : 'linear-gradient(135deg, #eef2f7 0%, #dce8fb 100%)'
    }}>

      {/* Dark Mode Toggle - Fixed */}
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 999 }}>
        <button
          onClick={() => setDark(!dark)}
          style={{
            background: dark ? '#1e293b' : '#fff',
            border: `1px solid ${dark ? '#334155' : '#e5e7eb'}`,
            padding: '8px 14px',
            fontSize: '13px',
            color: dark ? '#e2e8f0' : '#555',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          {dark ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              Light
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              Dark
            </>
          )}
        </button>
      </div>

      <div className="auth-box" style={{
        background: dark ? '#1e293b' : '#fff',
        border: dark ? '1px solid #334155' : '1px solid #e5e7eb'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: dark ? '#e2e8f0' : '#1a1a2e' }}>
            Create Account
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
            Fill in the details to get started.
          </p>
        </div>

        {/* First & Last Name */}
        <div className="name-fields">
          <div>
            <label htmlFor="register-first">First Name</label>
            <input
              id="register-first"
              placeholder="John"
              onChange={e => setForm({...form, firstName: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="register-last">Last Name</label>
            <input
              id="register-last"
              placeholder="Doe"
              onChange={e => setForm({...form, lastName: e.target.value})}
            />
          </div>
        </div>

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          placeholder="you@example.com"
          onChange={e => setForm({...form, email: e.target.value})}
        />

        <label htmlFor="register-password">Password</label>
        <div style={{ position: 'relative' }}>
          <input
            id="register-password"
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            style={{ paddingRight: '44px' }}
            onChange={e => setForm({...form, password: e.target.value})}
          />
          <button
            type="button"
            className="password-toggle-btn"
            aria-label="Toggle password visibility"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>

        <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8', lineHeight: '1.6' }}>
          Password must have: 6+ chars • Uppercase • Number • Special (!@#$%^&*)
        </div>

        <button
          disabled={loading}
          style={{ width: '100%', marginTop: '18px', padding: '13px', fontSize: '15px' }}
          onClick={handleSubmit}
        >
          {loading ? 'Registering...' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#64748b' }}>
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
}