import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, ShoppingCart } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";
import Alert from "../components/ui/Alert";
import { librosAPI, ventasAPI } from "../services/api";

const toSearchText = (v) => (v == null ? "" : String(v).toLowerCase().trim());

const Ventas = () => {
  const [libros, setLibros] = useState([]);
  const [filteredLibros, setFilteredLibros] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLibros();
  }, []);

  const loadLibros = async () => {
    try {
      const response = await librosAPI.getAll();
      const librosData = response.data.data;
      setLibros(librosData);
    } catch (error) {
      showAlert("error", "Error al cargar libros");
    }
  };

  // Aplicar filtro cuando cambien libros o el término de búsqueda
  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) {
      setFilteredLibros(libros);
      return;
    }
    const searchLower = term.toLowerCase();
    const filtered = libros.filter((l) => {
      const titulo = toSearchText(l.titulo);
      const autor = toSearchText(l.autor);
      const categoria = toSearchText(l.categoria);
      const isbn = toSearchText(l.isbn);
      const editorial = toSearchText(l.editorial);
      return (
        titulo.includes(searchLower) ||
        autor.includes(searchLower) ||
        categoria.includes(searchLower) ||
        isbn.includes(searchLower) ||
        editorial.includes(searchLower)
      );
    });
    setFilteredLibros(filtered);
  }, [libros, searchTerm]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const agregarAlCarrito = (libro, cantidad = 1) => {
    const cantidadNum = parseInt(cantidad);

    if (cantidadNum <= 0) {
      showAlert("warning", "La cantidad debe ser mayor a 0");
      return;
    }

    if (cantidadNum > parseInt(libro.stock)) {
      showAlert("warning", "Stock insuficiente");
      return;
    }

    const itemExistente = carrito.find((item) => item.libro.id === libro.id);

    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidadNum;
      if (nuevaCantidad > parseInt(libro.stock)) {
        showAlert("warning", "Stock insuficiente");
        return;
      }

      setCarrito(
        carrito.map((item) =>
          item.libro.id === libro.id
            ? { ...item, cantidad: nuevaCantidad }
            : item,
        ),
      );
    } else {
      setCarrito([...carrito, { libro, cantidad: cantidadNum }]);
    }

    showAlert("success", "Libro agregado al carrito");
  };

  const actualizarCantidad = (libroId, cantidad) => {
    const cantidadNum = parseInt(cantidad);
    const item = carrito.find((i) => i.libro.id === libroId);

    if (cantidadNum <= 0) {
      eliminarDelCarrito(libroId);
      return;
    }

    if (cantidadNum > parseInt(item.libro.stock)) {
      showAlert("warning", "Stock insuficiente");
      return;
    }

    setCarrito(
      carrito.map((item) =>
        item.libro.id === libroId ? { ...item, cantidad: cantidadNum } : item,
      ),
    );
  };

  const eliminarDelCarrito = (libroId) => {
    setCarrito(carrito.filter((item) => item.libro.id !== libroId));
  };

  const calcularTotal = () => {
    return carrito.reduce(
      (total, item) => total + parseFloat(item.libro.precio) * item.cantidad,
      0,
    );
  };

  const confirmarVenta = async () => {
    if (carrito.length === 0) {
      showAlert("warning", "El carrito está vacío");
      return;
    }

    try {
      setLoading(true);
      const items = carrito.map((item) => ({
        libroId: item.libro.id,
        cantidad: item.cantidad,
        titulo: item.libro.titulo,
        autor: item.libro.autor,
      }));

      const response = await ventasAPI.create({ items });
      const venta = response.data.data;

      showAlert(
        "success",
        `Venta realizada exitosamente. Total: $${parseFloat(venta.total).toFixed(2)}`,
      );
      setCarrito([]);
      loadLibros(); // Actualizar stock
    } catch (error) {
      showAlert(
        "error",
        error.response?.data?.error || "Error al registrar venta",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Libros disponibles */}
        <div className="lg:col-span-2">
          <Card title="Libros Disponibles">
            <div className="mb-6">
              <SearchBar
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar por título, autor, categoría, ISBN o editorial..."
              />
            </div>

            {filteredLibros.length === 0 && (
              <p className="text-center text-gray-500 py-6">
                {libros.length === 0
                  ? "Cargando libros..."
                  : "No hay libros que coincidan con la búsqueda."}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
              {filteredLibros.map((libro) => (
                <div
                  key={libro.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {libro.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{libro.autor}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-blue-600">
                      ${parseFloat(libro.precio).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {libro.stock}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={libro.stock}
                      defaultValue="1"
                      className="input flex-1"
                      id={`cantidad-${libro.id}`}
                      disabled={parseInt(libro.stock) === 0}
                    />
                    <Button
                      onClick={() => {
                        const cantidad = document.getElementById(
                          `cantidad-${libro.id}`,
                        ).value;
                        agregarAlCarrito(libro, cantidad);
                      }}
                      disabled={parseInt(libro.stock) === 0}
                      className="whitespace-nowrap"
                    >
                      <Plus size={18} className="mr-1" />
                      Agregar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Columna derecha - Carrito */}
        <div>
          <Card title="Carrito de Venta">
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
              {carrito.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart size={48} className="mx-auto mb-2 opacity-20" />
                  <p>El carrito está vacío</p>
                </div>
              ) : (
                carrito.map((item) => (
                  <div
                    key={item.libro.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {item.libro.titulo}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.libro.autor}
                        </p>
                      </div>
                      <button
                        onClick={() => eliminarDelCarrito(item.libro.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max={item.libro.stock}
                          value={item.cantidad}
                          onChange={(e) =>
                            actualizarCantidad(item.libro.id, e.target.value)
                          }
                          className="input w-16 py-1 text-sm"
                        />
                        <span className="text-sm text-gray-600">
                          × ${parseFloat(item.libro.precio).toFixed(2)}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        $
                        {(
                          parseFloat(item.libro.precio) * item.cantidad
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {carrito.length > 0 && (
              <>
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${calcularTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={confirmarVenta}
                  disabled={loading || carrito.length === 0}
                  className="w-full py-3 text-lg"
                >
                  {loading ? "Procesando..." : "Confirmar Venta"}
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Ventas;
