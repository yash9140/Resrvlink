import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">View your account details.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700' }}>{user?.name}</h2>
            <span className="badge badge-primary" style={{ marginTop: '4px' }}>
              {user?.role === 'admin' ? 'Administrator' : 'Customer'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>Email Address</div>
            <div style={{ fontWeight: '600' }}>{user?.email}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>Account Status</div>
            <div style={{ fontWeight: '600', color: 'var(--color-success)' }}>Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
