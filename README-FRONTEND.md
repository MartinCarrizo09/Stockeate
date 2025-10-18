# Frontend — Inventario & Precios (React + Vite + Tailwind)

Este frontend consume la API REST existente en `/api/productos`. Diseño simple tipo dashboard, responsive, con soporte de tema oscuro (prefiere el sistema).

## Requisitos
- Node.js 18+ y npm
- Backend corriendo en `http://localhost:8080` (o ajustar variable de entorno)

## Variables de entorno
Copia `.env.example` a `.env` y ajustá si hace falta:
```
VITE_API_URL=http://localhost:8080/api
```
Opcionalmente, podés usar `VITE_API_URL=/api` para aprovechar el proxy de Vite.

## Comandos
Instalar dependencias:
```
npm install
```
Correr en desarrollo (Vite en 5173):
```
npm run dev
```
Construir producción:
```
npm run build
```
Copiar a backend para servir como SPA (producción):
- Copiá el contenido de `frontend/dist/` a `src/main/resources/static/`
- El backend (Spring Boot) entregará `index.html` y `SpaWebConfig` resolverá el fallback de rutas.

Correr backend:
```
mvn spring-boot:run
```

## UX / Flujo
- Encabezado con título, buscador y botón “Nuevo producto”.
- Tabla con ordenamiento por columnas (nombre, precio, stock) y paginado client-side (8 por página).
- Modales para crear/editar con validación en cliente (nombre no vacío, precio > 0, stock ≥ 0).
- Eliminar con diálogo de confirmación.
- Notificaciones (toasts) para éxitos/errores.
- Accesible: `aria-*` en modales, labels asociados, focus en apertura.

## Integración con backend
- Cliente Axios lee `VITE_API_URL` (por defecto `http://localhost:8080/api`).
- Manejo de errores: el interceptor intenta mostrar `mensaje` del backend; si no, un genérico.
- En dev: `vite.config.js` define un proxy `/api` → `http://localhost:8080`.
- En prod: se sirve la SPA desde `src/main/resources/static/` y se usa fallback a `index.html`.

## Componentes principales
- `Encabezado`, `Buscador`, `TablaProductos`, `ModalProducto`, `FormularioProducto`, `ConfirmarDialogo`, `Toast`, `Loader`.
- Hook `useProductos` para encapsular CRUD y estados `cargando/error`.

## Comandos rápidos
- `npm install`
- `npm run dev`
- `npm run build` → copiar a `src/main/resources/static/`
- Backend: `mvn spring-boot:run`
