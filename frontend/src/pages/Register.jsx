import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css';
import '../responsive.css';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
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

    try {
      const name = `${form.firstName} ${form.lastName}`;
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email: form.email,
        password: form.password
      });
      toast.success('Account created! Please login.');
      navigate('/');
    } catch {
      toast.error('Registration failed. Email may already exist.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #eef2f7 0%, #dce8fb 100%)'
    }}>
      <div className="auth-box">

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a2e' }}>Create Account</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
            Fill in the details to get started.
          </p>
        </div>

        {/* First & Last Name side by side */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label>First Name</label>
            <input
              placeholder="John"
              onChange={e => setForm({...form, firstName: e.target.value})}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Last Name</label>
            <input
              placeholder="Doe"
              onChange={e => setForm({...form, lastName: e.target.value})}
            />
          </div>
        </div>

        <label>Email</label>
        <input
          placeholder="you@example.com"
          onChange={e => setForm({...form, email: e.target.value})}
        />

        <label>Password</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            style={{ paddingRight: '44px' }}
            onChange={e => setForm({...form, password: e.target.value})}
          />
          <span
            onClick={() => setShowPass(!showPass)}
            style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}
          >
            {showPass ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </span>
        </div>

        {/* Password hints */}
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8', lineHeight: '1.6' }}>
          Password must have: 6+ chars • Uppercase • Number • Special (!@#$%^&*)
        </div>

        <button
          style={{ width: '100%', marginTop: '18px', padding: '13px', fontSize: '15px' }}
          onClick={handleSubmit}
        >
          Create Account
        </button>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#64748b' }}>
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
}