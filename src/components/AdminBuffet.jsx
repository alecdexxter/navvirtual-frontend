import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import Campo from './ui/Campo';
import BotonSenal from './ui/BotonSenal';
import SubirImagen from './ui/SubirImagen';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

function AdminBuffet() {
    const [buffets, setBuffets] = useState([]);
    const [buffetActivo, setBuffetActivo] = useState(null);
    const [comunicados, setComunicados] = useState([]);
    const [productoForm, setProductoForm] = useState({ nombre: '', precio: '', descripcion: '', imagenUrl: '' });
    const [emailEmpleado, setEmailEmpleado] = useState('');
    const { mostrar } = useToast();
    const { usuario } = useAuth();
    const [productos, setProductos] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [editForm, setEditForm] = useState({ nombre: '', precio: '', descripcion: '' });

    const esDueno = buffetActivo && buffetActivo.propietarioId === usuario?.id;

    useEffect(() => {
        if (!buffetActivo) return;
        axiosClient.get(`/comunicados/evento/${buffetActivo.eventoId}`).then((res) => setComunicados(res.data));
    }, [buffetActivo]);

    useEffect(() => {
        if (!buffetActivo) return;
        axiosClient.get(`/productos/buffet/${buffetActivo.id}`).then((res) => setProductos(res.data));
    }, [buffetActivo]);

    useEffect(() => {
        axiosClient.get('/buffets/mis-buffets').then((res) => setBuffets(res.data));
    }, []);

    const refrescar = async () => {
        const { data } = await axiosClient.get('/buffets/mis-buffets');
        setBuffets(data);
        setBuffetActivo((prev) => data.find((b) => b.id === prev.id));
    };

    const crearProducto = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/productos', {
                nombre: productoForm.nombre, precio: Number(productoForm.precio),
                descripcion: productoForm.descripcion, imagenUrl: productoForm.imagenUrl,
                categoria: 'CONFITERIA', buffetId: buffetActivo.id,
            });
            mostrar('Producto agregado');
            setProductoForm({ nombre: '', precio: '', descripcion: '', imagenUrl: '' });
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al agregar producto', 'error');
        }
        const { data } = await axiosClient.get(`/productos/buffet/${buffetActivo.id}`);
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
                descripcion: editForm.descripcion, categoria: 'CONFITERIA', buffetId: buffetActivo.id,
            });
            mostrar('Producto actualizado');
            setEditandoId(null);
            const { data } = await axiosClient.get(`/productos/buffet/${buffetActivo.id}`);
            setProductos(data);
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al actualizar', 'error');
        }
    };

    const agregarEmpleado = async (e) => {
        e.preventDefault();
        try {
            const { data: usuarioEncontrado } = await axiosClient.get('/usuarios/buscar', { params: { email: emailEmpleado } });
            await axiosClient.post(`/buffets/${buffetActivo.id}/empleados/${usuarioEncontrado.id}`);
            mostrar(`${usuarioEncontrado.nombre} agregado como empleado`);
            setEmailEmpleado('');
            await refrescar();
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al agregar empleado', 'error');
        }
    };

    const quitarEmpleado = async (usuarioId) => {
        try {
            await axiosClient.delete(`/buffets/${buffetActivo.id}/empleados/${usuarioId}`);
            mostrar('Empleado quitado');
            await refrescar();
        } catch (err) {
            mostrar(err.response?.data?.mensaje || 'Error al quitar empleado', 'error');
        }
    };

    if (buffets.length === 0) {
        return <p className="text-tinta/60">No sos dueño ni empleado de ningún buffet todavía.</p>;
    }

    return (
        <section>
            <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Buffet</span>
            <h2 className="font-display font-semibold text-xl mt-1 mb-4">Mis buffets</h2>

            <div className="flex gap-2 mb-6 flex-wrap">
                {buffets.map((b) => (
                    <button
                        key={b.id}
                        onClick={() => setBuffetActivo(b)}
                        className={`font-display text-sm px-4 py-2 rounded-full transition-colors ${buffetActivo?.id === b.id ? 'bg-tinta text-tinta' : 'bg-superficie hover:bg-tinta/10'}`}
                    >
                        Buffet del evento #{b.eventoId}
                    </button>
                ))}
            </div>

            {buffetActivo && (
                <div className="flex flex-col gap-4">
                    <h3 className="font-display font-medium">Gestionando: Buffet #{buffetActivo.id}</h3>

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
                        <h4 className="font-display font-medium mb-3">Agregar producto de confitería</h4>
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

                    {/* Sección visible únicamente para el dueño del buffet */}
                    {esDueno && (
                        <div className="bg-superficie/50 rounded-2xl p-5">
                            <h4 className="font-display font-medium mb-3">Empleados del buffet</h4>

                            {buffetActivo.empleadosIds.length === 0 && <p className="text-sm text-tinta/60 mb-3">Todavía no tiene empleados.</p>}

                            <ul className="flex flex-col gap-2 mb-4">
                                {buffetActivo.empleadosIds.map((id) => (
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

export default AdminBuffet;