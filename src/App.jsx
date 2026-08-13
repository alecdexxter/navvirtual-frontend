import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Eventos from './pages/Eventos';
import Recorrido from './pages/Recorrido';
import Tienda from './pages/Tienda';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import EventoDetalle from './pages/EventoDetalle';
import TiendaStand from './pages/TiendaStand';
import { ToastProvider } from './context/ToastContext';
import Entradas from './pages/Entradas';
import EntradasEvento from './pages/EntradasEvento';

function RutaProtegida({ children }) {
    const { usuario } = useAuth();
    return usuario ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CarritoProvider>
                    <ToastProvider>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Registro />} />
                        <Route
                            path="/eventos"
                            element={
                                <RutaProtegida>
                                    <Eventos />
                                </RutaProtegida>
                            }
                        />
                        <Route
                            path="/recorrido/:eventoId"
                            element={
                                <RutaProtegida>
                                    <Recorrido />
                                </RutaProtegida>
                            }
                        />
                        <Route path="/entradas" element={<RutaProtegida><Entradas /></RutaProtegida>} />
                        <Route path="/entradas/:eventoId" element={<RutaProtegida><EntradasEvento /></RutaProtegida>} />
                        <Route
                            path="/evento/:eventoId"
                            element={
                                <RutaProtegida>
                                    <EventoDetalle />
                                </RutaProtegida>
                            }
                        />
                        <Route
                            path="/tienda/:eventoId"
                            element={
                                <RutaProtegida>
                                    <Tienda />
                                </RutaProtegida>
                            }
                        />
                        <Route
                            path="/carrito"
                            element={
                                <RutaProtegida>
                                    <Carrito />
                                </RutaProtegida>
                            }
                        />
                        <Route
                            path="/checkout"
                            element={
                                <RutaProtegida>
                                    <Checkout />
                                </RutaProtegida>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <RutaProtegida>
                                    <Admin />
                                </RutaProtegida>
                            }
                        />
                        <Route path="/tienda/stand/:standId" element={<RutaProtegida><TiendaStand /></RutaProtegida>} />
                    </Routes>
                    </ToastProvider>
                </CarritoProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;