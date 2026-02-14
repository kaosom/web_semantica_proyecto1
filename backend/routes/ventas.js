import express from 'express';
import { readXML, writeXML, getNextId } from '../services/xmlService.js';
import { validateVenta } from '../services/validators.js';

const router = express.Router();

/**
 * Normaliza el array de ventas
 */
const normalizeVentas = (data) => {
  if (!data.ventas) {
    return [];
  }
  
  if (!data.ventas.venta) {
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
 * POST /api/ventas - Registrar una nueva venta
 */
router.post('/', (req, res) => {
  try {
    // Leer datos
    const librosData = readXML('libros.xml');
    const ventasData = readXML('ventas.xml');
    
    let libros = normalizeLibros(librosData);
    let ventas = normalizeVentas(ventasData);

    // Validar items de la venta
    const validation = validateVenta(req.body.items, libros);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.errors.join(', ')
      });
    }

    // Calcular totales y preparar items (guardamos título y autor por si el libro se elimina después)
    let total = 0;
    const itemsVenta = req.body.items.map(item => {
      const libro = libros.find(l => l.id == item.libroId);
      const cantidad = parseInt(item.cantidad);
      const precioUnitario = parseFloat(libro.precio);
      const subtotal = cantidad * precioUnitario;
      
      total += subtotal;

      return {
        libroId: item.libroId,
        cantidad: cantidad,
        precioUnitario: precioUnitario,
        tituloLibro: libro.titulo || item.titulo || '',
        autor: libro.autor || item.autor || ''
      };
    });

    // Crear nueva venta
    const nuevaVenta = {
      id: getNextId(ventas),
      fecha: new Date().toISOString().split('T')[0],
      total: total,
      items: {
        item: itemsVenta
      }
    };

    // Actualizar stock de libros
    req.body.items.forEach(item => {
      const index = libros.findIndex(l => l.id == item.libroId);
      if (index !== -1) {
        libros[index].stock = parseInt(libros[index].stock) - parseInt(item.cantidad);
      }
    });

    // Guardar cambios
    ventas.push(nuevaVenta);
    writeXML('ventas.xml', { ventas: { venta: ventas } });
    writeXML('libros.xml', { libros: { libro: libros } });

    res.status(201).json({
      success: true,
      data: nuevaVenta
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al registrar venta: ' + error.message
    });
  }
});

/**
 * GET /api/ventas - Listar ventas con filtros opcionales
 */
router.get('/', (req, res) => {
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

    // Enriquecer ventas con información de libros (usar título/autor guardado si el libro ya no existe)
    const ventasEnriquecidas = ventas.map(venta => {
      const items = normalizeItems(venta.items);
      const itemsConInfo = items.map(item => {
        const libro = libros.find(l => l.id == item.libroId);
        return {
          ...item,
          tituloLibro: libro ? libro.titulo : (item.tituloLibro || 'Libro no encontrado'),
          autor: libro ? libro.autor : (item.autor || '')
        };
      });

      return {
        ...venta,
        // Asegurar que item sea siempre array para que el frontend cuente bien
        items: { item: Array.isArray(itemsConInfo) ? itemsConInfo : [itemsConInfo] }
      };
    });

    res.json({
      success: true,
      data: ventasEnriquecidas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener ventas: ' + error.message
    });
  }
});

/**
 * GET /api/ventas/:id - Obtener detalle de una venta
 */
router.get('/:id', (req, res) => {
  try {
    const ventasData = readXML('ventas.xml');
    const librosData = readXML('libros.xml');
    
    const ventas = normalizeVentas(ventasData);
    const libros = normalizeLibros(librosData);
    
    const venta = ventas.find(v => v.id == req.params.id);

    if (!venta) {
      return res.status(404).json({
        success: false,
        error: 'Venta no encontrada'
      });
    }

    // Enriquecer con información de libros (usar título/autor guardado si el libro ya no existe)
    const items = normalizeItems(venta.items);
    const itemsConInfo = items.map(item => {
      const libro = libros.find(l => l.id == item.libroId);
      return {
        ...item,
        tituloLibro: libro ? libro.titulo : (item.tituloLibro || 'Libro no encontrado'),
        autor: libro ? libro.autor : (item.autor || '')
      };
    });

    res.json({
      success: true,
      data: {
        ...venta,
        items: { item: Array.isArray(itemsConInfo) ? itemsConInfo : [itemsConInfo] }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener venta: ' + error.message
    });
  }
});

export default router;
