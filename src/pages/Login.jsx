import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'sonner';
import Silk from '../components/ReactBits/Silk';
import TextType from '../components/ReactBits/TextType';


const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', credentials);
      
      login(response.data); 

      toast.success(`Bienvenido, ${response.data.nombre}`);
      
      if (response.data.rol === 'SUPER_ADMIN' || response.data.rol === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error: Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950">
      <div className="absolute inset-0 z-0">
        <Silk />
      </div>

      {/* FORMULARIO */}
        <div className="z-10 w-full max-w-md p-8  backdrop-blur-md rounded-2xl shadow-xl">        
        <TextType 
        style={{fontFamily: "'Playfair Display', serif" }}
        className='mb-4 text-[#000000] text-xl mx-auto font-bold'
        text={["Bienvenido a JTech Ecommerce", "Inicia Sesión para continuar."]}
        typingSpeed={75}
        pauseDuration={1500}
        showCursor
        cursorCharacter="_"
        deletingSpeed={50}
        cursorBlinkDuration={0.5}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#ffffff] text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-3 rounded-lg bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] focus:outline-none focus:border-black transition-colors"
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-[#ffffff] text-sm mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              className="w-full p-3 rounded-lg bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] focus:outline-none focus:border-black transition-colors"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-black hover:bg-white hover:text-black text-white font-bold rounded-lg transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
            <p className="text-center text-sm text-[#000000] mt-4">
            ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-bold hover:underline">
          Regístrate
          </Link>
</p>
        </form>
      </div>
    </div>
  );
};

export default Login;