import { useAuth } from '../context/AuthContext';
import AdminSuperadmin from '../components/AdminSuperadmin';
import AdminStand from '../components/AdminStand';
import AdminBuffet from '../components/AdminBuffet';
import Perfil from '../components/Perfil';

function Admin() {
    const { usuario, tieneRol } = useAuth();

    if (!usuario) return <p className="max-w-3xl mx-auto px-6 py-12">Cargando...</p>;

    const tieneAlgunPanel =
        tieneRol('ROLE_SUPERADMIN') ||
        tieneRol('ROLE_DUENIO_STAND') ||
        tieneRol('ROLE_EMPLEADO_STAND') ||
        tieneRol('ROLE_DUENIO_BUFFET') ||
        tieneRol('ROLE_EMPLEADO_BUFFET');

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <span className="font-mono text-xs text-senal tracking-widest uppercase">◣ Panel</span>
            <h1 className="font-display font-bold text-3xl mt-2 mb-10">Administración</h1>

            <div className="flex flex-col gap-10">
                {tieneRol('ROLE_SUPERADMIN') && <AdminSuperadmin />}
                {(tieneRol('ROLE_DUENIO_STAND') || tieneRol('ROLE_EMPLEADO_STAND')) && <AdminStand />}
                {(tieneRol('ROLE_DUENIO_BUFFET') || tieneRol('ROLE_EMPLEADO_BUFFET')) && <AdminBuffet />}

                {!tieneAlgunPanel && (
                    <div className="text-tinta/60">{!tieneAlgunPanel && <Perfil />} </div>
                )}
            </div>
        </div>
    );
}

export default Admin;