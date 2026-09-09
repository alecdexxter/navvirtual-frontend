Navegación Virtual — Frontend

Interfaz web desarrollada con React + Vite + Tailwind CSS, que consume la API del backend para ofrecer un recorrido virtual interactivo en 360° de una convención o feria de stands.

Este repositorio es el frontend. El backend (Spring Boot) vive en un repositorio aparte: navvirtual-backend, y tiene que estar corriendo para que esta aplicación funcione.
Tecnologías
Tecnología	Uso
React + Vite	Construcción de la interfaz por componentes
React Router	Navegación entre pantallas
Axios	Comunicación HTTP con la API del backend
Tailwind CSS	Sistema de diseño (colores, tipografías, espaciados centralizados)
Photo Sphere Viewer + Markers Plugin	Renderizado del recorrido 360° con hotspots
@mercadopago/sdk-react (Payment Brick)	Checkout de pago con tarjeta
Funcionalidades principales
Recorrido virtual 360° navegable entre distintos puntos del evento
Panel de detalle por stand: descripción, video, productos, votación y trivia
Tienda con carrito de compras (productos de stand, confitería y entradas)
Checkout integrado con Mercado Pago
Paneles de administración diferenciados por rol (Superadmin, Dueño/Empleado de Stand, Dueño/Empleado de Buffet)
Perfil de usuario editable (foto, nombre) para quienes no tienen un rol especial
Diseño responsive con tema oscuro y sistema de tokens de color/tipografía centralizado
Requisitos previos
Node.js 18+ (nodejs.org, versión LTS)
El backend de este proyecto corriendo en http://localhost:8082 (ver su propio README)
Cómo levantar el proyecto
Cloná el repositorio
bash
   git clone https://github.com/TU_USUARIO/navvirtual-frontend.git
   cd navvirtual-frontend
Instalá las dependencias
bash
   npm install
Corré el servidor de desarrollo
bash
   npm run dev

La aplicación queda disponible en http://localhost:5173.

Iniciá sesión Necesitás un usuario registrado en el backend. Si es la primera vez, andá a http://localhost:5173/registro y creá una cuenta — por defecto se registra como Cliente; para probar los paneles de administración, un Superadmin existente te tiene que asignar el rol correspondiente desde su panel (o asignártelo directo en la base de datos si sos vos el primer usuario del sistema).
Estructura del proyecto
src/
├── api/          # Cliente de Axios configurado con interceptor de JWT
├── components/   # Componentes reutilizables (Navbar, StandPanel, Trivia, paneles admin, etc.)
├── context/      # Estado global (autenticación, carrito, notificaciones toast)
├── pages/        # Una por ruta (Home, Login, Eventos, Recorrido, Tienda, Admin, etc.)
└── index.css     # Sistema de diseño: tokens de color y tipografía (Tailwind CSS v4)
Sistema de diseño

Los colores y tipografías de toda la aplicación se definen en un único archivo (src/index.css), como tokens reutilizables (--color-fondo, --color-senal, etc.). Cambiar la paleta completa del sitio implica editar solo esos valores, sin tocar los componentes individuales.

Licencia / Contexto académico

Proyecto desarrollado para la materia Programación 3, presentado en ExpoJuy 2026.
