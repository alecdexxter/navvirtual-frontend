import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import Trivia from './Trivia';
import { Link } from 'react-router-dom';

function StandPanel({ standId, onCerrar }) {
    const [stand, setStand] = useState(null);
    const [productos, setProductos] = useState([]);
    const [voto, setVoto] = useState(null);
    const [votando, setVotando] = useState(false);

    useEffect(() => {
        setStand(null);
        axiosClient.get(`/stands/${standId}`).then((res) => setStand(res.data));
        axiosClient.get(`/productos/stand/${standId}`).then((res) => setProductos(res.data));
        axiosClient.get(`/votos/stand/${standId}`).then((res) => setVoto(res.data));
    }, [standId]);

    const handleVotar = async () => {
        setVotando(true);
        try {
            const { data } = await axiosClient.post(`/votos/stand/${standId}`);
            setVoto(data);
        } catch (err) {
            alert(err.response?.data?.mensaje || 'No se pudo registrar el voto');
        } finally {
            setVotando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-tinta/50" onClick={onCerrar} />

            <div className="relative w-full max-w-md h-full bg-fondo overflow-y-auto px-6 py-6">
                <button onClick={onCerrar} className="text-2xl leading-none mb-4" aria-label="Cerrar">✕</button>

                {!stand ? (
                    <p className="text-tinta/60">Cargando stand...</p>
                ) : (
                    <>
                        {stand.imagenPortadaUrl && (
                            <img src={stand.imagenPortadaUrl} alt={stand.nombre} className="w-full aspect-video object-cover rounded-2xl mb-4" />
                        )}

                        <span className="font-mono text-xs text-senal">STAND · {String(stand.id).padStart(2, '0')}</span>
                        <h2 className="font-display font-bold text-2xl mt-1 mb-3">{stand.nombre}</h2>
                        <p className="text-tinta/70 leading-relaxed">{stand.descripcion}</p>

                        {stand.videoUrl && (
                            <video src={stand.videoUrl} controls className="w-full rounded-xl mt-4" />
                        )}

                        <div className="mt-6">
                            <button
                                onClick={handleVotar}
                                disabled={votando || voto?.yaVoto}
                                className={`font-display font-semibold px-5 py-2.5 rounded-full transition-colors ${voto?.yaVoto ? 'bg-superficie text-tinta/50' : 'bg-ambar hover:brightness-95 text-tinta'}`}
                            >
                                {voto?.yaVoto ? '★ Ya votaste este stand' : '☆ Votar como favorito'}
                            </button>
                            {voto && <p className="font-mono text-xs text-tinta/50 mt-2">{voto.totalVotos} votos totales</p>}
                        </div>

                        <div className="flex items-center justify-between mt-8 mb-3">
                            <h3 className="font-display font-semibold text-lg">Lo que ofrece este stand</h3>
                            <Link to={`/tienda/stand/${standId}`} className="text-xs text-senal hover:text-senal-hover font-mono">Ver todo ◣</Link>
                        </div>

                        {productos.length === 0 && <p className="text-sm text-tinta/60">Este stand todavía no cargó productos.</p>}

                        <div className="flex flex-col divide-y divide-superficie">
                            {productos.slice(0, 3).map((p) => (
                                <div key={p.id} className="flex gap-3 py-3">
                                    {p.imagenUrl && (
                                        <img src={p.imagenUrl} alt={p.nombre} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                                    )}
                                    <div>
                                        <strong className="font-display text-sm">{p.nombre}</strong>
                                        <p className="text-xs text-tinta/60">{p.descripcion}</p>
                                        <p className="font-mono text-sm mt-0.5">${p.precio}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Trivia standId={standId} />
                    </>
                )}
            </div>
        </div>
    );
}

export default StandPanel;