import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';

const ReservationManagementPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchReservations();
  }, [dateFilter]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const filters = dateFilter ? { date: dateFilter } : {};
      const res = await adminService.getAllReservations(filters);
      if (res.success) {
        setReservations(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      const res = await adminService.cancelReservation(id);
      if (res.success) {
        setReservations(reservations.map(r => r._id === id ? { ...r, status: 'cancelled' } : r));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Reservations</h1>
          <p className="page-subtitle">Manage all customer reservations.</p>
        </div>
        <div className="form-group" style={{ width: '200px' }}>
          <label className="form-label" htmlFor="dateFilter">Filter by Date</label>
          <input 
            type="date" 
            id="dateFilter"
            className="form-input" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Table</th>
                <th>Guests</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                    <div className="spinner spinner-primary" style={{ margin: '0 auto' }}></div>
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                    No reservations found.
                  </td>
                </tr>
              ) : (
                reservations.map(res => (
                  <tr key={res._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{res.reservationDate}</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{res.reservationStartTime} - {res.reservationEndTime}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{res.customer?.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{res.customer?.email}</div>
                    </td>
                    <td>
                      Table {res.table?.tableNumber}
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Cap: {res.table?.seatingCapacity}</div>
                    </td>
                    <td>{res.guestCount}</td>
                    <td>
                      {res.status === 'confirmed' ? (
                        <span className="badge badge-success">Confirmed</span>
                      ) : (
                        <span className="badge badge-danger">Cancelled</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {res.status === 'confirmed' && (
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(res._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReservationManagementPage;
