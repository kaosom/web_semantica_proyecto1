import express from 'express';
import { readXML } from '../services/xmlService.js';

const router = express.Router();

/**
 * Normaliza el array de ventas
 */
const normalizeVentas = (data) => {
  if (!data.ventas || !data.ventas.venta) {
    return [];
  }
  return Array.isArray(data.ventas.venta) ? data.ventas.venta : [data.ventas.venta];
};

/**
 * Normaliza el array de libros
 */
const normalizeLibros = (data) => {
  if (!data.libros || !data.libros.libro) {
    return [];
  }
  return Array.isArray(data.libros.libro) ? data.libros.libro : [data.libros.libro];
};

/**
 * Normaliza los items de una venta
 */
const normalizeItems = (items) => {
  if (!items || !items.item) {
    return [];
  }
  return Array.isArray(items.item) ? items.item : [items.item];
};

/**
 * GET /api/reportes/ventas - Reporte de ventas
 */
router.get('/ventas', (req, res) => {
  try {
    const ventasData = readXML('ventas.xml');
    const librosData = readXML('libros.xml');
    
    let ventas = normalizeVentas(ventasData);
    const libros = normalizeLibros(librosData);

    // Aplicar filtros de fecha
    const { fechaInicio, fechaFin } = req.query;

    if (fechaInicio) {
      ventas = ventas.filter(v => v.fecha >= fechaInicio);
    }

    if (fechaFin) {
      ventas = ventas.filter(v => v.fecha <= fechaFin);
    }

    // Calcular métricas
    const totalVentas = ventas.length;
    const ingresosTotales = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);

    // Calcular libro más vendido
    const librosCantidades = {};
    ventas.forEach(venta => {
      const items = normalizeItems(venta.items);
      items.forEach(item => {
        const libroId = item.libroId;
        librosCantidades[libroId] = (librosCantidades[libroId] || 0) + parseInt(item.cantidad);
      });
    });

    let libroMasVendido = null;
    if (Object.keys(librosCantidades).length > 0) {
      const libroIdMasVendido = Object.keys(librosCantidades).reduce((a, b) => 
        librosCantidades[a] > librosCantidades[b] ? a : b
      );
      const libro = libros.find(l => l.id == libroIdMasVendido);
      
      if (libro) {
        libroMasVendido = {
          id: libro.id,
          titulo: libro.titulo,
          autor: libro.autor,
          cantidadVendida: librosCantidades[libroIdMasVendido]
        };
      }
    }

    // Enriquecer ventas con información de libros (usar título guardado si el libro ya no existe)
    const ventasDetalladas = ventas.map(venta => {
      const items = normalizeItems(venta.items);
      const itemsConInfo = items.map(item => {
        const libro = libros.find(l => l.id == item.libroId);
        return {
          ...item,
          tituloLibro: libro ? libro.titulo : (item.tituloLibro || 'Libro no encontrado')
        };
      });

      return {
        ...venta,
        items: { item: itemsConInfo }
      };
    });

    res.json({
      success: true,
      data: {
        totalVentas,
        ingresosTotales: parseFloat(ingresosTotales.toFixed(2)),
        libroMasVendido,
        ventas: ventasDetalladas
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al generar reporte de ventas: ' + error.message
    });
  }
});

/**
 * GET /api/reportes/inventario - Reporte de inventario
 */
router.get('/inventario', (req, res) => {
  try {
    const librosData = readXML('libros.xml');
    const libros = normalizeLibros(librosData);

    // Calcular métricas
    const totalLibros = libros.length;
    const librosStockBajo = libros.filter(l => parseInt(l.stock) < 5);
    const valorTotalInventario = libros.reduce((sum, l) => 
      sum + (parseFloat(l.precio) * parseInt(l.stock)), 0
    );

    // Agrupar por categoría
    const librosPorCategoria = {};
    libros.forEach(libro => {
      const categoria = libro.categoria || 'Sin categoría';
      if (!librosPorCategoria[categoria]) {
        librosPorCategoria[categoria] = [];
      }
      librosPorCategoria[categoria].push(libro);
    });

    res.json({
      success: true,
      data: {
        totalLibros,
        librosStockBajo: librosStockBajo.length,
        librosConStockBajo: librosStockBajo,
        valorTotalInventario: parseFloat(valorTotalInventario.toFixed(2)),
        librosPorCategoria: Object.keys(librosPorCategoria).map(categoria => ({
          categoria,
          cantidad: librosPorCategoria[categoria].length,
          libros: librosPorCategoria[categoria]
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al generar reporte de inventario: ' + error.message
    });
  }
});

export default router;
