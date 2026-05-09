import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ShinyText from './ReactBits/ShinyText'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <Link to="/" className="text-2xl font-bold tracking-tight text-black">
        <ShinyText
        text={"JTECH"}
        color={"#000000"}
        delay={5}
        />
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/catalogo" className="text-sm text-gray-600 hover:text-black transition-colors">
          Catálogo
        </Link>

        {user ? (
          <>
            {user.rol === 'CLIENTE' && (
              <>
                <Link to="/mis-ordenes" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Mis órdenes
                </Link>
                <Link to="/carrito">
                  <ShoppingCart size={20} className="text-gray-600 hover:text-black transition-colors" />
                </Link>
              </>
            )}
            {(user.rol === 'ADMIN' || user.rol === 'SUPER_ADMIN') && (
              <Link to="/admin/dashboard" className="text-sm text-gray-600 hover:text-black transition-colors">
                Dashboard
              </Link>
            )}
            <span className="text-sm text-gray-600">{user.nombre}</span>
            <button onClick={handleLogout}>
              <LogOut size={20} className="text-gray-600 hover:text-black transition-colors" />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-600 hover:text-black transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
              Registro
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}