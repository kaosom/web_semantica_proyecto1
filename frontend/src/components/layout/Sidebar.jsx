import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Book, ShoppingCart, History, BarChart3 } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/libros', label: 'Libros', icon: Book },
    { path: '/ventas', label: 'Punto de Venta', icon: ShoppingCart },
    { path: '/historial', label: 'Historial', icon: History },
    { path: '/reportes', label: 'Reportes', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Sistema de Libros</h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`
              }
            >
              <Icon size={20} className="mr-3" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
