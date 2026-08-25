import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import Campo from './ui/Campo';
import BotonSenal from './ui/BotonSenal';
import SubirImagen from './ui/SubirImagen';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import SubirVideo from './ui/SubirVideo';

function AdminStand() {
    const [stands, setStands] = useState([]);
    const [standActivo, setStandActivo] = useState(null);
    const [comunicados, setComunicados] = useState([]);
    const [productoForm, setProductoForm] = useState({ nombre: '', precio: '', descripcion: '', imagenUrl: '' });
    const [preguntaForm, setPreguntaForm] = useState({ texto: '', opciones: [{ texto: '', esCorrecta: true }, { texto: '', esCorrecta: false }] });
    const [emailEmpleado, setEmailEmpleado] = useState('');
    const { mostrar } = useToast();
    const { usuario } = useAuth();
    const [productos, setProductos] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [editForm, setEditForm] = useState({ nombre: '', precio: '', descripcion: '' });
    const [preguntas, setPreguntas] = useState([]);

    const esDueno = standActivo && standActivo.propietarioId === usuario?.id;

    useEffect(() => {
        if (!standActivo) return;
        axiosClient.get(`/comunicados/evento/${standActivo.eventoId}`).then((res) => setComunicados(res.data));
    }, [standActivo]);

    useEffect(() => {
        if (!standActivo) return;
        axiosClient.get(`/productos/stand/${standActivo.id}`).then((res) => setProductos(res.data));
    }, [standActivo]);

    useEffect(() => {
        if (!standActivo) return;
        axiosClient.get(`/preguntas/stand/${standActivo.id}`).then((res) => setPreguntas(res.data));
    }, [standActivo]);

    useEffect(() => {
        axiosClient.get('/stands/mis-stands').then((res) => setStands(res.data));
    }, []);

    const refrescar = async () => {
        const { data } = await axiosClient.get('/stands/mis-stands');
        setStands(data);
        setStandActivo((prev) => data.find((s) => s.id === prev.id));
    };

    const crearProducto = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/productos', {
                nombre: productoForm.nombre, precio: Number(productoForm.precio),
                descripcion: productoForm.descripcion, imagenUrl: productoForm.imagenUrl,
                categoria: 'STAND', standId: standActivo.id,
            });
            mostrar('Producto agregado');
            setProductoForm({ nombre: '', precio: '', descripcion: '', imagenUrl: '' });
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al agregar producto', 'error');
        }
        const { data } = await axiosClient.get(`/productos/stand/${standActivo.id}`);
        setProductos(data);
    };

    const eliminarProducto = async (id) => {
        try {
            await axiosClient.delete(`/productos/${id}`);
            mostrar('Producto eliminado');
            setProductos((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al eliminar', 'error');
        }
    };

    const guardarEdicion = async (id) => {
        try {
            await axiosClient.put(`/productos/${id}`, {
                nombre: editForm.nombre, precio: Number(editForm.precio),
                descripcion: editForm.descripcion, categoria: 'STAND', standId: standActivo.id,
            });
            mostrar('Producto actualizado');
            setEditandoId(null);
            const { data } = await axiosClient.get(`/productos/stand/${standActivo.id}`);
            setProductos(data);
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al actualizar', 'error');
        }
    };

    const actualizarPortada = async (url) => {
        try {
            await axiosClient.put(`/stands/${standActivo.id}`, {
                nombre: standActivo.nombre,
                descripcion: standActivo.descripcion,
                imagenPortadaUrl: url,
                videoUrl: standActivo.videoUrl,
                eventoId: standActivo.eventoId,
            });
            mostrar('Portada actualizada');
            await refrescar();
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al actualizar la portada', 'error');
        }
    };

    const crearPregunta = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/preguntas', {
                standId: standActivo.id, texto: preguntaForm.texto, opciones: preguntaForm.opciones,
            });
            mostrar('Pregunta de trivia agregada');
            setPreguntaForm({ texto: '', opciones: [{ texto: '', esCorrecta: true }, { texto: '', esCorrecta: false }] });
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al agregar pregunta', 'error');
        }
        const { data } = await axiosClient.get(`/preguntas/stand/${standActivo.id}`);
        setPreguntas(data);
    };

    const eliminarPregunta = async (id) => {
        try {
            await axiosClient.delete(`/preguntas/${id}`);
            mostrar('Pregunta eliminada');
            setPreguntas((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al eliminar', 'error');
        }
    };

    const agregarEmpleado = async (e) => {
        e.preventDefault();
        try {
            const { data: usuarioEncontrado } = await axiosClient.get('/usuarios/buscar', { params: { email: emailEmpleado } });
            await axiosClient.post(`/stands/${standActivo.id}/empleados/${usuarioEncontrado.id}`);
            mostrar(`${usuarioEncontrado.nombre} agregado como empleado`);
            setEmailEmpleado('');
            await refrescar();
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al agregar empleado', 'error');
        }
    };

    const quitarEmpleado = async (usuarioId) => {
        try {
            await axiosClient.delete(`/stands/${standActivo.id}/empleados/${usuarioId}`);
            mostrar('Empleado quitado');
            await refrescar();
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al quitar empleado', 'error');
        }
    };

    if (stands.length === 0) {
        return <p className="text-tinta/60">No sos dueño ni empleado de ningún stand todavía.</p>;
    }

    return (
        <section>
            <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Stands</span>
            <h2 className="font-display font-semibold text-xl mt-1 mb-4">Mis stands</h2>

            <div className="flex gap-2 mb-6 flex-wrap">
                {stands.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setStandActivo(s)}
                        className={`font-display text-sm px-4 py-2 rounded-full transition-colors ${standActivo?.id === s.id ? 'bg-tinta text-fondo' : 'bg-superficie hover:bg-tinta/10'}`}
                    >
                        {s.nombre}
                    </button>
                ))}
            </div>

            {standActivo && (
                <div className="flex flex-col gap-4">
                    <h3 className="font-display font-medium">Gestionando: {standActivo.nombre}</h3>

                    {comunicados.length > 0 && (
                        <div className="bg-ambar/20 rounded-2xl p-5">
                            <h4 className="font-display font-medium mb-3">📢 Comunicados del organizador</h4>
                            <div className="flex flex-col gap-2">
                                {comunicados.map((c) => (
                                    <div key={c.id} className="bg-fondo rounded-lg px-3 py-2">
                                        <p className="text-sm">{c.mensaje}</p>
                                        <p className="font-mono text-xs text-tinta/50 mt-1">{c.gerenteNombre} · {new Date(c.fecha).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-superficie/50 rounded-2xl p-5">
                        <h4 className="font-display font-medium mb-3">Foto de portada del stand</h4>
                        <SubirImagen
                            valorActual={standActivo.imagenPortadaUrl}
                            etiqueta="Portada"
                            onSubido={actualizarPortada}
                        />
                    </div>
                    <div className="bg-superficie/50 rounded-2xl p-5">
                        <h4 className="font-display font-medium mb-3">Video del stand</h4>
                        <SubirVideo
                            valorActual={standActivo.videoUrl}
                            etiqueta="Video de presentación"
                            onSubido={async (url) => {
                                await axiosClient.put(`/stands/${standActivo.id}`, {
                                    nombre: standActivo.nombre, descripcion: standActivo.descripcion,
                                    imagenPortadaUrl: standActivo.imagenPortadaUrl, videoUrl: url, eventoId: standActivo.eventoId,
                                });
                                mostrar('Video actualizado');
                                await refrescar();
                            }}
                        />
                    </div>

                    <div className="bg-superficie/50 rounded-2xl p-5">
                        <h4 className="font-display font-medium mb-3">Agregar producto</h4>
                        <form onSubmit={crearProducto} className="flex flex-col gap-3">
                            <Campo placeholder="Nombre" value={productoForm.nombre}
                                   onChange={(e) => setProductoForm({ ...productoForm, nombre: e.target.value })} required />
                            <Campo placeholder="Precio" type="number" value={productoForm.precio}
                                   onChange={(e) => setProductoForm({ ...productoForm, precio: e.target.value })} required />
                            <Campo placeholder="Descripción" value={productoForm.descripcion}
                                   onChange={(e) => setProductoForm({ ...productoForm, descripcion: e.target.value })} />
                            <SubirImagen
                                etiqueta="Foto del producto"
                                onSubido={(url) => setProductoForm({ ...productoForm, imagenUrl: url })}
                            />
                            <BotonSenal type="submit" disabled={!productoForm.imagenUrl}>Agregar</BotonSenal>
                        </form>
                    </div>

                    <div className="bg-superficie/50 rounded-2xl p-5">
                        <h4 className="font-display font-medium mb-3">Productos cargados</h4>
                        <ul className="flex flex-col gap-2">
                            {productos.map((p) => (
                                <li key={p.id} className="bg-fondo rounded-lg px-3 py-2">
                                    {editandoId === p.id ? (
                                        <div className="flex flex-col gap-2">
                                            <Campo value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} />
                                            <Campo type="number" value={editForm.precio} onChange={(e) => setEditForm({ ...editForm, precio: e.target.value })} />
                                            <div className="flex gap-2">
                                                <BotonSenal onClick={() => guardarEdicion(p.id)}>Guardar</BotonSenal>
                                                <button onClick={() => setEditandoId(null)} className="text-sm text-tinta/50">Cancelar</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between font-mono text-sm">
                                            {p.nombre} — ${p.precio}
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditandoId(p.id); setEditForm({ nombre: p.nombre, precio: p.precio, descripcion: p.descripcion }); }}
                                                        className="text-xs text-senal">Editar</button>
                                                <button onClick={() => eliminarProducto(p.id)} className="text-xs text-tinta/40 hover:text-red-600">Eliminar</button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-superficie/50 rounded-2xl p-5">
                        <h4 className="font-display font-medium mb-3">Agregar pregunta de trivia</h4>
                        <form onSubmit={crearPregunta} className="flex flex-col gap-3">
                            <Campo placeholder="Pregunta" value={preguntaForm.texto}
                                   onChange={(e) => setPreguntaForm({ ...preguntaForm, texto: e.target.value })} required />
                            {preguntaForm.opciones.map((op, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Campo
                                        placeholder={`Opción ${i + 1}`}
                                        value={op.texto}
                                        onChange={(e) => {
                                            const nuevas = [...preguntaForm.opciones];
                                            nuevas[i].texto = e.target.value;
                                            setPreguntaForm({ ...preguntaForm, opciones: nuevas });
                                        }}
                                        required
                                    />
                                    <label className="flex items-center gap-1 text-sm text-tinta/60 shrink-0">
                                        <input
                                            type="radio"
                                            name="correcta"
                                            checked={op.esCorrecta}
                                            onChange={() => {
                                                const nuevas = preguntaForm.opciones.map((o, j) => ({ ...o, esCorrecta: j === i }));
                                                setPreguntaForm({ ...preguntaForm, opciones: nuevas });
                                            }}
                                        />
                                        Correcta
                                    </label>
                                </div>
                            ))}
                            <BotonSenal type="submit">Agregar pregunta</BotonSenal>
                        </form>
                    </div>

                    <div className="bg-superficie/50 rounded-2xl p-5">
                        <h4 className="font-display font-medium mb-3">Preguntas cargadas</h4>
                        {preguntas.length === 0 && <p className="text-sm text-tinta/60">Todavía no hay preguntas.</p>}
                        <ul className="flex flex-col gap-2">
                            {preguntas.map((p) => (
                                <li key={p.id} className="flex items-center justify-between font-mono text-sm bg-fondo rounded-lg px-3 py-2">
                                    {p.texto}
                                    <button onClick={() => eliminarPregunta(p.id)} className="text-xs text-tinta/40 hover:text-red-600 shrink-0 ml-3">Eliminar</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sección visible únicamente para el dueño del stand */}
                    {esDueno && (
                        <div className="bg-superficie/50 rounded-2xl p-5">
                            <h4 className="font-display font-medium mb-3">Empleados del stand</h4>

                            {standActivo.empleadosIds.length === 0 && <p className="text-sm text-tinta/60 mb-3">Todavía no tiene empleados.</p>}

                            <ul className="flex flex-col gap-2 mb-4">
                                {standActivo.empleadosIds.map((id) => (
                                    <li key={id} className="flex items-center justify-between font-mono text-sm bg-fondo rounded-lg px-3 py-2">
                                        Usuario #{id}
                                        <button onClick={() => quitarEmpleado(id)} className="text-xs text-tinta/40 hover:text-red-600">Quitar</button>
                                    </li>
                                ))}
                            </ul>

                            <form onSubmit={agregarEmpleado} className="flex gap-2">
                                <Campo placeholder="Email del empleado" type="email" value={emailEmpleado}
                                       onChange={(e) => setEmailEmpleado(e.target.value)} required />
                                <BotonSenal type="submit">Agregar</BotonSenal>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default AdminStand;