import { useEffect, useMemo, useRef, useState } from 'react'
import Encabezado from './componentes/Encabezado.jsx'
import TablaProductos from './componentes/TablaProductos.jsx'
import ModalProducto from './componentes/ModalProducto.jsx'
import ConfirmarDialogo from './componentes/ConfirmarDialogo.jsx'
import Toast from './componentes/Toast.jsx'
import Loader from './componentes/Loader.jsx'
import useProductos from './hooks/useProductos.js'

// App principal: orquesta estados y conecta con el hook de datos
export default function App() {
  const { productos, cargando, error, refrescar, crear, actualizar, eliminar } = useProductos()

  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoEditar, setProductoEditar] = useState(null)
  const [confirmar, setConfirmar] = useState({ abierto: false, producto: null })
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  useEffect(() => {
    if (error) {
      pushToast('error', error)
    }
  }, [error])

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return productos
    return productos.filter(p => (p.nombre || '').toLowerCase().includes(q))
  }, [productos, busqueda])

  function pushToast(tipo, mensaje) {
    const id = ++toastId.current
    setToasts(prev => [...prev, { id, tipo, mensaje }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  function abrirCrear() {
    setProductoEditar(null)
    setModalAbierto(true)
  }

  function abrirEditar(prod) {
    setProductoEditar(prod)
    setModalAbierto(true)
  }

  async function onGuardarProducto(datos) {
    try {
      if (productoEditar) {
        await actualizar(productoEditar.id, datos)
        pushToast('ok', 'Producto actualizado')
      } else {
        await crear(datos)
        pushToast('ok', 'Producto creado')
      }
      setModalAbierto(false)
      setProductoEditar(null)
    } catch (e) {
      pushToast('error', e?.message || 'Error al guardar')
    }
  }

  function solicitarEliminar(prod) {
    setConfirmar({ abierto: true, producto: prod })
  }

  async function confirmarEliminar() {
    try {
      await eliminar(confirmar.producto.id)
      pushToast('ok', 'Producto eliminado')
    } catch (e) {
      pushToast('error', e?.message || 'Error al eliminar')
    } finally {
      setConfirmar({ abierto: false, producto: null })
    }
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
      <Encabezado
        onNuevo={abrirCrear}
        busqueda={busqueda}
        onBuscar={setBusqueda}
      />

      <main className="max-w-6xl mx-auto p-4">
        {cargando ? (
          <div className="py-16 flex justify-center">
            <Loader etiqueta="Cargando productos..." />
          </div>
        ) : (
          <>
            {filtrados.length === 0 ? (
              <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
                <p className="text-lg">No hay productos para mostrar</p>
                <p className="text-sm text-gray-500 mt-1">Probá crear uno nuevo o ajustar la búsqueda</p>
              </div>
            ) : (
              <TablaProductos
                productos={filtrados}
                onEditar={abrirEditar}
                onEliminar={solicitarEliminar}
              />
            )}
          </>
        )}
      </main>

      <ModalProducto
        abierto={modalAbierto}
        onCerrar={() => { setModalAbierto(false); setProductoEditar(null) }}
        onGuardar={onGuardarProducto}
        producto={productoEditar}
      />

      <ConfirmarDialogo
        abierto={confirmar.abierto}
        mensaje={confirmar.producto ? `¿Eliminar el producto "${confirmar.producto.nombre}"?` : ''}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setConfirmar({ abierto: false, producto: null })}
      />

      <Toast toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  )
}

