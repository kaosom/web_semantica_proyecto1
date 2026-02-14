import express from 'express';
import cors from 'cors';
import librosRouter from './routes/libros.js';
import ventasRouter from './routes/ventas.js';
import reportesRouter from './routes/reportes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/libros', librosRouter);
app.use('/api/ventas', ventasRouter);
app.use('/api/reportes', reportesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sistema de Venta de Libros API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 API de Libros: http://localhost:${PORT}/api/libros`);
  console.log(`🛒 API de Ventas: http://localhost:${PORT}/api/ventas`);
  console.log(`📊 API de Reportes: http://localhost:${PORT}/api/reportes`);
});
