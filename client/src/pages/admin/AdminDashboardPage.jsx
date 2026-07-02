import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import tableService from '../../services/tableService';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    todayReservations: 0,
    totalTables: 0,
    activeTables: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resResponse, tableResponse] = await Promise.all([
          adminService.getAllReservations(),
          tableService.getAllTables()
        ]);

        if (resResponse.success && tableResponse.success) {
          const reservations = resResponse.data;
          const tables = tableResponse.data;
          
          const today = new Date().toISOString().split('T')[0];
          const todayRes = reservations.filter(r => r.reservationDate === today && r.status === 'confirmed');

          setStats({
            totalReservations: reservations.length,
            todayReservations: todayRes.length,
            totalTables: tables.length,
            activeTables: tables.filter(t => t.active).length
          });
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Restaurant overview and statistics.</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '40px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>📅</div>
          <div className="stat-value">{loading ? '-' : stats.todayReservations}</div>
          <div className="stat-label">Today's Reservations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>📊</div>
          <div className="stat-value">{loading ? '-' : stats.totalReservations}</div>
          <div className="stat-label">Total Lifetime Reservations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>🪑</div>
          <div className="stat-value">{loading ? '-' : stats.activeTables}</div>
          <div className="stat-label">Active Tables</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>🏢</div>
          <div className="stat-value">{loading ? '-' : stats.totalTables}</div>
          <div className="stat-label">Total Tables</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
