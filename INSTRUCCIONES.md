# Instrucciones de Uso - Sistema de Venta de Libros

## Inicio Rápido

### Opción 1: Un Solo Comando (RECOMENDADO)

Desde la raíz del proyecto, ejecuta:

```bash
npm run dev
```

Esto iniciará automáticamente:
- Backend en `http://localhost:3001`
- Frontend en `http://localhost:5173`

Luego abre tu navegador en: `http://localhost:5173`

### Opción 2: Iniciar por Separado

#### 1. Iniciar el Backend

Abre una terminal y ejecuta:

```bash
cd backend
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

#### 2. Iniciar el Frontend

Abre otra terminal y ejecuta:

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

#### 3. Acceder a la Aplicación

Abre tu navegador y visita: `http://localhost:5173`

## Funcionalidades Principales

### Dashboard
- Vista general con métricas clave
- Total de libros en inventario
- Libros con stock bajo
- Ventas e ingresos del mes
- Historial de ventas recientes

### Gestión de Libros
1. **Ver todos los libros**: La tabla muestra todos los libros disponibles
2. **Buscar libros**: Usa la barra de búsqueda para filtrar por título o autor
3. **Filtrar libros**: 
   - Por categoría
   - Por rango de precio (mínimo y máximo)
4. **Crear nuevo libro**:
   - Click en "Nuevo Libro"
   - Completa el formulario
   - Los campos con * son obligatorios
   - Click en "Guardar"
5. **Editar libro**:
   - Click en el icono de lápiz
   - Modifica los campos necesarios
   - Click en "Guardar"
6. **Eliminar libro**:
   - Click en el icono de basura
   - Confirma la eliminación

### Punto de Venta
1. **Buscar libros**: Usa la barra de búsqueda
2. **Agregar al carrito**:
   - Ingresa la cantidad deseada
   - Click en "Agregar"
3. **Modificar carrito**:
   - Cambia la cantidad directamente en el carrito
   - Click en el icono de basura para eliminar un item
4. **Confirmar venta**:
   - Verifica el total
   - Click en "Confirmar Venta"
   - El sistema actualiza automáticamente el stock

### Historial de Ventas
1. **Ver todas las ventas**: Se muestran en la tabla
2. **Filtrar por fecha**:
   - Selecciona fecha de inicio
   - Selecciona fecha de fin
3. **Ver detalle de venta**:
   - Click en "Ver Detalle"
   - Se muestra información completa de los items vendidos

### Reportes

#### Reporte de Ventas
1. Selecciona el rango de fechas
2. Click en "Generar Reporte"
3. Verás:
   - Total de ventas en el período
   - Ingresos totales
   - Libro más vendido
   - Detalle de todas las ventas

#### Reporte de Inventario
1. Click en la pestaña "Reporte de Inventario"
2. Click en "Generar Reporte de Inventario"
3. Verás:
   - Total de libros en inventario
   - Libros con stock bajo (menos de 5 unidades)
   - Valor total del inventario
   - Libros agrupados por categoría

## Datos de Ejemplo

El sistema incluye 5 libros de ejemplo:
- Clean Code - Robert C. Martin (Programación) - $450
- El Quijote - Miguel de Cervantes (Literatura) - $280
- Cien Años de Soledad - Gabriel García Márquez (Literatura) - $320
- Design Patterns - Gang of Four (Programación) - $580
- 1984 - George Orwell (Ficción) - $250

## Validaciones del Sistema

### Libros
- El título es obligatorio
- El autor es obligatorio
- El precio debe ser mayor a 0
- El stock debe ser mayor o igual a 0
- El ISBN debe ser único (si se proporciona)

### Ventas
- No se puede vender más cantidad de la disponible en stock
- La cantidad debe ser mayor a 0
- El carrito no puede estar vacío al confirmar venta

## Persistencia de Datos

Todos los datos se guardan en archivos XML ubicados en:
- `backend/data/libros.xml` - Base de datos de libros
- `backend/data/ventas.xml` - Registro de ventas

Los cambios son inmediatos y permanentes.

## Solución de Problemas

### El backend no inicia
- Verifica que Node.js esté instalado: `node --version`
- Asegúrate de estar en la carpeta `backend`
- Verifica que las dependencias estén instaladas: `npm install`

### El frontend no inicia
- Verifica que estés en la carpeta `frontend`
- Asegúrate de que las dependencias estén instaladas: `npm install`
- Verifica que el puerto 5173 esté disponible

### Error "Cannot connect to server"
- Verifica que el backend esté corriendo en `http://localhost:3001`
- Revisa la consola del backend para ver posibles errores

### Los cambios no se guardan
- Verifica que el backend tenga permisos de escritura en la carpeta `data`
- Revisa la consola del navegador y del backend para errores

## Características Adicionales

### Diseño Responsive
El sistema está optimizado para pantallas de laptop (≥1280px de ancho)

### Búsqueda en Tiempo Real
La búsqueda tiene un delay de 500ms para optimizar el rendimiento

### Validación en Tiempo Real
Los formularios validan los datos mientras escribes

### Confirmaciones
Las acciones destructivas (eliminar) requieren confirmación

### Mensajes de Estado
El sistema muestra alertas de éxito, error y advertencia según corresponda

## Atajos de Teclado

- En formularios: `Enter` para guardar
- En modales: `Esc` para cerrar (próximamente)

## Navegación

Usa el menú lateral para navegar entre secciones:
- Dashboard - Vista general
- Libros - Gestión de inventario
- Punto de Venta - Realizar ventas
- Historial - Consultar ventas pasadas
- Reportes - Análisis y métricas
