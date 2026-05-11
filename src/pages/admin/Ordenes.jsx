import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Aurora from '../../components/ReactBits/Aurora';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

const estadoColores = {
  PENDIENTE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  PROCESANDO: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ENVIADO: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ENTREGADO: 'bg-green-500/20 text-green-400 border-green-500/30',
  CANCELADO: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const estadoBotones = {
  PENDIENTE: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20',
  PROCESANDO: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20',
  ENVIADO: 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20',
  ENTREGADO: 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20',
  CANCELADO: 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
};

const estados = ['PENDIENTE', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = () => {
    api.get('/ordenes').then(res => setOrdenes(res.data));
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.put(`/ordenes/${id}/estado?estado=${estado}`);
      toast.success('Estado actualizado');
      cargarDatos();
    } catch {
      toast.error('Error al actualizar estado');
    }
  };

  const ordenesFiltradas = filtro
    ? ordenes.filter(o => o.estado === filtro)
    : ordenes;

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <Aurora colorStops={["#000000", "#7A87FF", "#7D80AD"]} speed={0.5} amplitude={0.8} />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <AdminSidebar />

        <div className="flex-1 p-10">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-bold text-white">Órdenes</h1>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFiltro('')}
                className={`text-xs px-4 py-2 rounded-full border transition-colors ${!filtro ? 'bg-white text-black border-white' : 'border-white/10 text-white/60 hover:text-white'}`}
              >
                Todas
              </button>
              {estados.map(e => (
                <button
                  key={e}
                  onClick={() => setFiltro(e)}
                  className={`text-xs px-4 py-2 rounded-full border transition-colors ${filtro === e ? 'bg-white text-black border-white' : 'border-white/10 text-white/60 hover:text-white'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {ordenesFiltradas.map((orden, i) => (
              <motion.div
                key={orden.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white font-semibold">Orden #{orden.id}</p>
                    <p className="text-white/40 text-xs">
                      {new Date(orden.fecha).toLocaleDateString('es-CO', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                    <p className="text-white/40 text-xs mt-1">{orden.direccion}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${estadoColores[orden.estado]}`}>
                      {orden.estado}
                    </span>
                    <p className="text-white font-bold">${orden.total?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-white/30 text-xs mb-3">Cambiar estado:</p>
                  <div className="flex gap-2 flex-wrap">
                    {estados.filter(e => e !== orden.estado).map(e => (
                      <button
                        key={e}
                        onClick={() => cambiarEstado(orden.id, e)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${estadoBotones[e]}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}