import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ventasAPI } from '../services/api';

const HistorialVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
  });

  useEffect(() => {
    loadVentas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [ventas, filters]);

  const loadVentas = async () => {
    try {
      setLoading(true);
      const response = await ventasAPI.getAll();
      setVentas(response.data.data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...ventas];

    if (filters.fechaInicio) {
      filtered = filtered.filter((v) => v.fecha >= filters.fechaInicio);
    }

    if (filters.fechaFin) {
      filtered = filtered.filter((v) => v.fecha <= filters.fechaFin);
    }

    setFilteredVentas(filtered);
  };

  const normalizeItems = (items) => {
    if (!items) return [];
    // item puede venir como array o como objeto único según el parser/servidor
    const item = items.item;
    if (item == null) return [];
    return Array.isArray(item) ? [...item] : [item];
  };

  const verDetalle = async (venta) => {
    try {
      setLoading(true);
      const response = await ventasAPI.getById(venta.id);
      setSelectedVenta(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error al cargar detalle de venta:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Fecha', accessor: 'fecha' },
    {
      header: 'Cantidad',
      cell: (row) =>
        normalizeItems(row.items).reduce(
          (sum, it) => sum + (parseInt(it.cantidad, 10) || 0),
          0
        ),
    },
    {
      header: 'Total',
      cell: (row) => `$${parseFloat(row.total).toFixed(2)}`,
    },
    {
      header: 'Acciones',
      cell: (row) => (
        <button
          onClick={() => verDetalle(row)}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <Eye size={18} className="mr-1" />
          Ver Detalle
        </button>
      ),
    },
  ];

  const itemsColumns = [
    { header: 'Libro', accessor: 'tituloLibro' },
    { header: 'Cantidad', accessor: 'cantidad' },
    {
      header: 'Precio Unit.',
      cell: (row) => `$${parseFloat(row.precioUnitario).toFixed(2)}`,
    },
    {
      header: 'Subtotal',
      cell: (row) => `$${(parseFloat(row.precioUnitario) * parseInt(row.cantidad)).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Fecha Inicio"
            type="date"
            value={filters.fechaInicio}
            onChange={(e) => setFilters((prev) => ({ ...prev, fechaInicio: e.target.value }))}
          />
          <Input
            label="Fecha Fin"
            type="date"
            value={filters.fechaFin}
            onChange={(e) => setFilters((prev) => ({ ...prev, fechaFin: e.target.value }))}
          />
        </div>

        {loading && <div className="text-center py-8 text-gray-500">Cargando...</div>}
        {!loading && <Table columns={columns} data={filteredVentas} />}
      </Card>

      {/* Modal Detalle de Venta */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Detalle de Venta #${selectedVenta?.id}`}
        size="lg"
      >
        {selectedVenta && (
          <div>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Fecha</p>
                <p className="font-semibold">{selectedVenta.fecha}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-semibold text-lg text-blue-600">
                  ${parseFloat(selectedVenta.total).toFixed(2)}
                </p>
              </div>
            </div>

            <h3 className="font-semibold mb-3">Items de la Venta</h3>
            <Table 
              columns={itemsColumns} 
              data={normalizeItems(selectedVenta.items)} 
            />

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowModal(false)}>Cerrar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HistorialVentas;
