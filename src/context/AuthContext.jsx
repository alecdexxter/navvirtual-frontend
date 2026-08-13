import { createContext, useContext, useState } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const id = localStorage.getItem('id');
        const email = localStorage.getItem('email');
        const nombre = localStorage.getItem('nombre');
        const roles = JSON.parse(localStorage.getItem('roles') || '[]');
        return email ? { id, email, nombre, roles } : null;
    });

    const guardarSesion = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);
        localStorage.setItem('email', data.email);
        localStorage.setItem('nombre', data.nombre);
        localStorage.setItem('roles', JSON.stringify(data.roles));

        setUsuario({
            id: data.id,
            email: data.email,
            nombre: data.nombre,
            roles: data.roles
        });
    };

    const login = async (email, password) => {
        const { data } = await axiosClient.post('/auth/login', { email, password });
        guardarSesion(data);
        return data;
    };

    const registrar = async (registroData) => {
        const { data } = await axiosClient.post('/auth/registro', registroData);
        guardarSesion(data);
        return data;
    };

    const logout = () => {
        localStorage.clear();
        setUsuario(null);
    };

    const tieneRol = (rol) => usuario?.roles?.includes(rol);

    return (
        <AuthContext.Provider value={{ usuario, login, registrar, logout, tieneRol }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}