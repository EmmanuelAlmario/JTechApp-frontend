import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Silk from '../components/ReactBits/Silk'
import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Home() {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])

  useEffect(() => {
    api.get('/productos').then(res => setProductos(res.data.slice(0, 3)))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero con Silk */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Silk color="#e8e8e8" speed={3} scale={1.5} noiseIntensity={1.2} />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl font-bold tracking-tight text-black mb-6"
          >
            JTECH
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 mb-10 max-w-xl mx-auto"
          >
            Tecnología que transforma tu mundo. Encuentra los mejores productos tech en un solo lugar.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => navigate('/catalogo')}
            className="bg-black text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Ver Catálogo
          </motion.button>
        </div>
      </div>

      {/* Productos destacados */}
      <div className="px-8 py-24 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold text-black mb-16 text-center"
        >
          Destacados
        </motion.h2>
        <div className="grid grid-cols-3 gap-8">
          {productos.map((producto, i) => (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 rounded-3xl p-8 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {producto.imagenes?.[0] && (
                <img
                  src={producto.imagenes[0].url}
                  alt={producto.nombre}
                  className="w-full h-48 object-contain mb-6"
                />
              )}
              <h3 className="text-lg font-semibold text-black mb-2">{producto.nombre}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>
              <p className="text-black font-medium">
                Desde ${producto.variantes?.[0]?.precio?.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-black">JTECH</span>
          <p className="text-gray-400 text-sm">© 2026 JTech. Todos los derechos reservados. By Emmanuel Almario</p>
          <div className="flex gap-6">
            <span className="text-sm text-gray-400 hover:text-black cursor-pointer transition-colors">Instagram</span>
            <span className="text-sm text-gray-400 hover:text-black cursor-pointer transition-colors">Twitter</span>
          </div>
        </div>
      </footer>
    </div>
  )
}