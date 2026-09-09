import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

function Navbar() {
    const [abierto, setAbierto] = useState(false);
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const cerrarYNavegar = (ruta) => {
        setAbierto(false);
        navigate(ruta);
    };

    const irAlRecorrido = async () => {
        setAbierto(false);
        try {
            const { data } = await axiosClient.get('/eventos/publicos/vigentes');
            navigate(data.length > 0 ? `/recorrido/${data[4].id}` : '/eventos');
        } catch {
            navigate('/eventos');
        }
    };

    const irATienda = async () => {
        setAbierto(false);
        try {
            const { data } = await axiosClient.get('/eventos/publicos/vigentes');
            navigate(data.length > 0 ? `/tienda/${data[4].id}` : '/eventos');
        } catch {
            navigate('/eventos');
        }
    };

    return (
        <>
            <header className="flex items-center justify-between px-6 py-4 bg-superficie text-tinta">
                <button onClick={() => setAbierto(true)} className="flex flex-col gap-1.5 w-6 group" aria-label="Abrir menú">
                    <span className="h-0.5 w-full bg-tinta group-hover:bg-ambar transition-colors" />
                    <span className="h-0.5 w-full bg-tinta group-hover:bg-ambar transition-colors" />
                    <span className="h-0.5 w-4 bg-tinta group-hover:bg-ambar transition-colors" />
                </button>

                <Link to={usuario ? '/eventos' : '/'} className="font-display font-semibold text-lg tracking-tight">
                    Navegación Virtual
                </Link>

                {usuario ? (
                    <span className="font-mono text-xs text-tinta/60">{usuario.nombre}</span>
                ) : (
                    <span className="w-6" />
                )}
            </header>

            <div className={`fixed inset-0 z-50 transition-opacity ${abierto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/70" onClick={() => setAbierto(false)} />
                <nav className={`absolute left-0 top-0 h-full w-72 bg-fondo px-6 py-6 flex flex-col gap-1 transition-transform duration-300 ${abierto ? 'translate-x-0' : '-translate-x-full'}`}>
                    <button onClick={() => setAbierto(false)} className="self-end text-2xl leading-none mb-4 text-tinta" aria-label="Cerrar menú">✕</button>

                    <MenuItem label="Inicio" onClick={() => cerrarYNavegar('/')} />
                    <MenuItem label="Recorrido" onClick={irAlRecorrido} />
                    <MenuItem label="Eventos" onClick={() => cerrarYNavegar('/eventos')} />
                    <MenuItem label="Entradas" onClick={() => cerrarYNavegar('/entradas')} />
                    <MenuItem label="Tienda" onClick={irATienda} />
                    {usuario ? (
                        <>
                            <MenuItem label="Mi cuenta" onClick={() => cerrarYNavegar('/admin')} />
                            <MenuItem label="Cerrar sesión" onClick={() => { setAbierto(false); logout(); navigate('/'); }} />
                        </>
                    ) : (
                        <MenuItem label="Iniciar sesión" onClick={() => cerrarYNavegar('/login')} />
                    )}
                </nav>
            </div>
        </>
    );
}

function MenuItem({ label, onClick }) {
    return (
        <button onClick={onClick} className="text-left font-display text-2xl py-3 border-b border-superficie flex items-center gap-3 hover:text-senal transition-colors text-tinta">
            <span className="text-senal">◣</span> {label}
        </button>
    );
}

export default Navbar;