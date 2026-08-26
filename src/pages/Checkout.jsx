import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

initMercadoPago('APP_USR-e6a3b3c4-4114-40ae-bc46-f60406588189');

function Checkout() {
    const { items, total, vaciar } = useCarrito();
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [procesando, setProcesando] = useState(false);
    const [resultado, setResultado] = useState(null);

    if (items.length === 0 && !resultado) {
        return (
            <div className="max-w-md mx-auto px-6 py-20 text-center">
                <p className="text-tinta/60">No hay nada en el carrito.</p>
            </div>
        );
    }

    const handleSubmit = async ({ formData }) => {
        setProcesando(true);
        setError('');
        try {
            const payload = {
                items: items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
                token: formData.token,
                paymentMethodId: formData.payment_method_id,
                issuerId: formData.issuer_id,
                installments: formData.installments,
                payerEmail: 'comprador_prueba@testuser.com',
            };

            const { data } = await axiosClient.post('/compras', payload);
            setResultado(data);
            vaciar();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al procesar el pago');
        } finally {
            setProcesando(false);
        }
    };

    if (resultado) {
        return (
            <div className="max-w-md mx-auto px-6 py-20 text-center">
                <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Resultado</span>
                <h1 className="font-display font-bold text-2xl mt-2 mb-4">
                    {resultado.estado === 'PAGADA' ? '¡Compra exitosa!' : 'Compra registrada'}
                </h1>
                <p className="text-tinta/60 mb-2">Estado: {resultado.estado}</p>
                {resultado.codigoBoleta && (
                    <p className="font-mono bg-superficie inline-block px-4 py-2 rounded-lg mb-6">
                        {resultado.codigoBoleta}
                    </p>
                )}
                <button
                    onClick={() => navigate('/eventos')}
                    className="block mx-auto bg-senal hover:bg-senal-hover text-tinta font-display font-semibold px-6 py-3 rounded-full transition-colors"
                >
                    Volver a eventos
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-6 py-12">
            <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Checkout</span>
            <h1 className="font-display font-bold text-3xl mt-2 mb-2">Pagar</h1>
            <p className="font-mono text-lg mb-6">${total}</p>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            {procesando && <p className="text-tinta/60 text-sm mb-4">Procesando pago...</p>}

            <Payment
                initialization={{ amount: total, payer: { email: usuario?.email } }}
                customization={{ paymentMethods: { creditCard: 'all', debitCard: 'all', mercadoPago: 'all' } }}
                onSubmit={handleSubmit}
                onError={() => setError('Error en el formulario de pago')}
            />
        </div>
    );
}

export default Checkout;