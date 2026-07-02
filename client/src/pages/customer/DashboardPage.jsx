import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import reservationService from '../../services/reservationService';
import { useAuth } from '../../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await reservationService.getMyReservations();
        if (res.success) {
          const reservations = res.data;
          const today = new Date().toISOString().split('T')[0];
          const upcoming = reservations.filter(r => r.reservationDate >= today && r.status === 'confirmed');
          setStats({
            total: reservations.length,
            upcoming: upcoming.length
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">Here's an overview of your reservations.</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '40px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>📅</div>
          <div className="stat-value">{loading ? '-' : stats.upcoming}</div>
          <div className="stat-label">Upcoming Reservations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>🍽️</div>
          <div className="stat-value">{loading ? '-' : stats.total}</div>
          <div className="stat-label">Total Lifetime Visits</div>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '40px' }}>🎉</div>
          <Link to="/reservations/new" className="btn btn-primary">
            Book a Table Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
