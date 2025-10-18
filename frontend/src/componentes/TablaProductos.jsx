import { useMemo, useState } from 'react'

// Tabla con ordenamiento por columnas y paginado client-side
export default function TablaProductos({ productos, onEditar, onEliminar }) {
  const [orden, setOrden] = useState({ columna: 'nombre', direccion: 'asc' })
  const [pagina, setPagina] = useState(1)
  const porPagina = 8

  function cambiarOrden(col) {
    setPagina(1)
    setOrden(prev => {
      if (prev.columna === col) {
        return { columna: col, direccion: prev.direccion === 'asc' ? 'desc' : 'asc' }
      }
      return { columna: col, direccion: 'asc' }
    })
  }

  const ordenados = useMemo(() => {
    const copia = [...productos]
    copia.sort((a, b) => {
      const dir = orden.direccion === 'asc' ? 1 : -1
      const c = orden.columna
      if (c === 'nombre') return (a.nombre || '').localeCompare(b.nombre || '') * dir
      if (c === 'precio') return ((a.precio ?? 0) - (b.precio ?? 0)) * dir
      if (c === 'stock') return ((a.stock ?? 0) - (b.stock ?? 0)) * dir
      return 0
    })
    return copia
  }, [productos, orden])

  const total = ordenados.length
  const paginas = Math.max(1, Math.ceil(total / porPagina))
  const inicio = (pagina - 1) * porPagina
  const visibles = ordenados.slice(inicio, inicio + porPagina)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="tabla" role="table" aria-label="Tabla de productos">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr>
              <th scope="col" className="th" onClick={() => cambiarOrden('nombre')} aria-sort={orden.columna==='nombre'?orden.direccion:'none'}>Nombre</th>
              <th scope="col" className="th" onClick={() => cambiarOrden('precio')} aria-sort={orden.columna==='precio'?orden.direccion:'none'}>Precio ($)</th>
              <th scope="col" className="th" onClick={() => cambiarOrden('stock')} aria-sort={orden.columna==='stock'?orden.direccion:'none'}>Stock</th>
              <th scope="col" className="th">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {visibles.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                <td className="td">{p.nombre}</td>
                <td className="td">{Number(p.precio).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="td">{p.stock}</td>
                <td className="td">
                  <div className="flex gap-2">
                    <button className="btn btn-secundario" onClick={() => onEditar(p)} aria-label={`Editar ${p.nombre}`}>Editar</button>
                    <button className="btn btn-peligro" onClick={() => onEliminar(p)} aria-label={`Eliminar ${p.nombre}`}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-3 text-sm text-gray-600 dark:text-gray-300">
        <span>Mostrando {Math.min(inicio + 1, total)}–{Math.min(inicio + visibles.length, total)} de {total}</span>
        <div className="flex items-center gap-2">
          <button className="btn btn-secundario" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</button>
          <span>Página {pagina} / {paginas}</span>
          <button className="btn btn-secundario" onClick={() => setPagina(p => Math.min(paginas, p + 1))} disabled={pagina === paginas}>Siguiente</button>
        </div>
      </div>
    </div>
  )
}

