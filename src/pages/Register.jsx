import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'sonner';
import Silk from '../components/ReactBits/Silk';
import TextType from '../components/ReactBits/TextType';

const Register = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Cuenta creada exitosamente');
      navigate('/login');
    } catch (error) {
      toast.error('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Silk />
      </div>

      <div className="z-10 w-full max-w-md p-8 backdrop-blur-md rounded-2xl shadow-xl">
        <TextType
          style={{ fontFamily: "'Playfair Display', serif" }}
          className='mb-4 text-[#000000] text-xl mx-auto font-bold'
          text={["Crea tu cuenta en JTech", "Empieza a comprar hoy."]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor
          cursorCharacter="_"
          deletingSpeed={50}
          cursorBlinkDuration={0.5}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Nombre', name: 'nombre', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Contraseña', name: 'password', type: 'password' },
            { label: 'Teléfono', name: 'telefono', type: 'text' },
            { label: 'Dirección', name: 'direccion', type: 'text' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-[#000000] text-sm mb-1">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                required={field.name !== 'telefono' && field.name !== 'direccion'}
                className="w-full p-3 rounded-lg bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] focus:outline-none focus:border-black transition-colors"
                onChange={handleChange}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-black hover:bg-white hover:text-black text-white font-bold rounded-lg transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-[#000000] mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-bold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;