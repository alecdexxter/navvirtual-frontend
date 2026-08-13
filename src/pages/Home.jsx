import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function Home() {
    const [imagen, setImagen] = useState(null);

    useEffect(() => {
        axiosClient.get('/configuracion').then((res) => setImagen(res.data.imagenPortadaUrl));
    }, []);

    return (
        <div className="min-h-screen bg-fondo">
            <section className="grid md:grid-cols-2 min-h-[calc(100vh-73px)]">
                <div className="relative bg-tinta min-h-[50vh] md:min-h-full overflow-hidden">
                    {imagen ? (
                        <img src={imagen} alt="Recorrido virtual" className="w-full h-full object-cover opacity-80" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-fondo/30 font-mono text-sm">
                            Sin imagen de portada configurada
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-tinta/70 via-transparent to-transparent" />
                </div>

                <div className="flex flex-col justify-center px-8 md:px-16 py-16">
                    <span className="font-mono text-xs text-senal tracking-widest uppercase mb-4">◣ Navegación Virtual</span>
                    <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mb-6">
                        Recorré la convención sin salir de tu casa
                    </h1>
                    <p className="text-lg text-tinta/70 mb-10 leading-relaxed">
                        Explorá los stands, mirá lo que exponen, jugá la trivia de cada
                        uno y comprá en la tienda o el buffet — todo desde un recorrido
                        360° que se siente como estar ahí.
                    </p>
                    <Link to="/login" className="inline-block w-fit bg-senal hover:bg-senal-hover text-fondo font-display font-semibold text-lg px-8 py-4 rounded-full transition-colors">
                        Iniciar sesión →
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;