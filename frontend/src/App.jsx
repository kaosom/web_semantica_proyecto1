import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Libros from './pages/Libros';
import Ventas from './pages/Ventas';
import HistorialVentas from './pages/HistorialVentas';
import Reportes from './pages/Reportes';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout title="Dashboard" />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/libros" element={<Layout title="Gestión de Libros" />}>
            <Route index element={<Libros />} />
          </Route>
          <Route path="/ventas" element={<Layout title="Punto de Venta" />}>
            <Route index element={<Ventas />} />
          </Route>
          <Route path="/historial" element={<Layout title="Historial de Ventas" />}>
            <Route index element={<HistorialVentas />} />
          </Route>
          <Route path="/reportes" element={<Layout title="Reportes" />}>
            <Route index element={<Reportes />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
