import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../../services/reservationService';

const NewReservationPage = () => {
  const [formData, setFormData] = useState({
    reservationDate: '',
    reservationStartTime: '',
    reservationEndTime: '',
    guestCount: 2,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const timeSlots = [];
  for (let i = 10; i <= 22; i++) {
    timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${i.toString().padStart(2, '0')}:30`);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartTimeChange = (e) => {
    const startTime = e.target.value;
    let endTime = '';
    
    if (startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const endHours = hours + 1; // Default 1 hour duration
      endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    setFormData(prev => ({
      ...prev,
      reservationStartTime: startTime,
      reservationEndTime: endTime
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await reservationService.createReservation(formData);
      if (res.success) {
        setSuccess('Reservation created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/reservations');
        }, 2000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join('. '));
      } else {
        setError(err.response?.data?.message || 'Failed to create reservation');
      }
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Book a Table</h1>
        <p className="page-subtitle">Reserve your spot at our restaurant.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div className="alert alert-error" style={{ marginBottom: '20px' }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginBottom: '20px' }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reservationDate">Date</label>
              <input
                type="date"
                id="reservationDate"
                name="reservationDate"
                className="form-input"
                min={today}
                value={formData.reservationDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="guestCount">Number of Guests</label>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                className="form-input"
                min="1"
                max="50"
                value={formData.guestCount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reservationStartTime">Start Time</label>
              <select
                id="reservationStartTime"
                name="reservationStartTime"
                className="form-input"
                value={formData.reservationStartTime}
                onChange={handleStartTimeChange}
                required
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={`start-${time}`} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reservationEndTime">End Time</label>
              <select
                id="reservationEndTime"
                name="reservationEndTime"
                className="form-input"
                value={formData.reservationEndTime}
                onChange={handleChange}
                required
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={`end-${time}`} value={time} disabled={time <= formData.reservationStartTime}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="specialRequests">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              className="form-input"
              rows="3"
              placeholder="Any allergies or preferences?"
              value={formData.specialRequests}
              onChange={handleChange}
              maxLength="300"
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Confirm Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewReservationPage;
