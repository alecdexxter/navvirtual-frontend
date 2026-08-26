import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const mostrar = useCallback((mensaje, tipo = 'exito') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, mensaje, tipo }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    return (
        <ToastContext.Provider value={{ mostrar }}>
            {children}
            <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`font-display text-sm px-5 py-3 rounded-xl shadow-lg text-tinta ${t.tipo === 'error' ? 'bg-red-600' : 'bg-exito'}`}
                    >
                        {t.tipo === 'error' ? '✕ ' : '✓ '}{t.mensaje}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}