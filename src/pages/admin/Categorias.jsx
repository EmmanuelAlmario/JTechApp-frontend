import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';
import Aurora from '../../components/ReactBits/Aurora';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api/axios';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalSub, setModalSub] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [formSub, setFormSub] = useState({ nombre: '' });

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = () => {
    api.get('/categorias').then(res => setCategorias(res.data));
  };

  const crearCategoria = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categorias', form);
      toast.success('Categoría creada');
      setModal(false);
      setForm({ nombre: '', descripcion: '' });
      cargarDatos();
    } catch {
      toast.error('Error al crear categoría');
    }
  };

  const crearSubcategoria = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/categorias/${categoriaSeleccionada.id}/subcategorias`, formSub);
      toast.success('Subcategoría creada');
      setModalSub(false);
      setFormSub({ nombre: '' });
      cargarDatos();
    } catch {
      toast.error('Error al crear subcategoría');
    }
  };

  const eliminarCategoria = async (id) => {
    try {
      await api.delete(`/categorias/${id}`);
      toast.success('Categoría eliminada');
      cargarDatos();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const eliminarSubcategoria = async (id) => {
    try {
      await api.delete(`/subcategorias/${id}`);
      toast.success('Subcategoría eliminada');
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
            <h1 className="text-4xl font-bold text-white">Categorías</h1>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <Plus size={16} /> Nueva categoría
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {categorias.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white">{cat.nombre}</h3>
                    <p className="text-white/40 text-xs">{cat.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setCategoriaSeleccionada(cat); setModalSub(true); }}
                      className="text-xs text-white/60 hover:text-white border border-white/10 px-3 py-1 rounded-full transition-colors"
                    >
                      + Subcategoría
                    </button>
                    <button onClick={() => eliminarCategoria(cat.id)}>
                      <Trash2 size={16} className="text-white/40 hover:text-red-400 transition-colors" />
                    </button>
                  </div>
                </div>

                {cat.subcategorias?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {cat.subcategorias.map(sub => (
                      <div key={sub.id} className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                        <span className="text-xs text-white/60">{sub.nombre}</span>
                        <button onClick={() => eliminarSubcategoria(sub.id)}>
                          <Trash2 size={10} className="text-white/30 hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal categoria */}
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
              <h2 className="text-2xl font-bold text-white mb-6">Nueva categoría</h2>
              <form onSubmit={crearCategoria} className="flex flex-col gap-4">
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
                  <label className="text-xs text-white/40 mb-1 block">Descripción</label>
                  <input
                    value={form.descripcion}
                    onChange={e => setForm({ ...form, descripcion: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                  />
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

      {/* Modal subcategoria */}
      <AnimatePresence>
        {modalSub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalSub(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#1a1a2e] rounded-3xl p-8 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Nueva subcategoría</h2>
              <p className="text-white/40 text-sm mb-6">en {categoriaSeleccionada?.nombre}</p>
              <form onSubmit={crearSubcategoria} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Nombre</label>
                  <input
                    required
                    value={formSub.nombre}
                    onChange={e => setFormSub({ nombre: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="submit" className="flex-1 bg-white text-black py-3 rounded-xl text-sm font-medium">
                    Crear
                  </button>
                  <button type="button" onClick={() => setModalSub(false)} className="px-6 py-3 rounded-xl border border-white/10 text-sm text-white/60">
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