import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Trash2, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import Aurora from '../../components/ReactBits/Aurora';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

export default function Administradores() {
  const [admins, setAdmins] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    nombre: '', email: '', password: '', cargo: '', nivel: 'ADMIN'
  });

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = () => {
    api.get('/administradores').then(res => setAdmins(res.data));
  };

  const crearAdmin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/administradores', form);
      toast.success('Administrador creado');
      setModal(false);
      setForm({ nombre: '', email: '', password: '', cargo: '', nivel: 'ADMIN' });
      cargarDatos();
    } catch {
      toast.error('Error al crear administrador');
    }
  };

  const toggleActivo = async (id) => {
    try {
      await api.patch(`/administradores/${id}/toggle-activo`);
      toast.success('Estado actualizado');
      cargarDatos();
    } catch {
      toast.error('Error al actualizar');
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <Aurora colorStops={["#000000", "#1a1a2e", "#16213e"]} speed={0.5} amplitude={0.8} />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <AdminSidebar />

        <div className="flex-1 p-10">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-bold text-white">Administradores</h1>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <Plus size={16} /> Nuevo administrador
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {admins.map((admin, i) => (
              <motion.div
                key={admin.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                    {admin.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{admin.nombre}</p>
                    <p className="text-white/40 text-xs">{admin.email}</p>
                    <p className="text-white/30 text-xs">{admin.cargo} — {admin.nivel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-3 py-1 rounded-full border ${admin.activo ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                    {admin.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <button onClick={() => toggleActivo(admin.id)}>
                    {admin.activo
                      ? <ToggleRight size={24} className="text-green-400" />
                      : <ToggleLeft size={24} className="text-white/40" />
                    }
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#1a1a2e] rounded-3xl p-8 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Nuevo administrador</h2>
              <form onSubmit={crearAdmin} className="flex flex-col gap-4">
                {[
                  { label: 'Nombre', key: 'nombre', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Contraseña', key: 'password', type: 'password' },
                  { label: 'Cargo', key: 'cargo', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-white/40 mb-1 block">{f.label}</label>
                    <input
                      type={f.type}
                      required
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Nivel</label>
                  <select
                    value={form.nivel}
                    onChange={e => setForm({ ...form, nivel: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="submit" className="flex-1 bg-white text-black py-3 rounded-xl text-sm font-medium">
                    Crear
                  </button>
                  <button type="button" onClick={() => setModal(false)} className="px-6 py-3 rounded-xl border border-white/10 text-sm text-white/60">
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}