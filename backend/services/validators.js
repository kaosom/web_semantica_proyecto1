const toStr = (v) => (v == null || v === undefined ? '' : String(v));

/**
 * Valida los datos de un libro
 * @param {Object} libro - Datos del libro
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validateLibro = (libro) => {
  const errors = [];

  // Campos obligatorios (toStr evita error si titulo/autor vienen como número desde XML/form)
  if (!toStr(libro.titulo).trim()) {
    errors.push('El título es obligatorio');
  }

  if (!toStr(libro.autor).trim()) {
    errors.push('El autor es obligatorio');
  }

  // Validación de precio
  if (libro.precio === undefined || libro.precio === null) {
    errors.push('El precio es obligatorio');
  } else {
    const precio = parseFloat(libro.precio);
    if (isNaN(precio) || precio <= 0) {
      errors.push('El precio debe ser mayor a 0');
    }
  }

  // Validación de stock
  if (libro.stock === undefined || libro.stock === null) {
    errors.push('El stock es obligatorio');
  } else {
    const stock = parseInt(libro.stock);
    if (isNaN(stock) || stock < 0) {
      errors.push('El stock debe ser mayor o igual a 0');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Valida que un ISBN sea único
 * @param {string} isbn - ISBN a validar
 * @param {Array} libros - Lista de libros existentes
 * @param {string} excludeId - ID a excluir de la validación (para edición)
 * @returns {boolean}
 */
export const isIsbnUnique = (isbn, libros, excludeId = null) => {
  const isbnStr = toStr(isbn).trim();
  if (!isbnStr) {
    return true; // ISBN es opcional
  }

  return !libros.some(libro =>
    toStr(libro.isbn).trim() === isbnStr && libro.id != excludeId
  );
};

/**
 * Valida los items de una venta
 * @param {Array} items - Items de la venta
 * @param {Array} libros - Lista de libros disponibles
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validateVenta = (items, libros) => {
  const errors = [];

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('La venta debe tener al menos un item');
    return { valid: false, errors };
  }

  items.forEach((item, index) => {
    if (!item.libroId) {
      errors.push(`Item ${index + 1}: El ID del libro es obligatorio`);
      return;
    }

    const libro = libros.find(l => l.id == item.libroId);
    if (!libro) {
      errors.push(`Item ${index + 1}: Libro con ID ${item.libroId} no encontrado`);
      return;
    }

    const cantidad = parseInt(item.cantidad);
    if (isNaN(cantidad) || cantidad <= 0) {
      errors.push(`Item ${index + 1}: La cantidad debe ser mayor a 0`);
      return;
    }

    if (cantidad > parseInt(libro.stock)) {
      errors.push(`Item ${index + 1}: Stock insuficiente. Disponible: ${libro.stock}, Solicitado: ${cantidad}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};
