import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import Campo from './ui/Campo';
import BotonSenal from './ui/BotonSenal';
import SubirImagen from './ui/SubirImagen';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

function AdminSuperadmin() {
    const [configSitio, setConfigSitio] = useState({ imagenesPortada: [] });
    const [eventoForm, setEventoForm] = useState({ nombre: '', descripcion: '', fechaInicio: '', fechaFin: '' });
    const [eventoEditandoId, setEventoEditandoId] = useState(null);
    const [rolForm, setRolForm] = useState({ usuarioEmail: '', nombreRol: 'ROLE_DUENIO_STAND' });
    const [panoramaForm, setPanoramaForm] = useState({ nombre: '', eventoId: '', imagenUrl: '', esPuntoInicio: false });
    const [hotspotForm, setHotspotForm] = useState({ panoramaOrigenId: '', panoramaDestinoId: '', standId: '', tipo: 'NAVEGACION', yaw: 0, pitch: 0 });
    const [eventos, setEventos] = useState([]);
    const [hotspotEventoId, setHotspotEventoId] = useState('');
    const [panoramasDelEvento, setPanoramasDelEvento] = useState([]);
    const [standsDelEvento, setStandsDelEvento] = useState([]);
    const [entradas, setEntradas] = useState([]);
    const [entradaEditandoId, setEntradaEditandoId] = useState(null);

    // Estados para Conferencias y Comunicados
    const [conferenciaForm, setConferenciaForm] = useState({ titulo: '', descripcion: '', tipo: 'CHARLA', horario: '', eventoId: '' });
    const [comunicadoForm, setComunicadoForm] = useState({ mensaje: '', eventoId: '' });
    const [conferencias, setConferencias] = useState([]);
    const [conferenciaEventoId, setConferenciaEventoId] = useState('');

    const { mostrar } = useToast();

    useEffect(() => {
        axiosClient.get('/configuracion').then((res) => setConfigSitio(res.data));
        axiosClient.get('/productos/categoria/ENTRADA').then((res) => setEntradas(res.data));
    }, []);

    useEffect(() => {
        if (!conferenciaEventoId) { setConferencias([]); return; }
        axiosClient.get(`/conferencias/evento/${conferenciaEventoId}`).then((res) => setConferencias(res.data));
    }, [conferenciaEventoId]);

    const agregarImagenPortada = async (url) => {
        try {
            const { data } = await axiosClient.post('/configuracion/imagenes', { url });
            setConfigSitio(data);
            mostrar('Imagen agregada al carrusel');
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al agregar imagen', 'error');
        }
    };

    const quitarImagenPortada = async (url) => {
        try {
            const { data } = await axiosClient.delete('/configuracion/imagenes', { params: { url } });
            setConfigSitio(data);
            mostrar('Imagen quitada');
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al quitar imagen', 'error');
        }
    };

    useEffect(() => {
        if (!hotspotEventoId) {
            setPanoramasDelEvento([]);
            setStandsDelEvento([]);
            return;
        }
        axiosClient.get(`/panoramas/evento/${hotspotEventoId}`).then((res) => setPanoramasDelEvento(res.data));
        axiosClient.get(`/stands/evento/${hotspotEventoId}`).then((res) => setStandsDelEvento(res.data));
    }, [hotspotEventoId]);

    useEffect(() => {
        axiosClient.get('/eventos/publicos/vigentes').then((res) => setEventos(res.data));
    }, []);

    const crearPanorama = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/panoramas', {
                ...panoramaForm,
                eventoId: Number(panoramaForm.eventoId),
            });
            mostrar('Panorama creado');
            setPanoramaForm({ nombre: '', eventoId: panoramaForm.eventoId, imagenUrl: '', esPuntoInicio: false });
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al crear panorama', 'error');
        }
    };

    const crearHotspot = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/hotspots', {
                panoramaOrigenId: Number(hotspotForm.panoramaOrigenId),
                panoramaDestinoId: hotspotForm.tipo === 'NAVEGACION' ? Number(hotspotForm.panoramaDestinoId) : null,
                standId: hotspotForm.tipo === 'STAND' ? Number(hotspotForm.standId) : null,
                tipo: hotspotForm.tipo,
                yaw: Number(hotspotForm.yaw),
                pitch: Number(hotspotForm.pitch),
            });
            mostrar('Hotspot creado');
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al crear hotspot', 'error');
        }
    };

    const guardarEvento = async (e) => {
        e.preventDefault();
        try {
            if (eventoEditandoId) {
                await axiosClient.put(`/eventos/${eventoEditandoId}`, eventoForm);
                mostrar('Evento actualizado');
                setEventoEditandoId(null);
            } else {
                await axiosClient.post('/eventos', eventoForm);
                mostrar('Evento creado');
            }
            setEventoForm({ nombre: '', descripcion: '', fechaInicio: '', fechaFin: '' });
            const { data } = await axiosClient.get('/eventos/todos');
            setTodosLosEventos(data);
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al guardar evento', 'error');
        }
    };

    const [standForm, setStandForm] = useState({ nombre: '', descripcion: '', eventoId: '', propietarioEmail: '' });
    const [buffetForm, setBuffetForm] = useState({ eventoId: '', propietarioEmail: '' });
    const [todosLosEventos, setTodosLosEventos] = useState([]);
    const [hotspotEventoIdBorrar, setHotspotEventoIdBorrar] = useState('');
    const [panoramaBorrarId, setPanoramaBorrarId] = useState('');
    const [panoramasParaBorrar, setPanoramasParaBorrar] = useState([]);
    const [hotspotsParaBorrar, setHotspotsParaBorrar] = useState([]);

    useEffect(() => {
        axiosClient.get('/eventos/todos').then((res) => setTodosLosEventos(res.data));
    }, []);

    useEffect(() => {
        if (!hotspotEventoIdBorrar) { setPanoramasParaBorrar([]); return; }
        axiosClient.get(`/panoramas/evento/${hotspotEventoIdBorrar}`).then((res) => setPanoramasParaBorrar(res.data));
    }, [hotspotEventoIdBorrar]);

    useEffect(() => {
        if (!panoramaBorrarId) { setHotspotsParaBorrar([]); return; }
        axiosClient.get(`/hotspots/panorama/${panoramaBorrarId}`).then((res) => setHotspotsParaBorrar(res.data));
    }, [panoramaBorrarId]);

    const crearStand = async (e) => {
        e.preventDefault();
        try {
            let propietarioId = null;
            if (standForm.propietarioEmail) {
                const { data: usuarioEncontrado } = await axiosClient.get('/usuarios/buscar', {
                    params: { email: standForm.propietarioEmail },
                });
                propietarioId = usuarioEncontrado.id;
            }
            await axiosClient.post('/stands', {
                nombre: standForm.nombre,
                descripcion: standForm.descripcion,
                eventoId: Number(standForm.eventoId),
                propietarioId,
            });
            mostrar('Stand creado');
            setStandForm({ nombre: '', descripcion: '', eventoId: '', propietarioEmail: '' });
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al crear stand', 'error');
        }
    };

    const [entradaForm, setEntradaForm] = useState({ nombre: '', precio: '', descripcion: '', eventoId: '' });

    const crearEntrada = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/productos', {
                nombre: entradaForm.nombre, precio: Number(entradaForm.precio),
                descripcion: entradaForm.descripcion, categoria: 'ENTRADA', eventoId: Number(entradaForm.eventoId),
            });
            mostrar('Entrada creada');
            setEntradaForm({ nombre: '', precio: '', descripcion: '', eventoId: '' });
            const { data } = await axiosClient.get('/productos/categoria/ENTRADA');
            setEntradas(data);
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al crear entrada', 'error');
        }
    };

    const eliminarEntrada = async (id) => {
        try {
            await axiosClient.delete(`/productos/${id}`);
            mostrar('Entrada eliminada');
            setEntradas((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al eliminar', 'error');
        }
    };

    const guardarEdicionEntrada = async (id) => {
        try {
            await axiosClient.put(`/productos/${id}`, {
                nombre: entradaForm.nombre, precio: Number(entradaForm.precio),
                descripcion: entradaForm.descripcion, categoria: 'ENTRADA',
            });
            mostrar('Entrada actualizada');
            setEntradaEditandoId(null);
            setEntradaForm({ nombre: '', precio: '', descripcion: '', eventoId: '' });
            const { data } = await axiosClient.get('/productos/categoria/ENTRADA');
            setEntradas(data);
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al actualizar', 'error');
        }
    };

    const crearBuffet = async (e) => {
        e.preventDefault();
        try {
            let propietarioId = null;
            if (buffetForm.propietarioEmail) {
                const { data: usuarioEncontrado } = await axiosClient.get('/usuarios/buscar', {
                    params: { email: buffetForm.propietarioEmail },
                });
                propietarioId = usuarioEncontrado.id;
            }
            await axiosClient.post('/buffets', {
                eventoId: Number(buffetForm.eventoId),
                propietarioId,
            });
            mostrar('Buffet creado');
            setBuffetForm({ eventoId: '', propietarioEmail: '' });
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al crear buffet', 'error');
        }
    };

    const borrarEvento = async (id) => {
        try {
            await axiosClient.delete(`/eventos/${id}`);
            mostrar('Evento eliminado');
            setTodosLosEventos((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al eliminar', 'error');
        }
    };

    const borrarHotspot = async (id) => {
        try {
            await axiosClient.delete(`/hotspots/${id}`);
            mostrar('Hotspot eliminado');
            setHotspotsParaBorrar((prev) => prev.filter((h) => h.id !== id));
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al eliminar', 'error');
        }
    };

    const asignarRol = async (e) => {
        e.preventDefault();
        try {
            const { data: usuarioEncontrado } = await axiosClient.get('/usuarios/buscar', {
                params: { email: rolForm.usuarioEmail },
            });
            await axiosClient.post('/roles/asignar', { usuarioId: usuarioEncontrado.id, nombreRol: rolForm.nombreRol });
            mostrar(`Rol asignado a ${usuarioEncontrado.nombre}`);
            setRolForm({ usuarioEmail: '', nombreRol: rolForm.nombreRol });
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al asignar rol', 'error');
        }
    };

    const crearConferencia = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/conferencias', {
                ...conferenciaForm, eventoId: Number(conferenciaForm.eventoId),
            });
            mostrar('Conferencia creada');
            setConferenciaEventoId(conferenciaForm.eventoId);
            setConferenciaForm({ titulo: '', descripcion: '', tipo: 'CHARLA', horario: '', eventoId: conferenciaForm.eventoId });
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al crear conferencia', 'error');
        }
    };

    const eliminarConferencia = async (id) => {
        try {
            await axiosClient.delete(`/conferencias/${id}`);
            mostrar('Conferencia eliminada');
            setConferencias((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al eliminar', 'error');
        }
    };

    const enviarComunicado = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/comunicados', {
                mensaje: comunicadoForm.mensaje, eventoId: Number(comunicadoForm.eventoId),
            });
            mostrar('Comunicado enviado');
            setComunicadoForm({ mensaje: '', eventoId: comunicadoForm.eventoId });
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al enviar comunicado', 'error');
        }
    };

    return (
        <section>
            <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Superadmin</span>
            <h2 className="font-display font-semibold text-xl mt-1 mb-4">Gestión general</h2>
            <Link to="/admin/editor-hotspots" className="inline-block mb-6 text-senal hover:text-senal-hover font-display font-medium">
                🎯 Abrir editor visual de hotspots ◣
            </Link>

            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Carrusel de portada del sitio</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                    {configSitio.imagenesPortada.map((url) => (
                        <div key={url} className="relative">
                            <img src={url} alt="" className="w-full aspect-video object-cover rounded-lg" />
                            <button
                                onClick={() => quitarImagenPortada(url)}
                                className="absolute top-1 right-1 bg-tinta/80 text-tinta text-xs w-6 h-6 rounded-full"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <SubirImagen etiqueta="Agregar imagen al carrusel" onSubido={agregarImagenPortada} />
            </div>
            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Evento destacado en la portada</h3>
                <select
                    value={configSitio.eventoDestacadoId || ''}
                    onChange={async (e) => {
                        const eventoId = Number(e.target.value);
                        try {
                            const { data } = await axiosClient.put('/configuracion/evento-destacado', { eventoId });
                            setConfigSitio(data);
                            mostrar('Evento destacado actualizado');
                        } catch (err) {
                            mostrar('Error al actualizar', 'error');
                        }
                    }}
                    className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal w-full"
                >
                    <option value="">Ninguno seleccionado</option>
                    {eventos.map((ev) => <option key={ev.id} value={ev.id}>{ev.nombre}</option>)}
                </select>
            </div>


            <div className="bg-superficie/50 rounded-2xl p-5 mb-4">
                <h3 className="font-display font-medium mb-3">
                    {eventoEditandoId ? 'Editar evento' : 'Crear evento'}
                </h3>
                <form onSubmit={guardarEvento} className="flex flex-col gap-3">
                    <Campo placeholder="Nombre" value={eventoForm.nombre}
                           onChange={(e) => setEventoForm({ ...eventoForm, nombre: e.target.value })} required />
                    <Campo placeholder="Descripción" value={eventoForm.descripcion}
                           onChange={(e) => setEventoForm({ ...eventoForm, descripcion: e.target.value })} />
                    <div className="flex gap-3">
                        <Campo type="datetime-local" value={eventoForm.fechaInicio}
                               onChange={(e) => setEventoForm({ ...eventoForm, fechaInicio: e.target.value })} required />
                        <Campo type="datetime-local" value={eventoForm.fechaFin}
                               onChange={(e) => setEventoForm({ ...eventoForm, fechaFin: e.target.value })} required />
                    </div>
                    <BotonSenal type="submit">{eventoEditandoId ? 'Guardar cambios' : 'Crear evento'}</BotonSenal>
                </form>
            </div>

            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Crear stand (y asignar dueño)</h3>
                <form onSubmit={crearStand} className="flex flex-col gap-3">
                    <Campo placeholder="Nombre" value={standForm.nombre}
                           onChange={(e) => setStandForm({ ...standForm, nombre: e.target.value })} required />
                    <Campo placeholder="Descripción" value={standForm.descripcion}
                           onChange={(e) => setStandForm({ ...standForm, descripcion: e.target.value })} />
                    <select value={standForm.eventoId} onChange={(e) => setStandForm({ ...standForm, eventoId: e.target.value })} required
                            className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal">
                        <option value="">Elegí un evento</option>
                        {eventos.map((ev) => <option key={ev.id} value={ev.id}>{ev.nombre} (#{ev.id})</option>)}
                    </select>
                    <Campo placeholder="Email del dueño (opcional)" type="email" value={standForm.propietarioEmail}
                           onChange={(e) => setStandForm({ ...standForm, propietarioEmail: e.target.value })} />
                    <BotonSenal type="submit">Crear stand</BotonSenal>
                </form>
            </div>

            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Crear buffet (y asignar dueño)</h3>
                <form onSubmit={crearBuffet} className="flex flex-col gap-3">
                    <select value={buffetForm.eventoId} onChange={(e) => setBuffetForm({ ...buffetForm, eventoId: e.target.value })} required
                            className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal">
                        <option value="">Elegí un evento</option>
                        {eventos.map((ev) => <option key={ev.id} value={ev.id}>{ev.nombre} (#{ev.id})</option>)}
                    </select>
                    <Campo placeholder="Email del dueño (opcional)" type="email" value={buffetForm.propietarioEmail}
                           onChange={(e) => setBuffetForm({ ...buffetForm, propietarioEmail: e.target.value })} />
                    <BotonSenal type="submit">Crear buffet</BotonSenal>
                </form>
            </div>

            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Eventos (borrar los vencidos)</h3>
                <ul className="flex flex-col gap-2">
                    {todosLosEventos.map((ev) => (
                        <li key={ev.id} className="flex items-center justify-between font-mono text-sm bg-fondo rounded-lg px-3 py-2">
                            {ev.nombre} (#{ev.id})
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEventoEditandoId(ev.id);
                                        setEventoForm({ nombre: ev.nombre, descripcion: ev.descripcion, fechaInicio: ev.fechaInicio, fechaFin: ev.fechaFin });
                                    }}
                                    className="text-xs text-senal"
                                >
                                    Editar
                                </button>
                                <button onClick={() => borrarEvento(ev.id)} className="text-xs text-tinta/40 hover:text-red-600">Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Eliminar hotspots (círculos y flechas mal ubicados)</h3>
                <select value={hotspotEventoIdBorrar} onChange={(e) => { setHotspotEventoIdBorrar(e.target.value); setPanoramaBorrarId(''); }}
                        className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal mb-3 w-full">
                    <option value="">Elegí un evento</option>
                    {eventos.map((ev) => <option key={ev.id} value={ev.id}>{ev.nombre}</option>)}
                </select>
                <select value={panoramaBorrarId} onChange={(e) => setPanoramaBorrarId(e.target.value)}
                        className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal mb-3 w-full">
                    <option value="">Elegí un panorama</option>
                    {panoramasParaBorrar.map((p) => <option key={p.id} value={p.id}>{p.nombre} (#{p.id})</option>)}
                </select>
                <ul className="flex flex-col gap-2">
                    {hotspotsParaBorrar.map((h) => (
                        <li key={h.id} className="flex items-center justify-between font-mono text-sm bg-fondo rounded-lg px-3 py-2">
                            #{h.id} · {h.tipo} {h.tipo === 'NAVEGACION' ? `→ panorama ${h.panoramaDestinoId}` : `→ stand ${h.standId}`}
                            <button onClick={() => borrarHotspot(h.id)} className="text-xs text-tinta/40 hover:text-red-600">Eliminar</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Agregar panorama al recorrido</h3>
                <form onSubmit={crearPanorama} className="flex flex-col gap-3">
                    <Campo placeholder="Nombre (ej: Pasillo salud)" value={panoramaForm.nombre}
                           onChange={(e) => setPanoramaForm({ ...panoramaForm, nombre: e.target.value })} required />

                    <select
                        value={panoramaForm.eventoId}
                        onChange={(e) => setPanoramaForm({ ...panoramaForm, eventoId: e.target.value })}
                        required
                        className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal"
                    >
                        <option value="">Elegí un evento</option>
                        {eventos.map((ev) => (
                            <option key={ev.id} value={ev.id}>{ev.nombre} (#{ev.id})</option>
                        ))}
                    </select>

                    <SubirImagen etiqueta="Imagen 360 (equirectangular)"
                                 onSubido={(url) => setPanoramaForm({ ...panoramaForm, imagenUrl: url })} />
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={panoramaForm.esPuntoInicio}
                               onChange={(e) => setPanoramaForm({ ...panoramaForm, esPuntoInicio: e.target.checked })} />
                        Es el punto de inicio del recorrido
                    </label>
                    <BotonSenal type="submit" disabled={!panoramaForm.imagenUrl}>Crear panorama</BotonSenal>
                </form>
            </div>

            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Conectar panoramas (flechas y stands)</h3>
                <form onSubmit={crearHotspot} className="flex flex-col gap-3">
                    <select
                        value={hotspotEventoId}
                        onChange={(e) => setHotspotEventoId(e.target.value)}
                        className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal"
                    >
                        <option value="">Elegí el evento</option>
                        {eventos.map((ev) => (
                            <option key={ev.id} value={ev.id}>{ev.nombre} (#{ev.id})</option>
                        ))}
                    </select>

                    <select
                        value={hotspotForm.panoramaOrigenId}
                        onChange={(e) => setHotspotForm({ ...hotspotForm, panoramaOrigenId: e.target.value })}
                        required
                        className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal"
                    >
                        <option value="">Panorama origen (desde dónde se ve el hotspot)</option>
                        {panoramasDelEvento.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>

                    <select value={hotspotForm.tipo} onChange={(e) => setHotspotForm({ ...hotspotForm, tipo: e.target.value })}
                            className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal">
                        <option value="NAVEGACION">Flecha de navegación (mover a otro panorama)</option>
                        <option value="STAND">Círculo de stand (abrir ficha del stand)</option>
                    </select>

                    {hotspotForm.tipo === 'NAVEGACION' ? (
                        <select
                            value={hotspotForm.panoramaDestinoId}
                            onChange={(e) => setHotspotForm({ ...hotspotForm, panoramaDestinoId: e.target.value })}
                            required
                            className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal"
                        >
                            <option value="">Panorama destino (a dónde te lleva la flecha)</option>
                            {panoramasDelEvento.map((p) => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </select>
                    ) : (
                        <select
                            value={hotspotForm.standId}
                            onChange={(e) => setHotspotForm({ ...hotspotForm, standId: e.target.value })}
                            required
                            className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal"
                        >
                            <option value="">Elegí el stand</option>
                            {standsDelEvento.map((s) => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                        </select>
                    )}

                    <div className="flex gap-3">
                        <Campo placeholder="Yaw (0-360)" type="number" value={hotspotForm.yaw}
                               onChange={(e) => setHotspotForm({ ...hotspotForm, yaw: e.target.value })} required />
                        <Campo placeholder="Pitch (-90 a 90)" type="number" value={hotspotForm.pitch}
                               onChange={(e) => setHotspotForm({ ...hotspotForm, pitch: e.target.value })} required />
                    </div>
                    <BotonSenal type="submit">Crear hotspot</BotonSenal>
                </form>
            </div>

            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Crear entrada</h3>
                <form onSubmit={crearEntrada} className="flex flex-col gap-3">
                    <Campo placeholder="Nombre (ej: Entrada general)" value={entradaForm.nombre}
                           onChange={(e) => setEntradaForm({ ...entradaForm, nombre: e.target.value })} required />
                    <Campo placeholder="Precio" type="number" value={entradaForm.precio}
                           onChange={(e) => setEntradaForm({ ...entradaForm, precio: e.target.value })} required />
                    <Campo placeholder="Descripción" value={entradaForm.descripcion}
                           onChange={(e) => setEntradaForm({ ...entradaForm, descripcion: e.target.value })} />
                    <select value={entradaForm.eventoId} onChange={(e) => setEntradaForm({ ...entradaForm, eventoId: e.target.value })} required
                            className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal">
                        <option value="">Elegí un evento</option>
                        {eventos.map((ev) => <option key={ev.id} value={ev.id}>{ev.nombre} (#{ev.id})</option>)}
                    </select>
                    <BotonSenal type="submit">Crear entrada</BotonSenal>
                </form>
            </div>

            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Entradas cargadas</h3>
                {entradas.length === 0 && <p className="text-sm text-tinta/60">Todavía no hay entradas.</p>}
                <ul className="flex flex-col gap-2">
                    {entradas.map((e) => (
                        <li key={e.id} className="font-mono text-sm bg-fondo rounded-lg px-3 py-2">
                            {entradaEditandoId === e.id ? (
                                <div className="flex flex-col gap-2">
                                    <Campo value={entradaForm.nombre} onChange={(ev) => setEntradaForm({ ...entradaForm, nombre: ev.target.value })} />
                                    <Campo type="number" value={entradaForm.precio} onChange={(ev) => setEntradaForm({ ...entradaForm, precio: ev.target.value })} />
                                    <div className="flex gap-2">
                                        <BotonSenal type="button" onClick={() => guardarEdicionEntrada(e.id)}>Guardar</BotonSenal>
                                        <button onClick={() => setEntradaEditandoId(null)} className="text-xs text-tinta/50">Cancelar</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    {e.nombre} — ${e.precio}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEntradaEditandoId(e.id); setEntradaForm({ nombre: e.nombre, precio: e.precio, descripcion: e.descripcion, eventoId: e.eventoId }); }}
                                            className="text-xs text-senal"
                                        >
                                            Editar
                                        </button>
                                        <button onClick={() => eliminarEntrada(e.id)} className="text-xs text-tinta/40 hover:text-red-600">Eliminar</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Crear conferencia / actividad de escenario</h3>
                <form onSubmit={crearConferencia} className="flex flex-col gap-3">
                    <select value={conferenciaForm.eventoId}
                            onChange={(e) => { setConferenciaForm({ ...conferenciaForm, eventoId: e.target.value }); setConferenciaEventoId(e.target.value); }}
                            required className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal">
                        <option value="">Elegí un evento</option>
                        {eventos.map((ev) => <option key={ev.id} value={ev.id}>{ev.nombre} (#{ev.id})</option>)}
                    </select>
                    <Campo placeholder="Título" value={conferenciaForm.titulo}
                           onChange={(e) => setConferenciaForm({ ...conferenciaForm, titulo: e.target.value })} required />
                    <Campo placeholder="Descripción" value={conferenciaForm.descripcion}
                           onChange={(e) => setConferenciaForm({ ...conferenciaForm, descripcion: e.target.value })} />
                    <select value={conferenciaForm.tipo} onChange={(e) => setConferenciaForm({ ...conferenciaForm, tipo: e.target.value })}
                            className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal">
                        <option value="CHARLA">Charla</option>
                        <option value="MUESTRA_ARTISTICA">Muestra artística</option>
                        <option value="MUESTRA_PRODUCTO">Muestra de producto</option>
                        <option value="OTRO">Otro</option>
                    </select>
                    <Campo type="datetime-local" value={conferenciaForm.horario}
                           onChange={(e) => setConferenciaForm({ ...conferenciaForm, horario: e.target.value })} required />
                    <BotonSenal type="submit">Crear</BotonSenal>
                </form>

                {conferencias.length > 0 && (
                    <ul className="flex flex-col gap-2 mt-4">
                        {conferencias.map((c) => (
                            <li key={c.id} className="flex items-center justify-between font-mono text-sm bg-fondo rounded-lg px-3 py-2">
                                {c.titulo} — {new Date(c.horario).toLocaleString()}
                                <button onClick={() => eliminarConferencia(c.id)} className="text-xs text-tinta/40 hover:text-red-600">Eliminar</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Enviar comunicado a stands/buffet</h3>
                <form onSubmit={enviarComunicado} className="flex flex-col gap-3">
                    <select value={comunicadoForm.eventoId} onChange={(e) => setComunicadoForm({ ...comunicadoForm, eventoId: e.target.value })}
                            required className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal">
                        <option value="">Elegí un evento</option>
                        {eventos.map((ev) => <option key={ev.id} value={ev.id}>{ev.nombre} (#{ev.id})</option>)}
                    </select>
                    <textarea
                        placeholder="Mensaje"
                        value={comunicadoForm.mensaje}
                        onChange={(e) => setComunicadoForm({ ...comunicadoForm, mensaje: e.target.value })}
                        required
                        rows={3}
                        className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal resize-none"
                    />
                    <BotonSenal type="submit">Enviar</BotonSenal>
                </form>
            </div>

            <div className="bg-superficie/50 rounded-2xl p-5 mt-4">
                <h3 className="font-display font-medium mb-3">Asignar rol a usuario</h3>
                <form onSubmit={asignarRol} className="flex flex-col gap-3">
                    <Campo placeholder="Email del usuario" type="email" value={rolForm.usuarioEmail}
                           onChange={(e) => setRolForm({ ...rolForm, usuarioEmail: e.target.value })} required />
                    <select
                        value={rolForm.nombreRol}
                        onChange={(e) => setRolForm({ ...rolForm, nombreRol: e.target.value })}
                        className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal"
                    >
                        <option value="ROLE_DUENIO_STAND">Dueño de Stand</option>
                        <option value="ROLE_EMPLEADO_STAND">Empleado de Stand</option>
                        <option value="ROLE_DUENIO_BUFFET">Dueño de Buffet</option>
                        <option value="ROLE_EMPLEADO_BUFFET">Empleado de Buffet</option>
                    </select>
                    <BotonSenal type="submit">Asignar</BotonSenal>
                </form>
            </div>
        </section>
    );
}

export default AdminSuperadmin;