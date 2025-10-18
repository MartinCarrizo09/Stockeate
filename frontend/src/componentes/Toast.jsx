// Toaster simple: lista de mensajes con auto-ocultado
export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`rounded-md shadow px-3 py-2 text-sm ${t.tipo==='error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}>
          <div className="flex items-start gap-2">
            <span className="font-medium">{t.tipo==='error' ? 'Error' : 'Aviso'}</span>
            <span className="opacity-90">{t.mensaje}</span>
            <button className="ml-2 text-white/80 hover:text-white" onClick={() => onDismiss(t.id)} aria-label="Cerrar">✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}

