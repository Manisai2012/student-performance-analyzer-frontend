import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  FileSpreadsheet,
  Users,
  LogOut,
  User,
  ShieldAlert,
  Award
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  // Get user info from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Student Dashboard', icon: LayoutDashboard },
    { to: '/marks', label: 'Marks Management', icon: GraduationCap },
    { to: '/booster', label: 'Performance Booster', icon: Sparkles },
    { to: '/reports', label: 'Reports & CSV Export', icon: FileSpreadsheet },
    ...(user?.role?.toUpperCase().includes('ADMIN')
      ? [{ to: '/students', label: 'Student Records (Admin)', icon: Users }]
      : [])
  ];

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white"
      style={{
        width: '280px',
        height: '100vh',
        position: 'fixed',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        zIndex: 1000,
        boxShadow: '4px 0 16px rgba(0,0,0,0.2)'
      }}
    >
      {/* Brand header */}
      <div className="d-flex align-items-center mb-3 px-2" style={{ gap: '12px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
          }}
        >
          <Award size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '700', lineHeight: 1.2, color: '#f8fafc' }}>
            Performance Analyzer
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
            Academic Intelligence & Booster
          </div>
        </div>
      </div>

      <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '8px 0 16px' }} />

      {/* Navigation */}
      <ul className="nav nav-pills flex-column mb-auto" style={{ gap: '6px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li className="nav-item" key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `nav-link d-flex align-items-center ${isActive ? '' : ''}`}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  color: isActive ? '#fff' : '#cbd5e1',
                  background: isActive ? 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent',
                  borderRadius: '10px',
                  padding: '11px 14px',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.15s ease-in-out',
                  boxShadow: isActive ? '0 4px 12px rgba(37,99,235,0.25)' : 'none'
                })}
              >
                <Icon className="me-2" size={19} />
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* User info & Logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '12px' }}>
        {user && (
          <div className="d-flex align-items-center mb-3 px-2" style={{ gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: user.role?.toUpperCase().includes('ADMIN') ? '#f59e0b' : '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '14px',
                color: '#fff'
              }}
            >
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {user.fullName || user.username}
              </div>
              <div className="d-flex align-items-center gap-1">
                <span
                  className={`badge ${user.role?.toUpperCase().includes('ADMIN') ? 'bg-warning text-dark' : 'bg-primary'}`}
                  style={{ fontSize: '10px', padding: '2px 6px' }}
                >
                  {user.role || 'STUDENT'}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  @{user.username}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="btn btn-sm w-100 d-flex align-items-center justify-content-center"
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
            e.currentTarget.style.color = '#fca5a5';
          }}
        >
          <LogOut size={16} className="me-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
