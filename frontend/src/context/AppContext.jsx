import { createContext, useContext, useState, useCallback } from 'react';
import { librosAPI, ventasAPI } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [libros, setLibros] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLibros = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await librosAPI.getAll(params);
      setLibros(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar libros');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVentas = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ventasAPI.getAll(params);
      setVentas(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar ventas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    libros,
    ventas,
    loading,
    error,
    fetchLibros,
    fetchVentas,
    setLibros,
    setVentas,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
