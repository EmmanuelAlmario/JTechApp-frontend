import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import MisOrdenes from './pages/MisOrdenes'
import Catalogo from './pages/Catalogo'
import Dashboard from './pages/admin/Dashboard'
import Productos from './pages/admin/Productos'
import Categorias from './pages/admin/Categorias'
import Marcas from './pages/admin/Marcas'
import Ordenes from './pages/admin/Ordenes'
import Administradores from './pages/admin/Administradores'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/checkout" element={<Checkout />} />

      <Route path="/mis-ordenes" element={
        <ProtectedRoute roles={['CLIENTE']}>
          <MisOrdenes />
        </ProtectedRoute>
      } />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/productos" element={
        <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
          <Productos />
        </ProtectedRoute>
      } />
      <Route path="/admin/categorias" element={
        <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
          <Categorias />
        </ProtectedRoute>
      } />
      <Route path="/admin/marcas" element={
        <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
          <Marcas />
        </ProtectedRoute>
      } />
      <Route path="/admin/ordenes" element={
        <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
          <Ordenes />
        </ProtectedRoute>
      } />

      <Route path="/admin/administradores" element={
        <ProtectedRoute roles={['SUPER_ADMIN']}>
          <Administradores />
        </ProtectedRoute>
      } />

    </Routes>
  )
}