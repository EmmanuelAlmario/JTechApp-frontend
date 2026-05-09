import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const [direccion, setDireccion] = useState('');
  const [metodoPagoId, setMetodoPagoId] = useState('');
  const [metodosPago, setMetodosPago] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  useEffect(() => {
    api.get('/metodos-pago').then(res => setMetodosPago(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Debes iniciar sesión');
      navigate('/login');
      return;
    }
    if (carrito.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }
    setLoading(true);
    try {
      await api.post('/ordenes', {
        direccion,
        metodoPagoId: Number(metodoPagoId),
        detallesOrden: carrito.map(item => ({
          varianteProductoId: item.varianteId,
          cantidad: item.cantidad
        }))
      });
      localStorage.removeItem('carrito');
      toast.success('Orden creada exitosamente');
      navigate('/mis-ordenes');
    } catch {
      toast.error('Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-8 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-black mb-12">Checkout</h1>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-black mb-4">Resumen</h2>
          {carrito.map(item => (
            <div key={item.varianteId} className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{item.nombre} — {item.variante} x{item.cantidad}</span>
              <span>${(item.precio * item.cantidad).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-black">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Dirección de entrega</label>
            <input
              type="text"
              required
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              placeholder="Calle 123, Ciudad"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors bg-white"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Método de pago</label>
            <div className="flex flex-col gap-2">
              {metodosPago.map(metodo => (
                <button
                  key={metodo.id}
                  type="button"
                  onClick={() => setMetodoPagoId(metodo.id)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${metodoPagoId === metodo.id ? 'border-black bg-black text-white' : 'border-gray-200 text-black hover:border-black'}`}
                >
                  {metodo.tipo}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !metodoPagoId}
            className="w-full bg-black text-white py-4 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Confirmar orden'}
          </button>
        </form>
      </div>
    </div>
  );
}