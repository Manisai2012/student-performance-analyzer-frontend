import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Award, Eye, EyeOff, UserPlus, Loader2, BookOpen } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!formData.username.trim()) errors.username = 'Username is required.';
    if (!formData.email.trim()) errors.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email address format.';
    if (!formData.password) errors.password = 'Password is required.';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match.';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        role: formData.role
      });

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={styles.avatarCircle}>
            <Award size={28} color="#2563eb" />
          </div>
          <h2 style={styles.title}>Student Registration</h2>
          <p style={styles.subtitle}>Join the Student Performance Analyzer portal</p>
        </div>

        {error && <div style={styles.alertError}>{error}</div>}
        {success && <div style={styles.alertSuccess}>{success}</div>}

        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Johnson"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              style={styles.input}
            />
            {fieldErrors.fullName && <span style={styles.errorText}>{fieldErrors.fullName}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="e.g. alexj"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={styles.input}
            />
            {fieldErrors.username && <span style={styles.errorText}>{fieldErrors.username}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="e.g. alex@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
            />
            {fieldErrors.email && <span style={styles.errorText}>{fieldErrors.email}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Account Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={styles.input}
            >
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Faculty / Academic Admin</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={styles.input}
            />
            {fieldErrors.password && <span style={styles.errorText}>{fieldErrors.password}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              style={styles.input}
            />
            {fieldErrors.confirmPassword && <span style={styles.errorText}>{fieldErrors.confirmPassword}</span>}
          </div>

          <button type="submit" disabled={isLoading} style={styles.submitBtn}>
            {isLoading ? (
              <>
                <Loader2 size={18} className="spinner-border spinner-border-sm me-2" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus size={18} style={{ marginRight: '8px' }} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div style={styles.footerNote}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '24px'
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    background: '#ffffff',
    borderRadius: '16px',
    padding: '36px 32px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
  },
  avatarCircle: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    background: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px'
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px'
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0
  },
  alertError: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    marginBottom: '16px'
  },
  alertSuccess: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#16a34a',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    marginBottom: '16px'
  },
  inputGroup: {
    marginBottom: '14px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '4px'
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1.5px solid #cbd5e1',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box'
  },
  errorText: {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '2px',
    display: 'block'
  },
  submitBtn: {
    width: '100%',
    padding: '11px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '16px'
  },
  footerNote: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
    marginTop: '20px'
  }
};

export default Register;
