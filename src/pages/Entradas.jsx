import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function Entradas() {
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        axiosClient.get('/eventos/publicos/vigentes').then((res) => setEventos(res.data));
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Entradas</span>
            <h1 className="font-display font-bold text-3xl mt-2 mb-8 text-tinta">Comprar entradas</h1>

            {eventos.length === 0 && <p className="text-tinta/60">No hay eventos disponibles.</p>}

            <div className="flex flex-col gap-3">
                {eventos.map((ev) => (
                    <Link
                        key={ev.id}
                        to={`/entradas/${ev.id}`}
                        className="group bg-superficie rounded-2xl p-5 flex items-center justify-between hover:ring-2 hover:ring-senal transition-all"
                    >
                        <div>
                            <h2 className="font-display font-semibold text-tinta">{ev.nombre}</h2>
                            <p className="text-sm text-tinta/60">{ev.descripcion}</p>
                        </div>
                        <span className="text-senal group-hover:text-senal-hover transition-colors font-display">Ver entradas ◣</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Entradas;