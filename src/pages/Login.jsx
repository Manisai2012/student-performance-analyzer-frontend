import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Award, Eye, EyeOff, LogIn, Loader2, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
    // Load remembered identifier
    const saved = localStorage.getItem('rememberedIdentifier');
    if (saved) {
      setIdentifier(saved);
      setRememberMe(true);
    }
  }, [navigate]);

  const validate = () => {
    const errors = {};
    if (!identifier.trim()) errors.identifier = 'Username or email is required.';
    if (!password) errors.password = 'Password is required.';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { identifier, password });
      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        role: data.role
      }));

      if (rememberMe) {
        localStorage.setItem('rememberedIdentifier', identifier);
      } else {
        localStorage.removeItem('rememberedIdentifier');
      }

      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error 
        || (err.code === 'ERR_NETWORK' ? 'Cannot reach backend server. Please verify backend service status.' : null)
        || err.message 
        || 'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (u, p) => {
    setIdentifier(u);
    setPassword(p);
    setFieldErrors({});
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.bgOverlay}></div>

      <div style={styles.container}>
        {/* Left Side: Academic Branding Hero */}
        <div style={styles.brandingSection}>
          <div style={styles.brandBadge}>
            <Award size={18} color="#60a5fa" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#93c5fd' }}>
              Academic Intelligence Platform
            </span>
          </div>

          <h1 style={styles.brandHeading}>
            Student Performance <br />
            <span style={{ color: '#60a5fa' }}>Analyzer & Booster</span>
          </h1>

          <p style={styles.brandSubheading}>
            Transform your academic journey with data-driven performance analytics, real-time subject diagnostics, and targeted boosters designed to maximize your grades.
          </p>

          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <CheckCircle2 size={18} color="#34d399" />
              <span>Comprehensive subject-wise & assessment trend analytics</span>
            </div>
            <div style={styles.featureItem}>
              <CheckCircle2 size={18} color="#34d399" />
              <span>Automated percentage calculations & pass/fail status</span>
            </div>
            <div style={styles.featureItem}>
              <CheckCircle2 size={18} color="#34d399" />
              <span>Smart Performance Booster with personalized revision roadmaps</span>
            </div>
            <div style={styles.featureItem}>
              <CheckCircle2 size={18} color="#34d399" />
              <span>One-click academic report generation & verified CSV export</span>
            </div>
          </div>

          <div style={styles.demoBox}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
              Quick Demo Access
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fillDemoAccount('student', 'student123')}
                style={styles.demoPill}
              >
                👨‍🎓 Student: <b>student</b> / <b>student123</b>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin', 'admin123')}
                style={styles.demoPill}
              >
                🛡️ Admin: <b>admin</b> / <b>admin123</b>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div style={styles.formSection}>
          <div style={styles.formCard}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={styles.avatarCircle}>
                <BookOpen size={28} color="#2563eb" />
              </div>
              <h2 style={styles.formTitle}>Welcome Back</h2>
              <p style={styles.formSubtitle}>Sign in to access your student performance portal</p>
            </div>

            {error && (
              <div style={styles.alertError}>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} noValidate>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username or Email</label>
                <input
                  type="text"
                  placeholder="e.g. student or alex.johnson@university.edu"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (fieldErrors.identifier) setFieldErrors({ ...fieldErrors, identifier: null });
                  }}
                  style={{
                    ...styles.input,
                    borderColor: fieldErrors.identifier ? '#ef4444' : '#e2e8f0'
                  }}
                />
                {fieldErrors.identifier && (
                  <span style={styles.errorText}>{fieldErrors.identifier}</span>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
                    }}
                    style={{
                      ...styles.input,
                      borderColor: fieldErrors.password ? '#ef4444' : '#e2e8f0',
                      paddingRight: '40px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span style={styles.errorText}>{fieldErrors.password}</span>
                )}
              </div>

              <div style={styles.flexRowBetween}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  Remember me
                </label>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Secure Session</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={styles.submitBtn}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spinner-border spinner-border-sm me-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={18} style={{ marginRight: '8px' }} />
                    Sign In to Portal
                  </>
                )}
              </button>
            </form>

            <div style={styles.footerNote}>
              Don't have an account?{' '}
              <Link to="/register" style={styles.link}>
                Create an Account
              </Link>
            </div>
          </div>
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
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    position: 'relative',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none'
  },
  container: {
    width: '100%',
    maxWidth: '1100px',
    display: 'flex',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 1,
    flexWrap: 'wrap'
  },
  brandingSection: {
    flex: '1 1 500px',
    background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  brandBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(59, 130, 246, 0.15)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    padding: '6px 14px',
    borderRadius: '20px',
    width: 'fit-content',
    marginBottom: '20px'
  },
  brandHeading: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 1.25,
    marginBottom: '16px'
  },
  brandSubheading: {
    fontSize: '15px',
    color: '#94a3b8',
    lineHeight: 1.6,
    marginBottom: '28px'
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '500'
  },
  demoBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '16px'
  },
  demoPill: {
    background: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.4)',
    color: '#93c5fd',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  formSection: {
    flex: '1 1 450px',
    background: '#ffffff',
    padding: '48px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  formCard: {
    width: '100%',
    maxWidth: '380px'
  },
  avatarCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    background: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    border: '1px solid #dbeafe'
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 6px'
  },
  formSubtitle: {
    fontSize: '14px',
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
    marginBottom: '20px'
  },
  inputGroup: {
    marginBottom: '18px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #cbd5e1',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s'
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0
  },
  errorText: {
    display: 'block',
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px'
  },
  flexRowBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  checkboxLabel: {
    fontSize: '13px',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
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
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    transition: 'opacity 0.15s'
  },
  footerNote: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
    marginTop: '24px'
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
    textDecoration: 'none'
  }
};

export default Login;
