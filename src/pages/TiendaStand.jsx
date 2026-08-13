import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useCarrito } from '../context/CarritoContext';

function TiendaStand() {
    const { standId } = useParams();
    const [stand, setStand] = useState(null);
    const [productos, setProductos] = useState([]);
    const { agregar, cantidadTotal } = useCarrito();

    useEffect(() => {
        axiosClient.get(`/stands/${standId}`).then((res) => setStand(res.data));
        axiosClient.get(`/productos/stand/${standId}`).then((res) => setProductos(res.data));
    }, [standId]);

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Tienda del stand</span>
                    <h1 className="font-display font-bold text-3xl mt-2">{stand?.nombre || 'Cargando...'}</h1>
                </div>
                <Link
                    to="/carrito"
                    className="bg-tinta text-fondo font-display font-semibold px-5 py-2.5 rounded-full hover:bg-senal transition-colors"
                >
                    Carrito ({cantidadTotal})
                </Link>
            </div>

            {productos.length === 0 && <p className="text-tinta/60">Este stand todavía no cargó productos.</p>}

            <div className="flex flex-col divide-y divide-superficie">
                {productos.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-5">
                        <div className="flex items-center gap-4">
                            {p.imagenUrl ? (
                                <img src={p.imagenUrl} alt={p.nombre} className="w-16 h-16 rounded-xl object-cover" />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-superficie" />
                            )}
                            <div>
                                <h3 className="font-display font-semibold">{p.nombre}</h3>
                                <p className="text-sm text-tinta/60">{p.descripcion}</p>
                                <p className="font-mono text-sm mt-1">${p.precio}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => agregar(p)}
                            className="bg-senal hover:bg-senal-hover text-fondo font-display font-medium px-4 py-2 rounded-full transition-colors shrink-0"
                        >
                            Agregar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TiendaStand;