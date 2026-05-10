import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Aurora from '../../components/ReactBits/Aurora';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';
import CountUp from '../../components/ReactBits/CountUp';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/productos/admin'),
      api.get('/usuarios')
    ]).then(([statsRes, productosRes, usuariosRes]) => {
      setStats(statsRes.data);
      setProductos(productosRes.data);
      setUsuarios(usuariosRes.data);
      setLoaded(true);
    }).catch(() => setLoaded(true));

    const interval = setInterval(() => {
      api.get('/dashboard/stats').then(res => setStats(res.data));
      api.get('/productos/admin').then(res => setProductos(res.data));
      api.get('/usuarios').then(res => setUsuarios(res.data));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!loaded) return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <Aurora colorStops={["#000000", "#1a1a2e", "#16213e"]} speed={0.5} amplitude={0.8} />
      </div>
      <div className="relative z-10 flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/40 text-sm">Cargando...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <Aurora colorStops={["#000000", "#1a1a2e", "#16213e"]} speed={0.5} amplitude={0.8} />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <AdminSidebar />

        <div className="flex-1 p-10 overflow-y-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Dashboard
          </motion.h1>
          <p className="text-white/40 text-sm mb-10">Bienvenido, {user?.nombre}</p>

          <div className="grid grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total órdenes', value: stats.totalOrdenes },
              { label: 'Productos', value: stats.totalProductos },
              { label: 'Clientes', value: stats.totalClientes },
              { label: 'Órdenes pendientes', value: stats.ordenesPendientes },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              >
                <p className="text-white/40 text-xs mb-2">{stat.label}</p>
                <CountUp
                  from={0}
                  to={Number(stat.value) || 0}
                  duration={1.5}
                  className="text-3xl font-bold text-white"
                />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-white font-semibold">Productos</h2>
                <button
                  onClick={() => navigate('/admin/productos')}
                  className="text-xs text-white/40 hover:text-white transition-colors"
                >
                  Ver todos →
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs text-white/40 px-6 py-3">Nombre</th>
                    <th className="text-left text-xs text-white/40 px-6 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.slice(0, 5).map(p => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-3 text-sm text-white">{p.nombre}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${p.activo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {p.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <h2 className="text-white font-semibold">Usuarios</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs text-white/40 px-6 py-3">Nombre</th>
                    <th className="text-left text-xs text-white/40 px-6 py-3">Rol</th>
                    <th className="text-left text-xs text-white/40 px-6 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.slice(0, 5).map(u => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-3 text-sm text-white">{u.nombre}</td>
                      <td className="px-6 py-3 text-xs text-white/40">{u.rol}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${u.activo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}