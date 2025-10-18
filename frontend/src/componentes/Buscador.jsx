// Buscador simple para filtrar por nombre (case-insensitive)
export default function Buscador({ valor, onCambiar }) {
  return (
    <label className="block w-full">
      <span className="sr-only">Buscar producto</span>
      <input
        type="search"
        value={valor}
        onChange={e => onCambiar(e.target.value)}
        placeholder="Buscar producto..."
        className="input"
        aria-label="Buscar producto por nombre"
      />
    </label>
  )
}

