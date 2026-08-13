import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

function Carrito() {
    const { items, cambiarCantidad, quitar, total } = useCarrito();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="max-w-md mx-auto px-6 py-20 text-center">
                <h1 className="font-display font-bold text-2xl mb-4">Tu carrito está vacío</h1>
                <Link to="/eventos" className="text-senal hover:text-senal-hover">Volver a eventos</Link>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-6 py-12">
            <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Carrito</span>
            <h1 className="font-display font-bold text-3xl mt-2 mb-8">Tu carrito</h1>

            <div className="flex flex-col divide-y divide-superficie">
                {items.map((item) => (
                    <div key={item.productoId} className="flex items-center justify-between py-4">
                        <div>
                            <h3 className="font-display font-semibold">{item.nombre}</h3>
                            <p className="font-mono text-sm text-tinta/60">${item.precio} c/u</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => cambiarCantidad(item.productoId, item.cantidad - 1)}
                                    className="w-7 h-7 rounded-full bg-superficie hover:bg-tinta/10 font-display">−</button>
                            <span className="font-mono w-4 text-center">{item.cantidad}</span>
                            <button onClick={() => cambiarCantidad(item.productoId, item.cantidad + 1)}
                                    className="w-7 h-7 rounded-full bg-superficie hover:bg-tinta/10 font-display">+</button>
                            <button onClick={() => quitar(item.productoId)}
                                    className="text-xs text-tinta/40 hover:text-red-600 ml-2">Quitar</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mt-8 mb-6">
                <span className="font-display font-medium">Total</span>
                <span className="font-mono text-xl">${total}</span>
            </div>

            <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-senal hover:bg-senal-hover text-fondo font-display font-semibold py-4 rounded-full transition-colors"
            >
                Ir a pagar →
            </button>
        </div>
    );
}

export default Carrito;