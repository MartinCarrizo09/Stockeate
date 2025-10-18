import axios from 'axios'

// Cliente Axios con baseURL configurable por env. En dev por defecto a http://localhost:8080/api
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({ baseURL, timeout: 10000 })

// Interceptor de error para devolver mensajes legibles
api.interceptors.response.use(
  r => r,
  err => {
    const resp = err?.response
    const data = resp?.data
    const detalle = data?.mensaje || data?.message || err?.message || 'Error de red'
    return Promise.reject(new Error(detalle))
  }
)

export async function listarProductos() {
  const { data } = await api.get('/productos')
  return data
}

export async function crearProducto(payload) {
  const { data } = await api.post('/productos', payload)
  return data
}

export async function actualizarProducto(id, payload) {
  const { data } = await api.put(`/productos/${id}`, payload)
  return data
}

export async function eliminarProducto(id) {
  await api.delete(`/productos/${id}`)
}

