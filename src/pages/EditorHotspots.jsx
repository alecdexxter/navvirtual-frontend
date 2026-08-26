import { useEffect, useState } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/markers-plugin/index.css';
import axiosClient from '../api/axiosClient';
import { useToast } from '../context/ToastContext';

function EditorHotspots() {
    const [eventos, setEventos] = useState([]);
    const [eventoId, setEventoId] = useState('');
    const [panoramas, setPanoramas] = useState([]);
    const [panoramaId, setPanoramaId] = useState('');
    const [panoramaActivo, setPanoramaActivo] = useState(null);
    const [stands, setStands] = useState([]);
    const [hotspots, setHotspots] = useState([]);
    const [markersPlugin, setMarkersPlugin] = useState(null);
    const [pendiente, setPendiente] = useState(null); // { yaw, pitch }
    const [tipoNuevo, setTipoNuevo] = useState('NAVEGACION');
    const [destinoNuevo, setDestinoNuevo] = useState('');
    const { mostrar } = useToast();

    useEffect(() => {
        axiosClient.get('/eventos/todos').then((res) => setEventos(res.data));
    }, []);

    useEffect(() => {
        if (!eventoId) { setPanoramas([]); setStands([]); return; }
        axiosClient.get(`/panoramas/evento/${eventoId}`).then((res) => setPanoramas(res.data));
        axiosClient.get(`/stands/evento/${eventoId}`).then((res) => setStands(res.data));
        setPanoramaId('');
        setPanoramaActivo(null);
    }, [eventoId]);

    useEffect(() => {
        if (!panoramaId) { setPanoramaActivo(null); return; }
        const p = panoramas.find((x) => x.id === Number(panoramaId));
        setPanoramaActivo(p || null);
        setPendiente(null);
    }, [panoramaId, panoramas]);

    const cargarHotspots = () => {
        if (!panoramaId) return;
        axiosClient.get(`/hotspots/panorama/${panoramaId}`).then((res) => setHotspots(res.data));
    };

    useEffect(() => {
        cargarHotspots();
    }, [panoramaId]);

    const handleReady = (instance) => {
        const plugin = instance.getPlugin(MarkersPlugin);
        setMarkersPlugin(plugin);

        instance.addEventListener('click', (e) => {
            const yawRad = e.data.yaw;
            const pitchRad = e.data.pitch;
            let yawDeg = (yawRad * 180) / Math.PI;
            const pitchDeg = (pitchRad * 180) / Math.PI;
            yawDeg = ((yawDeg % 360) + 360) % 360; // normalizar a 0-360
            setPendiente({ yaw: Math.round(yawDeg * 10) / 10, pitch: Math.round(pitchDeg * 10) / 10 });
        });
    };

    // Redibuja marcadores existentes + el marcador "pendiente" cada vez que cambian
    useEffect(() => {
        if (!markersPlugin) return;
        markersPlugin.clearMarkers();

        hotspots.forEach((h) => {
            const esNavegacion = h.tipo === 'NAVEGACION';
            markersPlugin.addMarker({
                id: `hotspot-${h.id}`,
                position: { yaw: `${h.yaw}deg`, pitch: `${h.pitch}deg` },
                html: `<div style="width:38px;height:38px;border-radius:9999px;background:${esNavegacion ? '#2447D1' : '#FFB020'};border:3px solid #F5F6F2;box-shadow:0 2px 8px rgba(0,0,0,0.5);"></div>`,
                anchor: 'center center',
                tooltip: `#${h.id} · ${h.tipo}`,
            });
        });

        if (pendiente) {
            markersPlugin.addMarker({
                id: 'pendiente',
                position: { yaw: `${pendiente.yaw}deg`, pitch: `${pendiente.pitch}deg` },
                html: `<div style="width:38px;height:38px;border-radius:9999px;background:#1F9D55;border:3px solid #F5F6F2;box-shadow:0 0 0 6px rgba(31,157,85,0.3);"></div>`,
                anchor: 'center center',
            });
        }
    }, [hotspots, pendiente, markersPlugin]);

    const guardarHotspot = async () => {
        if (!pendiente) return;
        try {
            await axiosClient.post('/hotspots', {
                panoramaOrigenId: Number(panoramaId),
                panoramaDestinoId: tipoNuevo === 'NAVEGACION' ? Number(destinoNuevo) : null,
                standId: tipoNuevo === 'STAND' ? Number(destinoNuevo) : null,
                tipo: tipoNuevo,
                yaw: pendiente.yaw,
                pitch: pendiente.pitch,
            });
            mostrar('Hotspot creado');
            setPendiente(null);
            setDestinoNuevo('');
            cargarHotspots();
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al crear hotspot', 'error');
        }
    };

    const eliminarHotspot = async (id) => {
        try {
            await axiosClient.delete(`/hotspots/${id}`);
            mostrar('Hotspot eliminado');
            cargarHotspots();
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al eliminar', 'error');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Editor visual</span>
            <h1 className="font-display font-bold text-3xl mt-2 mb-6">Ubicar hotspots</h1>

            <div className="flex gap-3 mb-6">
                <select value={eventoId} onChange={(e) => setEventoId(e.target.value)}
                        className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal">
                    <option value="">Elegí un evento</option>
                    {eventos.map((ev) => <option key={ev.id} value={ev.id}>{ev.nombre}</option>)}
                </select>

                <select value={panoramaId} onChange={(e) => setPanoramaId(e.target.value)} disabled={!eventoId}
                        className="bg-superficie rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-senal">
                    <option value="">Elegí un panorama</option>
                    {panoramas.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
            </div>

            {panoramaActivo && (
                <>
                    <p className="text-sm text-tinta/60 mb-3">
                        Hacé click directo sobre la imagen donde querés poner el hotspot (círculo verde = pendiente de guardar).
                    </p>
                    <div className="rounded-2xl overflow-hidden mb-6">
                        <ReactPhotoSphereViewer
                            key={panoramaActivo.id}
                            src={panoramaActivo.imagenUrl}
                            height="500px"
                            width="100%"
                            plugins={[[MarkersPlugin, { markers: [] }]]}
                            onReady={handleReady}
                        />
                    </div>

                    {pendiente && (
                        <div className="bg-superficie/50 rounded-2xl p-5 mb-6">
                            <p className="font-mono text-sm mb-3">
                                Posición capturada: yaw {pendiente.yaw}° · pitch {pendiente.pitch}°
                            </p>
                            <div className="flex gap-3 flex-wrap items-center">
                                <select value={tipoNuevo} onChange={(e) => { setTipoNuevo(e.target.value); setDestinoNuevo(''); }}
                                        className="bg-fondo rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-senal">
                                    <option value="NAVEGACION">Flecha (ir a otro panorama)</option>
                                    <option value="STAND">Círculo de stand</option>
                                </select>

                                {tipoNuevo === 'NAVEGACION' ? (
                                    <select value={destinoNuevo} onChange={(e) => setDestinoNuevo(e.target.value)}
                                            className="bg-fondo rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-senal">
                                        <option value="">Panorama destino</option>
                                        {panoramas.filter((p) => p.id !== panoramaActivo.id).map((p) => (
                                            <option key={p.id} value={p.id}>{p.nombre}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <select value={destinoNuevo} onChange={(e) => setDestinoNuevo(e.target.value)}
                                            className="bg-fondo rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-senal">
                                        <option value="">Stand</option>
                                        {stands.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                                    </select>
                                )}

                                <button onClick={guardarHotspot} disabled={!destinoNuevo}
                                        className="bg-senal hover:bg-senal-hover text-tinta font-display font-medium px-5 py-2 rounded-full transition-colors disabled:opacity-50">
                                    Guardar hotspot
                                </button>
                                <button onClick={() => setPendiente(null)} className="text-sm text-tinta/50">Cancelar</button>
                            </div>
                        </div>
                    )}

                    <h3 className="font-display font-medium mb-3">Hotspots en este panorama</h3>
                    {hotspots.length === 0 && <p className="text-sm text-tinta/60">Todavía no hay ninguno.</p>}
                    <ul className="flex flex-col gap-2">
                        {hotspots.map((h) => (
                            <li key={h.id} className="flex items-center justify-between font-mono text-sm bg-superficie rounded-lg px-3 py-2">
                                #{h.id} · {h.tipo} · yaw {h.yaw}° pitch {h.pitch}°
                                <button onClick={() => eliminarHotspot(h.id)} className="text-xs text-tinta/40 hover:text-red-600">Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default EditorHotspots;