import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Tag, Bookmark, ShoppingBag, Users, LogOut } from 'lucide-react';
import ShinyText from './ReactBits/ShinyText';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Productos', path: '/admin/productos', icon: Package },
    { label: 'Categorías', path: '/admin/categorias', icon: Tag },
    { label: 'Marcas', path: '/admin/marcas', icon: Bookmark },
    { label: 'Órdenes', path: '/admin/ordenes', icon: ShoppingBag },
    ...(user?.rol === 'SUPER_ADMIN' ? [{ label: 'Administradores', path: '/admin/administradores', icon: Users }] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 min-h-screen border-r border-white/10 p-6 flex flex-col bg-white/5">
      
      <div className="mb-10">
        <ShinyText
          text="JTECH"
          className="text-2xl font-bold mb-1"
          speed={3}
        />
        <p className="text-white/30 text-xs">Panel de administración</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const activo = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 text-left text-sm py-3 px-4 rounded-xl transition-all ${
                activo
                  ? 'bg-white text-black font-medium'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 pt-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
            {user?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{user?.nombre}</p>
            <p className="text-white/30 text-xs">{user?.rol}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors w-full"
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
} 
