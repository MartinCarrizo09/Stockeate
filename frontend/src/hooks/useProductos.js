import { useCallback, useEffect, useState } from 'react'
import { listarProductos, crearProducto, actualizarProducto, eliminarProducto } from '../servicios/apiCliente.js'

// Hook simple para CRUD de productos
export default function useProductos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const data = await listarProductos()
      setProductos(data)
    } catch (e) {
      setError(e?.message || 'Error al cargar productos')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function crear(payload) {
    setError('')
    await crearProducto(payload)
    await cargar()
  }

  async function actualizar(id, payload) {
    setError('')
    await actualizarProducto(id, payload)
    await cargar()
  }

  async function eliminar(id) {
    setError('')
    await eliminarProducto(id)
    await cargar()
  }

  return { productos, cargando, error, refrescar: cargar, crear, actualizar, eliminar }
}

