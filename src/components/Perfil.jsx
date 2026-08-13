import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import SubirImagen from './ui/SubirImagen';
import Campo from './ui/Campo';
import BotonSenal from './ui/BotonSenal';
import { useToast } from '../context/ToastContext';

function Perfil() {
    const [perfil, setPerfil] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const { mostrar } = useToast();

    useEffect(() => {
        axiosClient.get('/usuarios/perfil').then((res) => {
            setPerfil(res.data);
            setNombre(res.data.nombre);
            setApellido(res.data.apellido);
        });
    }, []);

    const guardar = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axiosClient.put('/usuarios/perfil', { nombre, apellido });
            setPerfil(data);
            mostrar('Perfil actualizado');
        } catch (err) {
            mostrar('Error al actualizar el perfil', 'error');
        }
    };

    const subirFoto = async (url) => {
        try {
            const { data } = await axiosClient.put('/usuarios/perfil', { fotoPerfilUrl: url });
            setPerfil(data);
            mostrar('Foto actualizada');
        } catch (err) {
            mostrar('Error al actualizar la foto', 'error');
        }
    };

    if (!perfil) return <p className="text-tinta/60">Cargando...</p>;

    return (
        <section>
            <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Mi cuenta</span>
            <h2 className="font-display font-semibold text-xl mt-1 mb-4">Perfil</h2>

            <div className="bg-superficie/50 rounded-2xl p-5 flex flex-col gap-4">
                <SubirImagen valorActual={perfil.fotoPerfilUrl} etiqueta="Foto de perfil" onSubido={subirFoto} />
                <form onSubmit={guardar} className="flex flex-col gap-3">
                    <Campo placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    <Campo placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                    <p className="font-mono text-xs text-tinta/50">{perfil.email}</p>
                    <BotonSenal type="submit">Guardar</BotonSenal>
                </form>
            </div>
        </section>
    );
}

export default Perfil;