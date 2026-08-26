import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/markers-plugin/index.css';
import axiosClient from '../api/axiosClient';

function RecorridoVirtual({ eventoId, onAbrirStand }) {
    const [panoramaActual, setPanoramaActual] = useState(null);
    const [hotspots, setHotspots] = useState([]);
    const [markersPlugin, setMarkersPlugin] = useState(null);

    useEffect(() => {
        axiosClient.get(`/panoramas/evento/${eventoId}/inicio`)
            .then((res) => setPanoramaActual(res.data))
            .catch(() => console.error('Este evento no tiene un punto de inicio configurado'));
    }, [eventoId]);

    useEffect(() => {
        if (!panoramaActual) return;
        axiosClient.get(`/hotspots/panorama/${panoramaActual.id}`)
            .then((res) => {
                console.log('Hotspots recibidos:', res.data);
                setHotspots(res.data);
            });
    }, [panoramaActual]);

    const irAPanorama = useCallback((panoramaId, panoramaUrl, panoramaNombre) => {
        setPanoramaActual({ id: panoramaId, imagenUrl: panoramaUrl, nombre: panoramaNombre });
    }, []);

    const handleReady = (instance) => {
        setMarkersPlugin(instance.getPlugin(MarkersPlugin));
    };

    useEffect(() => {
        if (!markersPlugin) return;

        markersPlugin.clearMarkers();

        hotspots.forEach((h) => {
            const esNavegacion = h.tipo === 'NAVEGACION';
            const html = esNavegacion
                ? `<div style="width:42px;height:42px;border-radius:9999px;background:#2447D1;border:3px solid #F5F6F2;display:flex;align-items:center;justify-content:center;color:#F5F6F2;font-size:18px;font-weight:bold;box-shadow:0 2px 10px rgba(0,0,0,0.5);cursor:pointer;">➜</div>`
                : `<div style="width:42px;height:42px;border-radius:9999px;background:#FFB020;border:3px solid #F5F6F2;display:flex;align-items:center;justify-content:center;color:#14181C;font-size:20px;box-shadow:0 2px 10px rgba(0,0,0,0.5);cursor:pointer;">●</div>`;

            markersPlugin.addMarker({
                id: `hotspot-${h.id}`,
                position: { yaw: `${h.yaw}deg`, pitch: `${h.pitch}deg` },
                html,
                anchor: 'center center',
                size: { width: 42, height: 42 },
                tooltip: esNavegacion ? 'Seguir recorriendo' : 'Ver stand',
                data: h,
            });
        });

        const handleSelectMarker = (e) => {
            const hotspot = e.marker.config.data;
            if (hotspot.tipo === 'NAVEGACION') {
                axiosClient.get(`/panoramas/evento/${eventoId}`)
                    .then((res) => {
                        const destino = res.data.find((p) => p.id === hotspot.panoramaDestinoId);
                        if (destino) irAPanorama(destino.id, destino.imagenUrl, destino.nombre);
                    });
            } else if (hotspot.tipo === 'STAND') {
                onAbrirStand(hotspot.standId);
            }
        };

        markersPlugin.addEventListener('select-marker', handleSelectMarker);
        return () => markersPlugin.removeEventListener('select-marker', handleSelectMarker);
    }, [hotspots, markersPlugin, eventoId, irAPanorama, onAbrirStand]);

    if (!panoramaActual) {
        return (
            <div className="h-[calc(100dvh-73px)] bg-fondo flex items-center justify-center">
                <p className="font-mono text-tinta/50 text-sm">Cargando recorrido...</p>
            </div>
        );
    }

    return (
        <div className="relative bg-fondo h-[calc(100dvh-73px)] overflow-hidden">
            <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-fondo/90 to-transparent pointer-events-none">
                <Link
                    to={`/tienda/${eventoId}`}
                    className="pointer-events-auto bg-senal hover:bg-senal-hover text-tinta font-display font-medium text-sm px-5 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
                >
                    🛍️ Ir a la tienda
                </Link>

                <span className="pointer-events-auto font-mono text-xs text-tinta bg-tinta/60 backdrop-blur px-5 py-2.5 rounded-full tracking-widest uppercase">
                    {panoramaActual.nombre}
                </span>

                <span className="w-[140px]" />
            </div>

            <ReactPhotoSphereViewer
                key={panoramaActual.id}
                src={panoramaActual.imagenUrl}
                height="100%"
                width="100%"
                plugins={[[MarkersPlugin, { markers: [] }]]}
                onReady={handleReady}
            />
        </div>
    );
}

export default RecorridoVirtual;