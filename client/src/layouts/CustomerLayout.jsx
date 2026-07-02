import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'New Reservation', path: '/reservations/new', icon: '➕' },
    { name: 'My Reservations', path: '/reservations', icon: '🗓️' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Desktop */}
      <aside style={{ width: '260px', background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', padding: '24px', position: 'sticky', top: 0, height: '100vh' }} className="d-none d-lg-flex">
        <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '40px' }}>
          Resrv<span style={{ color: 'var(--color-text-primary)' }}>Link</span>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard' || item.path === '/reservations'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                background: isActive ? 'var(--color-primary-light)' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s ease',
              })}
            >
              <span>{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>{user?.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{user?.email}</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-full" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile Header */}
        <header style={{ padding: '16px 24px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="d-lg-none">
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-primary)' }}>
            Resrv<span style={{ color: 'var(--color-text-primary)' }}>Link</span>
          </div>
          <button className="btn btn-ghost" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'var(--color-bg)', zIndex: 50, padding: '24px', display: 'flex', flexDirection: 'column' }} className="d-lg-none">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button className="btn btn-ghost" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
            </div>
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/dashboard' || item.path === '/reservations'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    background: isActive ? 'var(--color-primary-light)' : 'var(--color-surface)',
                    fontWeight: isActive ? '600' : '500',
                  })}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <button className="btn btn-secondary btn-full" onClick={handleLogout}>Logout</button>
          </div>
        )}

        <div style={{ padding: '32px 40px', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
      
      {/* Basic responsive CSS injected for layout only */}
      <style>{`
        @media (max-width: 991px) {
          .d-none.d-lg-flex { display: none !important; }
          main > div { padding: 24px 16px !important; }
        }
        @media (min-width: 992px) {
          .d-lg-none { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default CustomerLayout;
