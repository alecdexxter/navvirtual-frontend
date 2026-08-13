import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/eventos');
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Acceso</span>
                <h1 className="font-display font-bold text-3xl mt-2 mb-8">Iniciar sesión</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-superficie rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-senal"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-superficie rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-senal"
                    />
                    <button
                        type="submit"
                        className="bg-senal hover:bg-senal-hover text-fondo font-display font-semibold py-3 rounded-full transition-colors mt-2"
                    >
                        Ingresar
                    </button>
                </form>

                {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

                <Link to="/registro" className="block mt-6 text-sm text-senal hover:text-senal-hover">
                    ¿No tenés cuenta? Registrate
                </Link>
            </div>
        </div>
    );
}

export default Login;