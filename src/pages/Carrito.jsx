import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCarrito(JSON.parse(localStorage.getItem('carrito') || '[]'));
  }, []);

  const actualizar = (varianteId, cantidad) => {
    const nuevo = carrito.map(item =>
      item.varianteId === varianteId ? { ...item, cantidad } : item
    ).filter(item => item.cantidad > 0);
    setCarrito(nuevo);
    localStorage.setItem('carrito', JSON.stringify(nuevo));
  };

  const eliminar = (varianteId) => {
    const nuevo = carrito.filter(item => item.varianteId !== varianteId);
    setCarrito(nuevo);
    localStorage.setItem('carrito', JSON.stringify(nuevo));
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-8 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-black mb-12">Carrito</h1>

        {carrito.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg mb-6">Tu carrito está vacío</p>
            <button
              onClick={() => navigate('/catalogo')}
              className="bg-black text-white px-8 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              Ver catálogo
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-12">
              {carrito.map((item, i) => (
                <motion.div
                  key={item.varianteId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-6 p-6 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-xl"

                >
                  {item.imagen && (
                    <img src={item.imagen} alt={item.nombre} className="w-20 h-20 object-contain" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-black">{item.nombre}</h3>
                    <p className="text-gray-400 text-sm">{item.variante}</p>
                    <p className="text-black font-medium mt-1">${item.precio?.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => actualizar(item.varianteId, item.cantidad - 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-black transition-colors bg-red-500"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.cantidad}</span>
                    <button
                      onClick={() => actualizar(item.varianteId, item.cantidad + 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-black transition-colors bg-green-400"
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => eliminar(item.varianteId)}>
                    <Trash2 size={18} className="text-gray-400 hover:text-black transition-colors" />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-8 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-3xl font-bold text-black">${total.toLocaleString()}</p>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-black text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Proceder al pago
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}