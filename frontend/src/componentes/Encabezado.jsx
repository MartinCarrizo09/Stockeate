import Buscador from './Buscador.jsx'

// Encabezado del dashboard: título, buscador y acción de crear
export default function Encabezado({ onNuevo, busqueda, onBuscar }) {
  return (
    <header className="bg-white/70 dark:bg-gray-800/60 backdrop-blur sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <h1 className="text-xl font-semibold flex-1">Inventario & Precios</h1>
        <div className="hidden sm:block w-80">
          <Buscador valor={busqueda} onCambiar={onBuscar} />
        </div>
        <button className="btn btn-primario" onClick={onNuevo} aria-label="Nuevo producto">
          Nuevo producto
        </button>
      </div>
      <div className="sm:hidden px-4 pb-3">
        <Buscador valor={busqueda} onCambiar={onBuscar} />
      </div>
    </header>
  )
}

