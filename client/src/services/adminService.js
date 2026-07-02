import api from './api';

const adminService = {
  getAllReservations: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/admin/reservations?${params}`);
    return response.data;
  },

  updateReservation: async (id, data) => {
    const response = await api.put(`/admin/reservations/${id}`, data);
    return response.data;
  },

  cancelReservation: async (id) => {
    const response = await api.delete(`/admin/reservations/${id}`);
    return response.data;
  },
};

export default adminService;
