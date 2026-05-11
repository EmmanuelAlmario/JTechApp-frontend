import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Trash2, Plus, ToggleLeft, ToggleRight, Pencil } from 'lucide-react';
import Aurora from '../../components/ReactBits/Aurora';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEditarVariante, setModalEditarVariante] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [varianteEditando, setVarianteEditando] = useState(null);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', categoriaId: '', subcategoriaId: '', marcaId: '',
    activo: true, variantes: [], imagenes: []
  });
  const [formEditar, setFormEditar] = useState({ nombre: '', descripcion: '' });
  const [formVariante, setFormVariante] = useState({ nombre: '', precio: '', stock: '', sku: '' });
  const [variante, setVariante] = useState({ nombre: '', precio: '', stock: '', sku: '' });
  const [imagen, setImagen] = useState({ url: '', esPrincipal: false });
  const { user } = useAuth();

  useEffect(() => {
    cargarDatos();
    api.get('/categorias').then(res => setCategorias(res.data));
    api.get('/marcas').then(res => setMarcas(res.data));
  }, []);

  useEffect(() => {
    if (form.categoriaId) {
      api.get(`/categorias/${form.categoriaId}/subcategorias`).then(res => setSubcategorias(res.data));
    }
  }, [form.categoriaId]);

  const cargarDatos = () => {
    api.get('/productos/admin').then(res => setProductos(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/productos', {
        ...form,
        categoriaId: Number(form.categoriaId),
        subcategoriaId: Number(form.subcategoriaId),
        marcaId: Number(form.marcaId),
      });
      toast.success('Producto creado');
      setModal(false);
      setForm({ nombre: '', descripcion: '', categoriaId: '', subcategoriaId: '', marcaId: '', activo: true, variantes: [], imagenes: [] });
      cargarDatos();
    } catch {
      toast.error('Error al crear producto');
    }
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/productos/${productoEditando.id}`, formEditar);
      toast.success('Producto actualizado');
      const res = await api.get(`/productos/${productoEditando.id}`);
      setProductoEditando(res.data);
      cargarDatos();
    } catch {
      toast.error('Error al actualizar producto');
    }
  };

  const abrirEditar = (producto) => {
    setProductoEditando(producto);
    setFormEditar({ nombre: producto.nombre, descripcion: producto.descripcion });
    setModalEditar(true);
  };

  const abrirEditarVariante = (v) => {
    setVarianteEditando(v);
    setFormVariante({ nombre: v.nombre, precio: v.precio, stock: v.stock, sku: v.sku });
    setModalEditarVariante(true);
  };

  const handleEditarVariante = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/productos/variantes/${varianteEditando.id}`, {
        nombre: formVariante.nombre,
        precio: Number(formVariante.precio),
        stock: Number(formVariante.stock),
        sku: formVariante.sku
      });
      toast.success('Variante actualizada');
      setModalEditarVariante(false);
      const res = await api.get(`/productos/${productoEditando.id}`);
      setProductoEditando(res.data);
      cargarDatos();
    } catch {
      toast.error('Error al actualizar variante');
    }
  };

  const eliminarVariante = async (varianteId) => {
    try {
      await api.delete(`/productos/variantes/${varianteId}`);
      toast.success('Variante eliminada');
      const res = await api.get(`/productos/${productoEditando.id}`);
      setProductoEditando(res.data);
      cargarDatos();
    } catch {
      toast.error('Error al eliminar variante');
    }
  };

  const toggleActivo = async (id) => {
    try {
      await api.patch(`/productos/${id}/toggle-activo`);
      cargarDatos();
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  const eliminar = async (id) => {
    try {
      await api.delete(`/productos/${id}`);
      toast.success('Producto eliminado');
      cargarDatos();
    } catch {
      toast.error('Error al eliminar producto');
    }
  };

  const agregarVariante = () => {
    if (!variante.nombre || !variante.precio) return;
    setForm({ ...form, variantes: [...form.variantes, { ...variante, precio: Number(variante.precio), stock: Number(variante.stock) }] });
    setVariante({ nombre: '', precio: '', stock: '', sku: '' });
  };

  const agregarImagen = () => {
    if (!imagen.url) return;
    setForm({ ...form, imagenes: [...form.imagenes, imagen] });
    setImagen({ url: '', esPrincipal: false });
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <Aurora colorStops={["#000000", "#7A87FF", "#7D80AD"]} speed={0.5} amplitude={0.8} />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <AdminSidebar />

        <div className="flex-1 p-10">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-bold text-white">Productos</h1>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <Plus size={16} /> Nuevo producto
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {productos.map((producto, i) => (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              >
                {producto.imagenes?.[0] && (
                  <img src={producto.imagenes[0].url} alt={producto.nombre} className="w-full h-32 object-contain mb-4" />
                )}
                <h3 className="font-semibold text-white mb-1">{producto.nombre}</h3>
                <p className="text-white/40 text-xs mb-4 line-clamp-2">{producto.descripcion}</p>
                <div className="flex items-center justify-between">
                  <button onClick={() => toggleActivo(producto.id)}>
                    {producto.activo
                      ? <ToggleRight size={24} className="text-green-400" />
                      : <ToggleLeft size={24} className="text-white/40" />
                    }
                  </button>
                  <div className="flex gap-3">
                    <button onClick={() => abrirEditar(producto)}>
                      <Pencil size={16} className="text-white/40 hover:text-white transition-colors" />
                    </button>
                    <button onClick={() => eliminar(producto.id)}>
                      <Trash2 size={16} className="text-white/40 hover:text-red-400 transition-colors" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal crear */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#1a1a2e] rounded-3xl p-8 w-full max-w-2xl my-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Nuevo producto</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {[
                  { label: 'Nombre', key: 'nombre', type: 'text' },
                  { label: 'Descripción', key: 'descripcion', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-white/40 mb-1 block">{f.label}</label>
                    <input
                      type={f.type}
                      required
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-xs text-white/40 mb-1 block">Categoría</label>
                  <select
                    style={{ backgroundColor: '#1a1a2e', color: 'white' }}
                    required
                    value={form.categoriaId}
                    onChange={e => setForm({ ...form, categoriaId: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  >
                    <option value="">Seleccionar</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/40 mb-1 block">Subcategoría</label>
                  <select
                    style={{ backgroundColor: '#1a1a2e', color: 'white' }}
                    value={form.subcategoriaId}
                    onChange={e => setForm({ ...form, subcategoriaId: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  >
                    <option value="">Seleccionar</option>
                    {subcategorias.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/40 mb-1 block">Marca</label>
                  <select
                    style={{ backgroundColor: '#1a1a2e', color: 'white' }}
                    value={form.marcaId}
                    onChange={e => setForm({ ...form, marcaId: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  >
                    <option value="">Seleccionar</option>
                    {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                  </select>
                </div>

                <div className="border border-white/10 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-white mb-3">Variantes</h3>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {[
                      { placeholder: 'Nombre', key: 'nombre' },
                      { placeholder: 'Precio', key: 'precio' },
                      { placeholder: 'Stock', key: 'stock' },
                      { placeholder: 'SKU', key: 'sku' },
                    ].map(f => (
                      <input
                        key={f.key}
                        placeholder={f.placeholder}
                        value={variante[f.key]}
                        onChange={e => setVariante({ ...variante, [f.key]: e.target.value })}
                        className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none placeholder-white/30"
                      />
                    ))}
                  </div>
                  <button type="button" onClick={agregarVariante} className="text-xs text-white/60 hover:text-white transition-colors">
                    + Agregar variante
                  </button>
                  {form.variantes.map((v, i) => (
                    <div key={i} className="text-xs text-white/40 mt-1">{v.nombre} — ${v.precio} — Stock: {v.stock}</div>
                  ))}
                </div>

                <div className="border border-white/10 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-white mb-3">Imágenes</h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      placeholder="URL de imagen"
                      value={imagen.url}
                      onChange={e => setImagen({ ...imagen, url: e.target.value })}
                      className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none placeholder-white/30"
                    />
                    <label className="flex items-center gap-2 text-xs text-white/60">
                      <input
                        type="checkbox"
                        checked={imagen.esPrincipal}
                        onChange={e => setImagen({ ...imagen, esPrincipal: e.target.checked })}
                      />
                      Principal
                    </label>
                  </div>
                  <button type="button" onClick={agregarImagen} className="text-xs text-white/60 hover:text-white transition-colors">
                    + Agregar imagen
                  </button>
                  {form.imagenes.map((img, i) => (
                    <div key={i} className="text-xs text-white/40 mt-1">{img.url} {img.esPrincipal && '★'}</div>
                  ))}
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="submit" className="flex-1 bg-white text-black py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
                    Crear producto
                  </button>
                  <button type="button" onClick={() => setModal(false)} className="px-6 py-3 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal editar producto */}
      <AnimatePresence>
        {modalEditar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setModalEditar(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#1a1a2e] rounded-3xl p-8 w-full max-w-lg my-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Editar producto</h2>
              <p className="text-white/40 text-sm mb-6">{productoEditando?.nombre}</p>

              <form onSubmit={handleEditar} className="flex flex-col gap-4 mb-8">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Nombre</label>
                  <input
                    required
                    value={formEditar.nombre}
                    onChange={e => setFormEditar({ ...formEditar, nombre: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Descripción</label>
                  <input
                    value={formEditar.descripcion}
                    onChange={e => setFormEditar({ ...formEditar, descripcion: e.target.value })}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-white text-black py-3 rounded-xl text-sm font-medium">
                    Guardar cambios
                  </button>
                  <button type="button" onClick={() => setModalEditar(false)} className="px-6 py-3 rounded-xl border border-white/10 text-sm text-white/60">
                    Cancelar
                  </button>
                </div>
              </form>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-sm font-semibold text-white mb-4">Variantes</h3>
                <div className="flex flex-col gap-3">
                  {productoEditando?.variantes?.map(v => (
                    <div key={v.id} className="bg-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white font-medium">{v.nombre}</p>
                        <p className="text-xs text-white/40">${v.precio?.toLocaleString()} — Stock: {v.stock}</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => abrirEditarVariante(v)} className="text-white/40 hover:text-white transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => eliminarVariante(v.id)} className="text-white/40 hover:text-red-400 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal editar variante */}
      <AnimatePresence>
        {modalEditarVariante && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalEditarVariante(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#1a1a2e] rounded-3xl p-8 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Editar variante</h2>
              <form onSubmit={handleEditarVariante} className="flex flex-col gap-4">
                {[
                  { label: 'Nombre', key: 'nombre' },
                  { label: 'Precio', key: 'precio' },
                  { label: 'Stock', key: 'stock' },
                  { label: 'SKU', key: 'sku' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-white/40 mb-1 block">{f.label}</label>
                    <input
                      required
                      value={formVariante[f.key]}
                      onChange={e => setFormVariante({ ...formVariante, [f.key]: e.target.value })}
                      className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                ))}
                <div className="flex gap-3 mt-2">
                  <button type="submit" className="flex-1 bg-white text-black py-3 rounded-xl text-sm font-medium">
                    Guardar
                  </button>
                  <button type="button" onClick={() => setModalEditarVariante(false)} className="px-6 py-3 rounded-xl border border-white/10 text-sm text-white/60">
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