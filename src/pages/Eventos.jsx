import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

function Eventos() {
    const [eventos, setEventos] = useState([]);
    const { usuario } = useAuth();

    useEffect(() => {
        axiosClient.get('/eventos/publicos/vigentes').then((res) => setEventos(res.data));
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Hola, {usuario?.nombre}</span>
            <h1 className="font-display font-bold text-3xl md:text-4xl mt-2 mb-8 text-tinta">Eventos disponibles</h1>

            {eventos.length === 0 && <p className="text-tinta/60">No hay eventos por ahora.</p>}

            <div className="grid sm:grid-cols-2 gap-5">
                {eventos.map((ev) => (
                    <Link
                        key={ev.id}
                        to={`/evento/${ev.id}`}
                        className="group block bg-superficie rounded-2xl p-6 hover:ring-2 hover:ring-senal transition-all"
                    >
                        <span className="font-mono text-xs text-senal">EVENTO · {String(ev.id).padStart(2, '0')}</span>
                        <h2 className="font-display font-semibold text-xl mt-2 mb-2 text-tinta">{ev.nombre}</h2>
                        <p className="text-sm text-tinta/60 line-clamp-2">{ev.descripcion}</p>
                        <span className="inline-block mt-4 text-senal group-hover:text-senal-hover transition-colors font-display font-medium">
              Ver stands ◣
            </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Eventos;