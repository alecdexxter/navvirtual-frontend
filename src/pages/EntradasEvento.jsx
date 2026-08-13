import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useCarrito } from '../context/CarritoContext';

function EntradasEvento() {
    const { eventoId } = useParams();
    const [evento, setEvento] = useState(null);
    const [entradas, setEntradas] = useState([]);
    const { agregar, cantidadTotal } = useCarrito();

    useEffect(() => {
        axiosClient.get(`/eventos/${eventoId}`).then((res) => setEvento(res.data));
        axiosClient.get('/productos/categoria/ENTRADA').then((res) => {
            setEntradas(res.data.filter((p) => p.eventoId === Number(eventoId)));
        });
    }, [eventoId]);

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Entradas</span>
                    <h1 className="font-display font-bold text-3xl mt-2">{evento?.nombre}</h1>
                </div>
                <Link to="/carrito" className="bg-tinta text-fondo font-display font-semibold px-5 py-2.5 rounded-full hover:bg-senal transition-colors">
                    Carrito ({cantidadTotal})
                </Link>
            </div>

            {entradas.length === 0 && <p className="text-tinta/60">Todavía no hay entradas cargadas para este evento.</p>}

            <div className="flex flex-col divide-y divide-superficie">
                {entradas.map((e) => (
                    <div key={e.id} className="flex items-center justify-between py-5">
                        <div>
                            <h3 className="font-display font-semibold">{e.nombre}</h3>
                            <p className="text-sm text-tinta/60">{e.descripcion}</p>
                            <p className="font-mono text-sm mt-1">${e.precio}</p>
                        </div>
                        <button
                            onClick={() => agregar(e)}
                            className="bg-senal hover:bg-senal-hover text-fondo font-display font-medium px-4 py-2 rounded-full transition-colors"
                        >
                            Agregar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EntradasEvento;