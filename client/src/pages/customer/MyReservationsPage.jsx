import React, { useEffect, useState } from 'react';
import reservationService from '../../services/reservationService';
import { Link } from 'react-router-dom';

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await reservationService.getMyReservations();
      if (res.success) {
        setReservations(res.data);
      }
    } catch (err) {
      setError('Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    
    setCancelLoading(id);
    try {
      const res = await reservationService.cancelReservation(id);
      if (res.success) {
        setReservations(reservations.map(r => r._id === id ? { ...r, status: 'cancelled' } : r));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setCancelLoading(null);
    }
  };

  const isPast = (date, time) => {
    const resDateTime = new Date(`${date}T${time}:00`);
    return resDateTime <= new Date();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <div className="skeleton" style={{ height: '100px' }}></div>
        <div className="skeleton" style={{ height: '100px' }}></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">My Reservations</h1>
          <p className="page-subtitle">View and manage your bookings.</p>
        </div>
        <Link to="/reservations/new" className="btn btn-primary">
          Book Table
        </Link>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '20px' }}>{error}</div>}

      {reservations.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">🍽️</div>
          <div className="empty-state-title">No reservations yet</div>
          <div className="empty-state-desc">You haven't booked any tables yet. Start by creating a new reservation.</div>
          <Link to="/reservations/new" className="btn btn-primary" style={{ marginTop: '16px' }}>Book a Table</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reservations.map(res => {
            const past = isPast(res.reservationDate, res.reservationStartTime);
            const canCancel = res.status === 'confirmed' && !past;

            return (
              <div key={res._id} className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: 1, minWidth: '300px' }}>
                  <div style={{ background: 'var(--color-surface-2)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      {new Date(res.reservationDate).toLocaleString('default', { month: 'short' })}
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-primary)', lineHeight: '1' }}>
                      {new Date(res.reservationDate).getDate()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                      {res.reservationStartTime} - {res.reservationEndTime}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                      Table {res.table?.tableNumber} • {res.guestCount} Guests
                    </div>
                    <div>
                      {res.status === 'confirmed' ? (
                        <span className="badge badge-success">Confirmed</span>
                      ) : (
                        <span className="badge badge-danger">Cancelled</span>
                      )}
                      {past && res.status === 'confirmed' && (
                        <span className="badge badge-info" style={{ marginLeft: '8px' }}>Past</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {canCancel && (
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancel(res._id)}
                    disabled={cancelLoading === res._id}
                  >
                    {cancelLoading === res._id ? 'Cancelling...' : 'Cancel Reservation'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReservationsPage;
