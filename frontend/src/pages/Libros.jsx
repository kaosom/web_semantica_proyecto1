import { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import SearchBar from '../components/ui/SearchBar';
import Alert from '../components/ui/Alert';
import { librosAPI } from '../services/api';

const toSearchText = (v) => (v == null ? '' : String(v).toLowerCase().trim());

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [filteredLibros, setFilteredLibros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingLibro, setEditingLibro] = useState(null);
  const [deletingLibro, setDeletingLibro] = useState(null);
  const [alert, setAlert] = useState(null);
  
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    categoria: '',
    precio: '',
    stock: '',
    isbn: '',
    editorial: '',
    anioPublicacion: '',
    descripcion: '',
    idioma: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const [filters, setFilters] = useState({
    search: '',
    categoria: '',
    precioMin: '',
    precioMax: '',
  });

  useEffect(() => {
    loadLibros();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [libros, filters]);

  const loadLibros = async () => {
    try {
      setLoading(true);
      const response = await librosAPI.getAll();
      setLibros(response.data.data);
    } catch (error) {
      showAlert('error', 'Error al cargar libros');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...libros];

    // Búsqueda por título, autor, categoría, ISBN, editorial (seguro ante números/null)
    const searchTerm = (filters.search || '').trim().toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter((l) => {
        const titulo = toSearchText(l.titulo);
        const autor = toSearchText(l.autor);
        const categoria = toSearchText(l.categoria);
        const isbn = toSearchText(l.isbn);
        const editorial = toSearchText(l.editorial);
        return (
          titulo.includes(searchTerm) ||
          autor.includes(searchTerm) ||
          categoria.includes(searchTerm) ||
          isbn.includes(searchTerm) ||
          editorial.includes(searchTerm)
        );
      });
    }

    // Filtro por categoría
    if (filters.categoria) {
      filtered = filtered.filter(
        (l) => toSearchText(l.categoria).includes(toSearchText(filters.categoria))
      );
    }

    // Filtro por rango de precio
    if (filters.precioMin) {
      filtered = filtered.filter((l) => parseFloat(l.precio) >= parseFloat(filters.precioMin));
    }
    if (filters.precioMax) {
      filtered = filtered.filter((l) => parseFloat(l.precio) <= parseFloat(filters.precioMax));
    }

    setFilteredLibros(filtered);
  }, [libros, filters]);

  const handleSearchChange = useCallback((e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const openCreateModal = () => {
    setEditingLibro(null);
    setFormData({
      titulo: '',
      autor: '',
      categoria: '',
      precio: '',
      stock: '',
      isbn: '',
      editorial: '',
      anioPublicacion: '',
      descripcion: '',
      idioma: '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (libro) => {
    setEditingLibro(libro);
    setFormData({
      titulo: libro.titulo,
      autor: libro.autor,
      categoria: libro.categoria || '',
      precio: libro.precio,
      stock: libro.stock,
      isbn: libro.isbn || '',
      editorial: libro.editorial || '',
      anioPublicacion: libro.anioPublicacion || '',
      descripcion: libro.descripcion || '',
      idioma: libro.idioma || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openDeleteModal = (libro) => {
    setDeletingLibro(libro);
    setShowDeleteModal(true);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.titulo.trim()) errors.titulo = 'El título es obligatorio';
    if (!formData.autor.trim()) errors.autor = 'El autor es obligatorio';
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      errors.precio = 'El precio debe ser mayor a 0';
    }
    if (formData.stock === '' || parseInt(formData.stock) < 0) {
      errors.stock = 'El stock debe ser mayor o igual a 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const libroData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
      };

      if (editingLibro) {
        await librosAPI.update(editingLibro.id, libroData);
        showAlert('success', 'Libro actualizado exitosamente');
      } else {
        await librosAPI.create(libroData);
        showAlert('success', 'Libro creado exitosamente');
      }

      setShowModal(false);
      loadLibros();
    } catch (error) {
      showAlert('error', error.response?.data?.error || 'Error al guardar libro');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await librosAPI.delete(deletingLibro.id);
      showAlert('success', 'Libro eliminado exitosamente');
      setShowDeleteModal(false);
      loadLibros();
    } catch (error) {
      showAlert('error', 'Error al eliminar libro');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const columns = [
    { header: 'Título', accessor: 'titulo' },
    { header: 'Autor', accessor: 'autor' },
    { header: 'Categoría', accessor: 'categoria' },
    { 
      header: 'Precio', 
      cell: (row) => `$${parseFloat(row.precio).toFixed(2)}` 
    },
    { header: 'Stock', accessor: 'stock' },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openEditModal(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const categorias = [...new Set(libros.map((l) => l.categoria).filter(Boolean))];

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <Card>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
          <div className="flex-1 w-full lg:w-auto lg:max-w-md">
            <SearchBar 
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Buscar por título, autor, categoría, ISBN o editorial..."
            />
          </div>
          <Button onClick={openCreateModal}>
            <Plus size={20} className="mr-2" />
            Nuevo Libro
          </Button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="label">Categoría</label>
            <select
              className="input"
              value={filters.categoria}
              onChange={(e) => setFilters((prev) => ({ ...prev, categoria: e.target.value }))}
            >
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Precio mínimo</label>
            <input
              type="number"
              className="input"
              value={filters.precioMin}
              onChange={(e) => setFilters((prev) => ({ ...prev, precioMin: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div>
            <label className="label">Precio máximo</label>
            <input
              type="number"
              className="input"
              value={filters.precioMax}
              onChange={(e) => setFilters((prev) => ({ ...prev, precioMax: e.target.value }))}
              placeholder="999999"
            />
          </div>
        </div>

        {loading && <div className="text-center py-8 text-gray-500">Cargando...</div>}
        {!loading && filteredLibros.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            {libros.length === 0
              ? 'No hay libros en el catálogo.'
              : 'No hay libros que coincidan con la búsqueda o filtros.'}
          </p>
        )}
        {!loading && filteredLibros.length > 0 && (
          <Table columns={columns} data={filteredLibros} />
        )}
      </Card>

      {/* Modal Crear/Editar */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingLibro ? 'Editar Libro' : 'Nuevo Libro'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Título"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            error={formErrors.titulo}
            required
          />
          <Input
            label="Autor"
            name="autor"
            value={formData.autor}
            onChange={handleInputChange}
            error={formErrors.autor}
            required
          />
          <Input
            label="Categoría"
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
          />
          <Input
            label="Precio"
            name="precio"
            type="number"
            step="0.01"
            value={formData.precio}
            onChange={handleInputChange}
            error={formErrors.precio}
            required
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
            error={formErrors.stock}
            required
          />
          <Input
            label="ISBN"
            name="isbn"
            value={formData.isbn}
            onChange={handleInputChange}
          />
          <Input
            label="Editorial"
            name="editorial"
            value={formData.editorial}
            onChange={handleInputChange}
          />
          <Input
            label="Año de publicación"
            name="anioPublicacion"
            value={formData.anioPublicacion}
            onChange={handleInputChange}
            placeholder="Ej: 2020"
          />
          <Input
            label="Idioma"
            name="idioma"
            value={formData.idioma}
            onChange={handleInputChange}
            placeholder="Ej: Español"
          />
          <div>
            <label className="label">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={3}
              className="input"
              placeholder="Breve descripción del libro"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Eliminar */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
        size="sm"
      >
        <p className="text-gray-700 mb-6">
          ¿Estás seguro de eliminar el libro <strong>{deletingLibro?.titulo}</strong>?
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Libros;
