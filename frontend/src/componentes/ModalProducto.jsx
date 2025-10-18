import { useEffect, useRef } from 'react'
import FormularioProducto from './FormularioProducto.jsx'

// Modal accesible: cierra con Esc/overlay y enfoca el primer campo
export default function ModalProducto({ abierto, onCerrar, onGuardar, producto }) {
  const refDialogo = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCerrar()
    }
    if (abierto) {
      document.addEventListener('keydown', onKey)
      // foco al primer input cuando abre
      setTimeout(() => {
        refDialogo.current?.querySelector('input')?.focus()
      }, 0)
    }
    return () => document.removeEventListener('keydown', onKey)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="titulo-modal" onMouseDown={(e) => { if (e.target === e.currentTarget) onCerrar() }}>
      <div className="modal-card" ref={refDialogo}>
        <div className="flex items-center justify-between mb-2">
          <h2 id="titulo-modal" className="text-lg font-semibold">{producto ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button className="btn btn-secundario" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>

        <FormularioProducto
          inicial={producto}
          onCancelar={onCerrar}
          onGuardar={onGuardar}
        />
      </div>
    </div>
  )
}

