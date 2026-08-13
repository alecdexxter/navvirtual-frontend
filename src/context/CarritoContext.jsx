import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
    const [items, setItems] = useState([]); // [{ productoId, nombre, precio, cantidad }]

    const agregar = (producto) => {
        setItems((prev) => {
            const existente = prev.find((i) => i.productoId === producto.id);
            if (existente) {
                return prev.map((i) =>
                    i.productoId === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
                );
            }
            return [...prev, { productoId: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }];
        });
    };

    const quitar = (productoId) => {
        setItems((prev) => prev.filter((i) => i.productoId !== productoId));
    };

    const cambiarCantidad = (productoId, cantidad) => {
        if (cantidad <= 0) {
            quitar(productoId);
            return;
        }
        setItems((prev) => prev.map((i) => (i.productoId === productoId ? { ...i, cantidad } : i)));
    };

    const vaciar = () => setItems([]);

    const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);

    return (
        <CarritoContext.Provider value={{ items, agregar, quitar, cambiarCantidad, vaciar, total, cantidadTotal }}>
            {children}
        </CarritoContext.Provider>
    );
}

export function useCarrito() {
    return useContext(CarritoContext);
}