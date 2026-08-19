import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

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
        const intervalo = setInterval(() => {
            setIndiceActual((i) => (i + 1) % imagenes.length);
        }, 5000);
        return () => clearInterval(intervalo);
    }, [imagenes]);

    const handleClickCTA = async () => {
        if (!usuario) return;
        try {
            const { data } = await axiosClient.get('/eventos/publicos/vigentes');
            navigate(data.length > 0 ? `/recorrido/${data[0].id}` : '/eventos');
        } catch {
            navigate('/eventos');
        }
    };

    return (
        <div className="min-h-screen bg-fondo">
            <section className="grid md:grid-cols-2 min-h-[calc(100vh-73px)]">
                <div className="relative bg-tinta min-h-[50vh] md:min-h-full overflow-hidden">
                    {imagenes.length > 0 ? (
                        <>
                            {imagenes.map((url, i) => (
                                <img
                                    key={url}
                                    src={url}
                                    alt=""
                                    className={`absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-700 ${i === indiceActual ? 'opacity-80' : 'opacity-0'}`}
                                />
                            ))}
                            {imagenes.length > 1 && (
                                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-10">
                                    {imagenes.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setIndiceActual(i)}
                                            className={`w-2 h-2 rounded-full transition-colors ${i === indiceActual ? 'bg-ambar' : 'bg-fondo/40'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-fondo/30 font-mono text-sm">
                            Sin imágenes de portada configuradas
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-tinta/70 via-transparent to-transparent pointer-events-none" />
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
                    {usuario ? (
                        <button onClick={handleClickCTA} className="inline-block w-fit bg-senal hover:bg-senal-hover text-fondo font-display font-semibold text-lg px-8 py-4 rounded-full transition-colors">
                            Entrar al recorrido →
                        </button>
                    ) : (
                        <Link to="/login" className="inline-block w-fit bg-senal hover:bg-senal-hover text-fondo font-display font-semibold text-lg px-8 py-4 rounded-full transition-colors">
                            Iniciar sesión →
                        </Link>
                    )}
                </div>
            </section>

            {stands.length > 0 && (
                <section className="max-w-4xl mx-auto px-6 py-20">
                    <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Stands</span>
                    <h2 className="font-display font-bold text-3xl mt-2 mb-10">Conocé a los expositores</h2>

                    <div className="flex flex-col gap-12">
                        {stands.map((s, i) => (
                            <div key={s.id} className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                                <div className="aspect-video rounded-2xl overflow-hidden bg-superficie">
                                    {s.imagenPortadaUrl ? (
                                        <img src={s.imagenPortadaUrl} alt={s.nombre} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-tinta/30 font-mono text-xs">Sin imagen</div>
                                    )}
                                </div>
                                <div>
                                    <span className="font-mono text-xs text-senal">STAND · {String(s.id).padStart(2, '0')}</span>
                                    <h3 className="font-display font-bold text-2xl mt-1 mb-3">{s.nombre}</h3>
                                    <p className="text-tinta/60 leading-relaxed">{s.descripcion}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default Home;