import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';
import Aurora from '../../components/ReactBits/Aurora';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

export default function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', logo: '' });

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = () => {
    api.get('/marcas').then(res => setMarcas(res.data));
  };

  const crearMarca = async (e) => {
    e.preventDefault();
    try {
      await api.post('/marcas', form);
      toast.success('Marca creada');
      setModal(false);
      setForm({ nombre: '', logo: '' });
      cargarDatos();
    } catch {
      toast.error('Error al crear marca');
    }
  };

  const eliminar = async (id) => {
    try {
      await api.delete(`/marcas/${id}`);
      toast.success('Marca eliminada');
      cargarDatos();
    } catch {
      toast.error('Error al eliminar');
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
            <h1 className="text-4xl font-bold text-white">Marcas</h1>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <Plus size={16} /> Nueva marca
            </button>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {marcas.map((marca, i) => (
              <motion.div
                key={marca.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col items-center"
              >
                {marca.logo && (
                  <img src={marca.logo} alt={marca.nombre} className="w-16 h-16 object-contain mb-4" />
                )}
                <h3 className="font-semibold text-white text-center mb-4">{marca.nombre}</h3>
                <button onClick={() => eliminar(marca.id)}>
                  <Trash2 size={16} className="text-white/40 hover:text-red-400 transition-colors" />
                </button>
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
              <h2 className="text-2xl font-bold text-white mb-6">Nueva marca</h2>
              <form onSubmit={crearMarca} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Nombre</label>
                  <input
                    required
                    value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">URL del logo</label>
                  <input
                    value={form.logo}
                    onChange={e => setForm({ ...form, logo: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                {form.logo && (
                  <img src={form.logo} alt="preview" className="w-16 h-16 object-contain mx-auto" />
                )}
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