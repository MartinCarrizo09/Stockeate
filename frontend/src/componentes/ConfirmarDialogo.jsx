// Diálogo de confirmación simple y accesible
export default function ConfirmarDialogo({ abierto, mensaje, onConfirmar, onCancelar }) {
  if (!abierto) return null
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="titulo-confirmar" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancelar() }}>
      <div className="modal-card">
        <h2 id="titulo-confirmar" className="text-lg font-semibold mb-2">Confirmar acción</h2>
        <p className="mb-4">{mensaje}</p>
        <div className="flex justify-end gap-2">
          <button className="btn btn-secundario" onClick={onCancelar}>Cancelar</button>
          <button className="btn btn-peligro" onClick={onConfirmar}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}

