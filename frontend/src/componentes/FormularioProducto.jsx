import { useEffect, useState } from 'react'

// Formulario controlado con validaciones simples en cliente
export default function FormularioProducto({ inicial, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (inicial) {
      setNombre(inicial.nombre ?? '')
      setPrecio(String(inicial.precio ?? ''))
      setStock(String(inicial.stock ?? ''))
    } else {
      setNombre('')
      setPrecio('')
      setStock('')
    }
    setErrores({})
  }, [inicial])

  function validar() {
    const e = {}
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio'
    const p = Number(precio)
    if (!Number.isFinite(p) || p <= 0) e.precio = 'El precio debe ser mayor a 0'
    const s = Number(stock)
    if (!Number.isInteger(s) || s < 0) e.stock = 'El stock debe ser un entero ≥ 0'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!validar()) return
    await onGuardar({ nombre: nombre.trim(), precio: Number(precio), stock: Number(stock) })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1" htmlFor="nombre">Nombre</label>
        <input id="nombre" className="input" value={nombre} onChange={e => setNombre(e.target.value)} />
        {errores.nombre && <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="precio">Precio</label>
        <input id="precio" className="input" type="number" step="0.01" value={precio} onChange={e => setPrecio(e.target.value)} />
        {errores.precio && <p className="text-red-600 text-sm mt-1">{errores.precio}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="stock">Stock</label>
        <input id="stock" className="input" type="number" step="1" value={stock} onChange={e => setStock(e.target.value)} />
        {errores.stock && <p className="text-red-600 text-sm mt-1">{errores.stock}</p>}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn btn-secundario" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-primario">Guardar</button>
      </div>
    </form>
  )
}

