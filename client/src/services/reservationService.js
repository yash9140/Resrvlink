import api from './api';

const reservationService = {
  createReservation: async (data) => {
    const response = await api.post('/reservations', data);
    return response.data;
  },
  
  getMyReservations: async () => {
    const response = await api.get('/reservations/my');
    return response.data;
  },

  cancelReservation: async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },
};

export default reservationService;
