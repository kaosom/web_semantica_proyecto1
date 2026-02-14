import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Libros API
export const librosAPI = {
  getAll: (params = {}) => api.get('/libros', { params }),
  getById: (id) => api.get(`/libros/${id}`),
  create: (libro) => api.post('/libros', libro),
  update: (id, libro) => api.put(`/libros/${id}`, libro),
  delete: (id) => api.delete(`/libros/${id}`),
};

// Ventas API
export const ventasAPI = {
  getAll: (params = {}) => api.get('/ventas', { params }),
  getById: (id) => api.get(`/ventas/${id}`),
  create: (venta) => api.post('/ventas', venta),
};

// Reportes API
export const reportesAPI = {
  ventas: (params = {}) => api.get('/reportes/ventas', { params }),
  inventario: () => api.get('/reportes/inventario'),
};

export default api;
