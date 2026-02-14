import express from 'express';
import { readXML, writeXML, getNextId } from '../services/xmlService.js';
import { validateLibro, isIsbnUnique } from '../services/validators.js';

const router = express.Router();

/** Convierte a string y hace trim; evita error cuando el valor viene como número (ej. desde XML) */
const trimStr = (v) => (v == null || v === undefined ? '' : String(v).trim());

/**
 * Normaliza el array de libros para asegurar consistencia
 */
const normalizeLibros = (data) => {
  if (!data.libros) {
    return [];
  }
  
  if (!data.libros.libro) {
    return [];
  }

  // Si es un solo libro, convertir a array
  return Array.isArray(data.libros.libro) ? data.libros.libro : [data.libros.libro];
};

/**
 * GET /api/libros - Listar todos los libros con filtros opcionales
 */
router.get('/', (req, res) => {
  try {
    const data = readXML('libros.xml');
    let libros = normalizeLibros(data);

    // Aplicar filtros
    const { titulo, autor, categoria, precioMin, precioMax } = req.query;

    if (titulo) {
      libros = libros.filter(l => 
        l.titulo.toLowerCase().includes(titulo.toLowerCase())
      );
    }

    if (autor) {
      libros = libros.filter(l => 
        l.autor.toLowerCase().includes(autor.toLowerCase())
      );
    }

    if (categoria) {
      libros = libros.filter(l => 
        l.categoria && l.categoria.toLowerCase().includes(categoria.toLowerCase())
      );
    }

    if (precioMin) {
      libros = libros.filter(l => parseFloat(l.precio) >= parseFloat(precioMin));
    }

    if (precioMax) {
      libros = libros.filter(l => parseFloat(l.precio) <= parseFloat(precioMax));
    }

    res.json({
      success: true,
      data: libros
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener libros: ' + error.message
    });
  }
});

/**
 * GET /api/libros/:id - Obtener un libro por ID
 */
router.get('/:id', (req, res) => {
  try {
    const data = readXML('libros.xml');
    const libros = normalizeLibros(data);
    const libro = libros.find(l => l.id == req.params.id);

    if (!libro) {
      return res.status(404).json({
        success: false,
        error: 'Libro no encontrado'
      });
    }

    res.json({
      success: true,
      data: libro
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener libro: ' + error.message
    });
  }
});

/**
 * POST /api/libros - Crear nuevo libro
 */
router.post('/', (req, res) => {
  try {
    const data = readXML('libros.xml');
    let libros = normalizeLibros(data);

    // Validar datos
    const validation = validateLibro(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.errors.join(', ')
      });
    }

    // Validar ISBN único
    if (req.body.isbn && !isIsbnUnique(req.body.isbn, libros)) {
      return res.status(400).json({
        success: false,
        error: 'El ISBN ya existe'
      });
    }

    // Crear nuevo libro (trimStr evita "trim is not a function" si algún campo viene como número)
    const nuevoLibro = {
      id: getNextId(libros),
      titulo: trimStr(req.body.titulo),
      autor: trimStr(req.body.autor),
      categoria: trimStr(req.body.categoria),
      precio: parseFloat(req.body.precio),
      stock: parseInt(req.body.stock),
      isbn: trimStr(req.body.isbn),
      editorial: trimStr(req.body.editorial),
      anioPublicacion: trimStr(req.body.anioPublicacion),
      descripcion: trimStr(req.body.descripcion),
      idioma: trimStr(req.body.idioma),
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    libros.push(nuevoLibro);

    // Guardar en XML
    writeXML('libros.xml', { libros: { libro: libros } });

    res.status(201).json({
      success: true,
      data: nuevoLibro
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al crear libro: ' + error.message
    });
  }
});

/**
 * PUT /api/libros/:id - Actualizar libro
 */
router.put('/:id', (req, res) => {
  try {
    const data = readXML('libros.xml');
    let libros = normalizeLibros(data);
    const index = libros.findIndex(l => l.id == req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Libro no encontrado'
      });
    }

    // Validar datos
    const validation = validateLibro(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.errors.join(', ')
      });
    }

    // Validar ISBN único (excluyendo el libro actual)
    if (req.body.isbn && !isIsbnUnique(req.body.isbn, libros, req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'El ISBN ya existe'
      });
    }

    // Actualizar libro manteniendo el ID y fecha de registro (trimStr evita "trim is not a function")
    const libroActualizado = {
      id: libros[index].id,
      titulo: trimStr(req.body.titulo),
      autor: trimStr(req.body.autor),
      categoria: trimStr(req.body.categoria),
      precio: parseFloat(req.body.precio),
      stock: parseInt(req.body.stock),
      isbn: trimStr(req.body.isbn),
      editorial: trimStr(req.body.editorial),
      anioPublicacion: trimStr(req.body.anioPublicacion),
      descripcion: trimStr(req.body.descripcion),
      idioma: trimStr(req.body.idioma),
      fechaRegistro: libros[index].fechaRegistro
    };

    libros[index] = libroActualizado;

    // Guardar en XML
    writeXML('libros.xml', { libros: { libro: libros } });

    res.json({
      success: true,
      data: libroActualizado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar libro: ' + error.message
    });
  }
});

/**
 * DELETE /api/libros/:id - Eliminar libro
 */
router.delete('/:id', (req, res) => {
  try {
    const data = readXML('libros.xml');
    let libros = normalizeLibros(data);
    const index = libros.findIndex(l => l.id == req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Libro no encontrado'
      });
    }

    const libroEliminado = libros[index];
    libros.splice(index, 1);

    // Guardar en XML
    writeXML('libros.xml', { libros: { libro: libros.length > 0 ? libros : [] } });

    res.json({
      success: true,
      data: libroEliminado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar libro: ' + error.message
    });
  }
});

export default router;
