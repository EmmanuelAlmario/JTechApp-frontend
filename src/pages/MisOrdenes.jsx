import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const estadoColores = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  PROCESANDO: 'bg-blue-100 text-blue-700',
  ENVIADO: 'bg-purple-100 text-purple-700',
  ENTREGADO: 'bg-green-100 text-green-700',
  CANCELADO: 'bg-red-100 text-red-700'
};

export default function MisOrdenes() {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    api.get('/mis-ordenes').then(res => setOrdenes(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-8 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-black mb-12">Mis órdenes</h1>

        {ordenes.length === 0 ? (
          <p className="text-gray-400 text-center py-24">No tienes órdenes aún</p>
        ) : (
          <div className="flex flex-col gap-4">
            {ordenes.map((orden, i) => (
              <motion.div
                key={orden.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Orden #{orden.id}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(orden.fecha).toLocaleDateString('es-CO', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${estadoColores[orden.estado]}`}>
                    {orden.estado}
                  </span>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {orden.detallesOrden?.map(detalle => (
                    <div key={detalle.id} className="flex justify-between text-sm text-gray-600">
                      <span>Variante #{detalle.varianteProductoId} x{detalle.cantidad}</span>
                      <span>${detalle.precioUnitario?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-sm text-gray-400">Total</span>
                  <span className="font-bold text-black">${orden.total?.toLocaleString()}</span>
                </div>

                <p className="text-xs text-gray-400 mt-2">{orden.direccion}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}