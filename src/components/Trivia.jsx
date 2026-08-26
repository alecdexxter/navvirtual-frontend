import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

function Trivia({ standId }) {
    const [preguntas, setPreguntas] = useState([]);
    const [indice, setIndice] = useState(0);
    const [resultado, setResultado] = useState(null);
    const [respondiendo, setRespondiendo] = useState(false);

    useEffect(() => {
        axiosClient.get(`/preguntas/stand/${standId}`).then((res) => setPreguntas(res.data));
    }, [standId]);

    const preguntaActual = preguntas[indice];

    const handleResponder = async (opcionId) => {
        setRespondiendo(true);
        try {
            const { data } = await axiosClient.post(`/preguntas/${preguntaActual.id}/responder`, { opcionId });
            setResultado(data);
        } catch (err) {
            setResultado({ correcta: false, mensaje: 'Error al enviar la respuesta' });
        } finally {
            setRespondiendo(false);
        }
    };

    const siguientePregunta = () => {
        setResultado(null);
        setIndice((i) => i + 1);
    };

    if (preguntas.length === 0) {
        return (
            <p className="font-mono text-xs text-tinta/50 mt-6">
                Este stand todavía no cargó preguntas de trivia.
            </p>
        );
    }

    if (indice >= preguntas.length) {
        return (
            <div className="mt-6 bg-ambar/20 rounded-2xl p-5 text-center">
                <p className="font-display font-semibold">¡Completaste la trivia de este stand! 🎉</p>
            </div>
        );
    }

    return (
        <div className="">
            <span className="font-mono text-xs text-senal">
                TRIVIA · {indice + 1}/{preguntas.length}
            </span>
            <p className="font-display font-medium mt-1 mb-4">{preguntaActual.texto}</p>

            {!resultado && (
                <div className="flex flex-col gap-2">
                    {preguntaActual.opciones.map((op) => (
                        <button
                            key={op.id}
                            onClick={() => handleResponder(op.id)}
                            disabled={respondiendo}
                            className="text-left bg-fondo hover:bg-tinta hover:text-tinta rounded-xl px-4 py-2.5 transition-colors disabled:opacity-50"
                        >
                            {op.texto}
                        </button>
                    ))}
                </div>
            )}

            {resultado && (
                <div>
                    <p className={`font-display font-semibold mb-3 ${resultado.correcta ? 'text-exito' : 'text-red-600'}`}>
                        {resultado.mensaje}
                    </p>
                    <button
                        onClick={siguientePregunta}
                        className="bg-senal hover:bg-senal-hover text-tinta font-display font-medium px-4 py-2 rounded-full transition-colors"
                    >
                        {indice + 1 < preguntas.length ? 'Siguiente pregunta' : 'Terminar'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default Trivia;