import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Catalogo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [filtros, setFiltros] = useState({ categoriaId: null, marcaId: null });
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    api.get('/categorias').then(res => setCategorias(res.data));
    api.get('/marcas').then(res => setMarcas(res.data));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filtros.categoriaId) params.append('categoriaId', filtros.categoriaId);
    if (filtros.marcaId) params.append('marcaId', filtros.marcaId);
    const url = params.toString() ? `/productos/filtrar?${params}` : '/productos';
    api.get(url).then(res => setProductos(res.data));
  }, [filtros]);

  useEffect(() => {
    if (busqueda.trim() === '') {
      api.get('/productos').then(res => setProductos(res.data));
      return;
    }
    const timeout = setTimeout(() => {
      api.get(`/productos/buscar?nombre=${busqueda}`).then(res => setProductos(res.data));
    }, 400);
    return () => clearTimeout(timeout);
  }, [busqueda]);

  const agregarAlCarrito = () => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar al carrito');
      navigate('/login');
      return;
    }

    if (user.rol !== 'CLIENTE') {
      toast.error('Solo los clientes pueden agregar productos al carrito');
      return;
    }

    if (!varianteSeleccionada) {
      toast.error('Selecciona una variante');
      return;
    }
  
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const existe = carrito.find(i => i.varianteId === varianteSeleccionada.id);
    const cantidadActual = existe ? existe.cantidad : 0;
  
    if (cantidadActual >= varianteSeleccionada.stock) {
      toast.error(`Stock insuficiente — solo hay ${varianteSeleccionada.stock} unidades`);
      return;
    }
  
    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({
        varianteId: varianteSeleccionada.id,
        nombre: productoSeleccionado.nombre,
        variante: varianteSeleccionada.nombre,
        precio: varianteSeleccionada.precio,
        cantidad: 1,
        stock: varianteSeleccionada.stock,
        imagen: productoSeleccionado.imagenes?.[0]?.url
      });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    toast.success('Agregado al carrito');
    setProductoSeleccionado(null);
    setVarianteSeleccionada(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex pt-16">

        <div className="w-64 min-h-screen border-r border-gray-100 p-6 sticky top-16 self-start">
          <h2 className="text-lg font-bold text-black mb-6">Filtros</h2>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-black placeholder-gray-400 mb-6 focus:outline-none focus:border-black transition-colors bg-white"
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categorías</h3>
            <button
              onClick={() => setFiltros({ ...filtros, categoriaId: null })}
              className={`block w-full text-left text-sm py-2 px-3 rounded-lg mb-1 transition-colors ${!filtros.categoriaId ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              Todas
            </button>
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFiltros({ ...filtros, categoriaId: cat.id })}
                className={`block w-full text-left text-sm py-2 px-3 rounded-lg mb-1 transition-colors ${filtros.categoriaId === cat.id ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Marcas</h3>
            <button
              onClick={() => setFiltros({ ...filtros, marcaId: null })}
              className={`block w-full text-left text-sm py-2 px-3 rounded-lg mb-1 transition-colors ${!filtros.marcaId ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              Todas
            </button>
            {marcas.map(marca => (
              <button
                key={marca.id}
                onClick={() => setFiltros({ ...filtros, marcaId: marca.id })}
                className={`block w-full text-left text-sm py-2 px-3 rounded-lg mb-1 transition-colors ${filtros.marcaId === marca.id ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                {marca.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-8">
          <div className="grid grid-cols-3 gap-6">
            {productos.map((producto, i) => (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard
                  producto={producto}
                  onClick={() => { setProductoSeleccionado(producto); setVarianteSeleccionada(null); }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {productoSeleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setProductoSeleccionado(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full flex gap-8"
            >
              <div className="w-1/2">
                {productoSeleccionado.imagenes?.[0] && (
                  <img
                    src={productoSeleccionado.imagenes[0].url}
                    alt={productoSeleccionado.nombre}
                    className="w-full h-64 object-contain"
                  />
                )}
              </div>
              <div className="w-1/2 flex flex-col">
                <h2 className="text-2xl font-bold text-black mb-2">{productoSeleccionado.nombre}</h2>
                <p className="text-gray-400 text-sm mb-6">{productoSeleccionado.descripcion}</p>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Variantes</h3>
                <div className="flex flex-col gap-2 mb-6">
                  {productoSeleccionado.variantes?.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setVarianteSeleccionada(v)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${varianteSeleccionada?.id === v.id ? 'border-black bg-black text-white' : 'border-gray-200 text-black hover:border-black'}`}
                    >
                      <span className="font-medium">{v.nombre}</span>
                      <span className="float-right">${v.precio?.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-auto flex gap-3">
                  <button
                    onClick={agregarAlCarrito}
                    className="flex-1 bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Agregar al carrito
                  </button>
                  <button
                    onClick={() => setProductoSeleccionado(null)}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-black hover:border-black transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}