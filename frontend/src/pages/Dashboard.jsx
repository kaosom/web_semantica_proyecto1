import { useState, useEffect } from 'react';
import { Book, AlertTriangle, DollarSign, ShoppingCart } from 'lucide-react';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import { reportesAPI, ventasAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLibros: 0,
    librosStockBajo: 0,
    ventasMes: 0,
    ingresosMes: 0,
  });
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Obtener reporte de inventario
      const inventarioRes = await reportesAPI.inventario();
      const inventario = inventarioRes.data.data;
      
      // Obtener ventas del mes actual
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const fechaInicio = firstDay.toISOString().split('T')[0];
      const fechaFin = today.toISOString().split('T')[0];
      
      const ventasRes = await reportesAPI.ventas({ fechaInicio, fechaFin });
      const ventasMes = ventasRes.data.data;
      
      // Obtener últimas ventas
      const todasVentasRes = await ventasAPI.getAll();
      const todasVentas = todasVentasRes.data.data;
      
      setStats({
        totalLibros: inventario.totalLibros,
        librosStockBajo: inventario.librosStockBajo,
        ventasMes: ventasMes.totalVentas,
        ingresosMes: ventasMes.ingresosTotales,
      });
      
      setVentasRecientes(todasVentas.slice(0, 5));
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Libros',
      value: stats.totalLibros,
      icon: Book,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Stock Bajo',
      value: stats.librosStockBajo,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Ventas del Mes',
      value: stats.ventasMes,
      icon: ShoppingCart,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Ingresos del Mes',
      value: `$${stats.ingresosMes.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

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
      cell: (row) => `$${parseFloat(row.total).toFixed(2)}` 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="flex items-start">
              <div className={`${stat.bg} p-3 rounded-lg mr-4`}>
                <Icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Ventas Recientes */}
      <Card title="Ventas Recientes">
        <Table columns={ventasColumns} data={ventasRecientes} />
      </Card>
    </div>
  );
};

export default Dashboard;
