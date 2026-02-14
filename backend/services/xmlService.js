import fs from 'fs';
import path from 'path';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  textNodeName: '_text',
  parseAttributeValue: true
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  format: true,
  suppressEmptyNode: true
});

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Lee y parsea un archivo XML
 * @param {string} filename - Nombre del archivo XML
 * @returns {Object} Datos parseados
 */
export const readXML = (filename) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Archivo ${filename} no existe`);
    }

    const xmlData = fs.readFileSync(filePath, 'utf-8');
    const result = parser.parse(xmlData);
    
    return result;
  } catch (error) {
    console.error(`Error leyendo XML ${filename}:`, error.message);
    throw error;
  }
};

/**
 * Escribe datos en un archivo XML
 * @param {string} filename - Nombre del archivo XML
 * @param {Object} data - Datos a escribir
 */
export const writeXML = (filename, data) => {
  try {
    const filePath = path.join(DATA_DIR, filename);
    
    // Asegurar que el directorio existe
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const xmlContent = builder.build(data);
    const xmlWithDeclaration = `<?xml version="1.0" encoding="UTF-8"?>\n${xmlContent}`;
    
    fs.writeFileSync(filePath, xmlWithDeclaration, 'utf-8');
  } catch (error) {
    console.error(`Error escribiendo XML ${filename}:`, error.message);
    throw error;
  }
};

/**
 * Genera un ID único basado en el timestamp
 * @returns {number} ID único
 */
export const generateId = () => {
  return Date.now();
};

/**
 * Obtiene el siguiente ID disponible para un array de elementos
 * @param {Array} items - Array de elementos con id
 * @returns {number} Siguiente ID
 */
export const getNextId = (items) => {
  if (!items || items.length === 0) {
    return 1;
  }
  
  const maxId = Math.max(...items.map(item => parseInt(item.id) || 0));
  return maxId + 1;
};
