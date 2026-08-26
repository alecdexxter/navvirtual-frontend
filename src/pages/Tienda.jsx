import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useCarrito } from '../context/CarritoContext';

function Tienda() {
    const { eventoId } = useParams();
    const [categoria, setCategoria] = useState('STAND');
    const [stands, setStands] = useState([]);
    const [productosConfiteria, setProductosConfiteria] = useState([]);
    const { agregar, cantidadTotal } = useCarrito();

    useEffect(() => {
        if (categoria === 'STAND') {
            axiosClient.get(`/stands/evento/${eventoId}`).then((res) => setStands(res.data));
        } else {
            axiosClient.get('/productos/categoria/CONFITERIA').then((res) => setProductosConfiteria(res.data));
        }
    }, [categoria, eventoId]);

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Tienda</span>
                    <h1 className="font-display font-bold text-3xl mt-2">Tienda</h1>
                </div>
                <Link to="/carrito" className="bg-tinta text-tinta font-display font-semibold px-5 py-2.5 rounded-full hover:bg-senal transition-colors">
                    Carrito ({cantidadTotal})
                </Link>
            </div>

            <div className="flex gap-2 mb-8">
                <button onClick={() => setCategoria('STAND')}
                        className={`font-display font-medium px-5 py-2 rounded-full transition-colors ${categoria === 'STAND' ? 'bg-senal text-tinta' : 'bg-superficie hover:bg-tinta/10'}`}>
                    Stands
                </button>
                <button onClick={() => setCategoria('CONFITERIA')}
                        className={`font-display font-medium px-5 py-2 rounded-full transition-colors ${categoria === 'CONFITERIA' ? 'bg-senal text-tinta' : 'bg-superficie hover:bg-tinta/10'}`}>
                    Confitería
                </button>
            </div>

            {categoria === 'STAND' && (
                <div className="grid sm:grid-cols-2 gap-4">
                    {stands.length === 0 && <p className="text-tinta/60">No hay stands en este evento.</p>}
                    {stands.map((s) => (
                        <Link key={s.id} to={`/tienda/stand/${s.id}`}
                              className="group bg-superficie rounded-2xl overflow-hidden hover:ring-2 hover:ring-senal transition-all">
                            <div className="aspect-video bg-tinta/10 overflow-hidden">
                                {s.imagenPortadaUrl ? (
                                    <img src={s.imagenPortadaUrl} alt={s.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-tinta/30 font-mono text-xs">Sin imagen</div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-display font-semibold">{s.nombre}</h3>
                                <p className="text-sm text-tinta/60 line-clamp-1">{s.descripcion}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {categoria === 'CONFITERIA' && (
                <div className="flex flex-col divide-y divide-superficie">
                    {productosConfiteria.length === 0 && <p className="text-tinta/60">No hay productos de confitería.</p>}
                    {productosConfiteria.map((p) => (
                        <div key={p.id} className="flex items-center justify-between py-5">
                            <div className="flex items-center gap-4">
                                {p.imagenUrl ? <img src={p.imagenUrl} alt={p.nombre} className="w-16 h-16 rounded-xl object-cover" /> : <div className="w-16 h-16 rounded-xl bg-superficie" />}
                                <div>
                                    <h3 className="font-display font-semibold">{p.nombre}</h3>
                                    <p className="text-sm text-tinta/60">{p.descripcion}</p>
                                    <p className="font-mono text-sm mt-1">${p.precio}</p>
                                </div>
                            </div>
                            <button onClick={() => agregar(p)} className="bg-senal hover:bg-senal-hover text-tinta font-display font-medium px-4 py-2 rounded-full transition-colors shrink-0">
                                Agregar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Tienda;