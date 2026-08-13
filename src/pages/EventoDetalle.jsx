import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import StandPanel from '../components/StandPanel';

function EventoDetalle() {
    const { eventoId } = useParams();
    const [evento, setEvento] = useState(null);
    const [stands, setStands] = useState([]);
    const [standAbierto, setStandAbierto] = useState(null);

    useEffect(() => {
        axiosClient.get(`/eventos/${eventoId}`).then((res) => setEvento(res.data));
        axiosClient.get(`/stands/evento/${eventoId}`).then((res) => setStands(res.data));
    }, [eventoId]);

    if (!evento) return <p className="max-w-5xl mx-auto px-6 py-12">Cargando...</p>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Evento</span>
            <h1 className="font-display font-bold text-3xl md:text-4xl mt-2 mb-3">{evento.nombre}</h1>
            <p className="text-tinta/60 mb-8 max-w-2xl">{evento.descripcion}</p>

            <div className="flex gap-3 mb-10">
                <Link
                    to={`/recorrido/${eventoId}`}
                    className="bg-senal hover:bg-senal-hover text-fondo font-display font-semibold px-6 py-3 rounded-full transition-colors"
                >
                    Entrar al recorrido 360 →
                </Link>
                <Link
                    to={`/tienda/${eventoId}`}
                    className="bg-superficie hover:bg-tinta hover:text-fondo font-display font-semibold px-6 py-3 rounded-full transition-colors"
                >
                    Ir a la tienda
                </Link>
            </div>

            <h2 className="font-display font-semibold text-xl mb-4">Stands</h2>

            {stands.length === 0 && <p className="text-tinta/60">Este evento todavía no tiene stands cargados.</p>}

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stands.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setStandAbierto(s.id)}
                        className="text-left group bg-superficie rounded-2xl overflow-hidden hover:ring-2 hover:ring-senal transition-all"
                    >
                        <div className="aspect-video bg-tinta/10 overflow-hidden">
                            {s.imagenPortadaUrl ? (
                                <img src={s.imagenPortadaUrl} alt={s.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-tinta/30 font-mono text-xs">
                                    Sin imagen
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <span className="font-mono text-[10px] text-senal">STAND · {String(s.id).padStart(2, '0')}</span>
                            <h3 className="font-display font-semibold mt-1">{s.nombre}</h3>
                        </div>
                    </button>
                ))}
            </div>

            {standAbierto && (
                <StandPanel standId={standAbierto} onCerrar={() => setStandAbierto(null)} />
            )}
        </div>
    );
}

export default EventoDetalle;