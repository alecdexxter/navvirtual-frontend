import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Registro() {
    const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { registrar } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await registrar(form);
            navigate('/eventos');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al registrarse');
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Nuevo acceso</span>
                <h1 className="font-display font-bold text-3xl mt-2 mb-8">Crear cuenta</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required
                           className="bg-superficie rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-senal" />
                    <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required
                           className="bg-superficie rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-senal" />
                    <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
                           className="bg-superficie rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-senal" />
                    <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required
                           className="bg-superficie rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-senal" />
                    <button
                        type="submit"
                        className="bg-senal hover:bg-senal-hover text-fondo font-display font-semibold py-3 rounded-full transition-colors mt-2"
                    >
                        Registrarme
                    </button>
                </form>

                {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

                <Link to="/login" className="block mt-6 text-sm text-senal hover:text-senal-hover">
                    ¿Ya tenés cuenta? Iniciá sesión
                </Link>
            </div>
        </div>
    );
}

export default Registro;