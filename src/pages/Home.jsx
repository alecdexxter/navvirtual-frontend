import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

const esVideo = (url) => /\.(mp4|webm|mov)$/i.test(url);

function Home() {
    const [imagenes, setImagenes] = useState([]);
    const [indiceActual, setIndiceActual] = useState(0);
    const [stands, setStands] = useState([]);
    const { usuario } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axiosClient.get('/configuracion').then((res) => setImagenes(res.data.imagenesPortada || []));
    }, []);

    useEffect(() => {
        axiosClient.get('/eventos/publicos/vigentes').then((res) => {
            if (res.data.length > 0) {
                axiosClient.get(`/stands/evento/${res.data[0].id}`).then((r) => setStands(r.data));
            }
        });
    }, []);

    useEffect(() => {
        if (imagenes.length <= 1) return;
        const actual = imagenes[indiceActual];
        if (esVideo(actual)) return;
        const intervalo = setInterval(() => setIndiceActual((i) => (i + 1) % imagenes.length), 6000);
        return () => clearInterval(intervalo);
    }, [imagenes, indiceActual]);

    const handleClickCTA = async () => {
        if (!usuario) return;
        try {
            const { data } = await axiosClient.get('/eventos/publicos/vigentes');
            navigate(data.length > 0 ? `/recorrido/${data[0].id}` : '/eventos');
        } catch {
            navigate('/eventos');
        }
    };

    const coloresBloque = ['bg-superficie', 'bg-senal', 'bg-ambar'];

    return (
        <div className="bg-fondo">
            <section className="relative h-[100dvh] overflow-hidden">
                {imagenes.length > 0 ? (
                    imagenes.map((url, i) =>
                        esVideo(url) ? (
                            <video key={url} src={url} autoPlay muted playsInline
                                   onEnded={() => setIndiceActual((idx) => (idx + 1) % imagenes.length)}
                                   className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === indiceActual ? 'opacity-60' : 'opacity-0'}`} />
                        ) : (
                            <img key={url} src={url} alt=""
                                 className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === indiceActual ? 'opacity-60' : 'opacity-0'}`} />
                        )
                    )
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-fondo via-senal/20 to-fondo" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-fondo via-fondo/40 to-fondo/70" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                    <span className="font-mono text-xs text-senal tracking-widest uppercase mb-4">◣ Navegación Virtual</span>
                    <h1 className="font-display font-bold text-4xl md:text-6xl leading-tight mb-6 text-tinta max-w-3xl">
                        Recorré la convención sin salir de tu casa
                    </h1>
                    <p className="text-lg text-tinta/70 mb-10 leading-relaxed max-w-xl">
                        Explorá los stands, mirá lo que exponen, jugá la trivia de cada
                        uno y comprá en la tienda o el buffet — todo desde un recorrido
                        360° que se siente como estar ahí.
                    </p>

                    {usuario ? (
                        <button onClick={handleClickCTA} className="bg-senal hover:bg-senal-hover text-tinta font-display font-semibold text-lg px-8 py-4 rounded-full transition-colors">
                            Entrar al recorrido →
                        </button>
                    ) : (
                        <Link to="/login" className="bg-senal hover:bg-senal-hover text-tinta font-display font-semibold text-lg px-8 py-4 rounded-full transition-colors">
                            Iniciar sesión →
                        </Link>
                    )}
                </div>

                {imagenes.length > 1 && (
                    <div className="absolute bottom-8 inset-x-0 flex justify-center gap-2 z-10">
                        {imagenes.map((_, i) => (
                            <button key={i} onClick={() => setIndiceActual(i)}
                                    className={`w-2 h-2 rounded-full transition-colors ${i === indiceActual ? 'bg-senal' : 'bg-tinta/30'}`} />
                        ))}
                    </div>
                )}
            </section>

            {stands.length > 0 && (
                <section className="bg-fondo">
                    {stands.map((s, i) => (
                        <div key={s.id} className="grid md:grid-cols-2 min-h-[70vh]">
                            <div className={`${i % 2 === 1 ? 'md:order-2' : ''} relative overflow-hidden`}>
                                {s.imagenPortadaUrl ? (
                                    <img src={s.imagenPortadaUrl} alt={s.nombre} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-tinta/20 font-mono text-xs bg-superficie/40">
                                        Sin imagen
                                    </div>
                                )}
                            </div>
                            <div className={`${coloresBloque[i % coloresBloque.length]} flex flex-col justify-center px-10 md:px-16 py-16`}>
                                <span className="font-mono text-xs text-tinta/60 tracking-widest uppercase">STAND · {String(s.id).padStart(2, '0')}</span>
                                <h3 className="font-display font-bold text-3xl md:text-4xl mt-3 mb-4 text-tinta">{s.nombre}</h3>
                                <p className="text-tinta/80 leading-relaxed max-w-sm">{s.descripcion}</p>
                            </div>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}

export default Home;