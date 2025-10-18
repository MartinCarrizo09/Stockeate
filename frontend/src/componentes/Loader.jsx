// Loader minimal para estados de carga
export default function Loader({ etiqueta = 'Cargando...' }) {
  return (
    <div className="flex items-center gap-3" role="status" aria-live="polite">
      <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 border-t-primario-600 rounded-full animate-spin" />
      <span className="text-sm text-gray-600 dark:text-gray-300">{etiqueta}</span>
    </div>
  )
}

