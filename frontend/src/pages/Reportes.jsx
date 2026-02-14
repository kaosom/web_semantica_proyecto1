import { useState } from 'react';
import { TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import Alert from '../components/ui/Alert';
import { reportesAPI } from '../services/api';

const Reportes = () => {
  const [activeTab, setActiveTab] = useState('ventas');
  const [reporteVentas, setReporteVentas] = useState(null);
  const [reporteInventario, setReporteInventario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const generarReporteVentas = async () => {
    if (!fechaInicio || !fechaFin) {
      showAlert('warning', 'Selecciona un rango de fechas');
      return;
    }

    try {
      setLoading(true);
      const response = await reportesAPI.ventas({ fechaInicio, fechaFin });
      setReporteVentas(response.data.data);
      
      if (response.data.data.totalVentas === 0) {
        showAlert('info', 'No hay ventas en el período seleccionado');
      }
    } catch (error) {
      showAlert('error', 'Error al generar reporte de ventas');
    } finally {
      setLoading(false);
    }
  };

  const generarReporteInventario = async () => {
    try {
      setLoading(true);
      const response = await reportesAPI.inventario();
      setReporteInventario(response.data.data);
    } catch (error) {
      showAlert('error', 'Error al generar reporte de inventario');
    } finally {
      setLoading(false);
    }
  };

  const normalizeItems = (items) => {
    if (!items || !items.item) return [];
    return Array.isArray(items.item) ? items.item : [items.item];
  };

  const ventasColumns = [
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
  ];

  const stockBajoColumns = [
    { header: 'Título', accessor: 'titulo' },
    { header: 'Autor', accessor: 'autor' },
    { header: 'Stock', cell: (row) => (
      <span className="text-red-600 font-semibold">{row.stock}</span>
    )},
    { 
      header: 'Precio', 
      cell: (row) => `$${parseFloat(row.precio).toFixed(2)}` 
    },
  ];

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('ventas')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'ventas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Reporte de Ventas
        </button>
        <button
          onClick={() => {
            setActiveTab('inventario');
            if (!reporteInventario) generarReporteInventario();
          }}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'inventario'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Reporte de Inventario
        </button>
      </div>

      {/* Reporte de Ventas */}
      {activeTab === 'ventas' && (
        <div>
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                label="Fecha Inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <Input
                label="Fecha Fin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
              <div className="flex items-end">
                <Button onClick={generarReporteVentas} disabled={loading} className="w-full">
                  {loading ? 'Generando...' : 'Generar Reporte'}
                </Button>
              </div>
            </div>
          </Card>

          {reporteVentas && (
            <>
              {/* Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <Card className="flex items-start">
                  <div className="bg-blue-50 p-3 rounded-lg mr-4">
                    <TrendingUp className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Ventas</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {reporteVentas.totalVentas}
                    </p>
                  </div>
                </Card>

                <Card className="flex items-start">
                  <div className="bg-green-50 p-3 rounded-lg mr-4">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ${reporteVentas.ingresosTotales.toFixed(2)}
                    </p>
                  </div>
                </Card>

                <Card className="flex items-start">
                  <div className="bg-purple-50 p-3 rounded-lg mr-4">
                    <Package className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Libro Más Vendido</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {reporteVentas.libroMasVendido
                        ? reporteVentas.libroMasVendido.titulo
                        : 'N/A'}
                    </p>
                    {reporteVentas.libroMasVendido && (
                      <p className="text-sm text-gray-500">
                        {reporteVentas.libroMasVendido.cantidadVendida} unidades
                      </p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Tabla de ventas */}
              <Card title="Detalle de Ventas">
                <Table columns={ventasColumns} data={reporteVentas.ventas} />
              </Card>
            </>
          )}
        </div>
      )}

      {/* Reporte de Inventario */}
      {activeTab === 'inventario' && (
        <div>
          {reporteInventario && (
            <>
              {/* Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="flex items-start">
                  <div className="bg-blue-50 p-3 rounded-lg mr-4">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Libros</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {reporteInventario.totalLibros}
                    </p>
                  </div>
                </Card>

                <Card className="flex items-start">
                  <div className="bg-yellow-50 p-3 rounded-lg mr-4">
                    <AlertTriangle className="text-yellow-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Libros con Stock Bajo</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {reporteInventario.librosStockBajo}
                    </p>
                  </div>
                </Card>

                <Card className="flex items-start">
                  <div className="bg-green-50 p-3 rounded-lg mr-4">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor Total Inventario</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ${reporteInventario.valorTotalInventario.toFixed(2)}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Libros con stock bajo */}
              {reporteInventario.librosConStockBajo.length > 0 && (
                <Card title="Libros con Stock Bajo (menos de 5 unidades)" className="mb-6">
                  <Table
                    columns={stockBajoColumns}
                    data={reporteInventario.librosConStockBajo}
                  />
                </Card>
              )}

              {/* Libros por categoría */}
              <Card title="Inventario por Categoría">
                <div className="space-y-4">
                  {reporteInventario.librosPorCategoria.map((cat) => (
                    <div key={cat.categoria} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-900">{cat.categoria}</h4>
                        <span className="text-sm text-gray-600">
                          {cat.cantidad} {cat.cantidad === 1 ? 'libro' : 'libros'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {cat.libros.map((libro) => (
                          <div key={libro.id} className="text-sm text-gray-700">
                            {libro.titulo} - Stock: {libro.stock}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {!reporteInventario && (
            <Card>
              <div className="text-center py-12">
                <Button onClick={generarReporteInventario} disabled={loading}>
                  {loading ? 'Generando...' : 'Generar Reporte de Inventario'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Reportes;
