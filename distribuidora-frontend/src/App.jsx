import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [productos, setProductos] = useState([])
  const [compradores, setCompradores] = useState([])
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '', codigo: '', precio: '', stock: ''
  })
  const [venta, setVenta] = useState({ id_comprador: '', id_producto: '', cantidad: 1 })
  const [historial, setHistorial] = useState([]);

  // --- CARGA DE DATOS ---
  const traerProductos = async () => {
    const res = await axios.get('http://localhost:3000/productos')
    setProductos(res.data)
  }

  const traerCompradores = async () => {
    const res = await axios.get('http://localhost:3000/compradores')
    setCompradores(res.data)
  }

  useEffect(() => {
    traerProductos()
    traerHistorial()
    traerCompradores()
  }, [])

  // --- LÓGICA DE PRODUCTOS ---
  const manejarCambioProducto = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value })
  }

  const guardarProducto = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/productos', nuevoProducto)
      setNuevoProducto({ nombre: '', codigo: '', precio: '', stock: '' })
      traerProductos()
    } catch (error) {
      alert("Error al guardar el producto.")
    }
  }

  const eliminarProducto = async (id) => {
    if (confirm("¿Borrar producto?")) {
      await axios.delete(`http://localhost:3000/productos/${id}`)
      traerProductos()
    }
  }

  // --- LÓGICA DE VENTAS ---
  const realizarVenta = async (e) => {
    e.preventDefault();
    
    // Convertimos a números antes de enviar
    const datosVenta = {
        id_comprador: Number(venta.id_comprador),
        id_producto: Number(venta.id_producto),
        cantidad: Number(venta.cantidad)
    };

    if (!datosVenta.id_comprador || !datosVenta.id_producto || datosVenta.cantidad <= 0) {
        alert("Por favor, selecciona un cliente, un producto y una cantidad válida.");
        return;
    }

    try {
        const res = await axios.post('http://localhost:3000/ventas', datosVenta);
        alert(res.data.mensaje);
        traerProductos(); // Refresca el stock en la tabla
    } catch (error) {
        console.error("Detalle del error:", error.response?.data);
        alert("Error: " + (error.response?.data?.error || "Fallo en el servidor"));
    }
  };

  const traerHistorial = async () => {
    try {
        const res = await axios.get('http://localhost:3000/ventas');
        setHistorial(res.data);
    } catch (error) {
        console.error("Error al traer el historial", error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">📦 Gestión de Distribuidora</h1>

      <div className="forms-grid">
        
        {/* Formulario de Productos */}
        <section className="form-section">
          <h3>➕ Nuevo Producto</h3>
          <form onSubmit={guardarProducto}>
            <input name="nombre" placeholder="Nombre" value={nuevoProducto.nombre} onChange={manejarCambioProducto} required className="form-input" />
            <input name="codigo" placeholder="Código" value={nuevoProducto.codigo} onChange={manejarCambioProducto} required className="form-input" />
            <input name="precio" type="number" placeholder="Precio" value={nuevoProducto.precio} onChange={manejarCambioProducto} required className="form-input" />
            <input name="stock" type="number" placeholder="Stock" value={nuevoProducto.stock} onChange={manejarCambioProducto} required className="form-input" />
            <button type="submit" className="btn btn-primary">Guardar Producto</button>
          </form>
        </section>

        {/* Formulario de Ventas */}
        <section className="form-section form-section-sales">
          <h3>🛒 Realizar Venta</h3>
          <form onSubmit={realizarVenta}>
            <label className="form-label">Cliente:</label>
            <select className="form-select" onChange={(e) => setVenta({...venta, id_comprador: e.target.value})} value={venta.id_comprador}>
              <option value="">Seleccionar Cliente...</option>
              {compradores.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>

            <label className="form-label">Producto:</label>
            <select className="form-select" onChange={(e) => setVenta({...venta, id_producto: e.target.value})} value={venta.id_producto}>
              <option value="">Seleccionar Producto...</option>
              {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stock})</option>)}
            </select>

            <label className="form-label">Cantidad:</label>
            <input type="number" min="1" className="form-input" value={venta.cantidad} onChange={(e) => setVenta({...venta, cantidad: e.target.value})} />
            
            <button type="submit" className="btn btn-secondary">Registrar Venta</button>
          </form>
        </section>
      </div>

      {/* Tabla de Inventario */}
      {productos.some(p => p.stock < 5) && (
        <div className="alert-warning">
          <strong>⚠️ ¡Atención!</strong> Tienes productos con menos de 5 unidades en stock.
        </div>
      )}
      <section className="table-section">
        <h3>📋 Inventario Actual</h3>
        <div className="table-container">
          <table className="table-main">
            <thead>
              <tr>
                <th className="table-cell">Producto</th>
                <th className="table-cell">Código</th>
                <th className="table-cell">Precio</th>
                <th className="table-cell">Stock</th>
                <th className="table-cell">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td className="table-cell">{p.nombre}</td>
                  <td className="table-cell">{p.codigo}</td>
                  <td className="table-cell">${p.precio}</td>
                  <td className={`table-cell-stock ${p.stock < 10 ? 'low-stock' : ''}`}>{p.stock}</td>
                  <td className="table-cell">
                    <button onClick={() => eliminarProducto(p.id)} className="btn-delete">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="hr-separator" />

      <section className="table-section">
        <h3 className="historial-title">📜 Historial de Ventas Recientes</h3>
        <div className="historial-container">
          <table className="table-historial">
            <thead>
              <tr>
                <th className="table-historial-cell">Fecha</th>
                <th className="table-historial-cell">Cliente</th>
                <th className="table-historial-cell">Producto</th>
                <th className="table-historial-cell">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {historial.map(v => (
                <tr key={v.id}>
                  <td className="table-historial-cell">{new Date(v.fecha).toLocaleString()}</td>
                  <td className="table-historial-cell table-historial-cell-bold">{v.cliente}</td>
                  <td className="table-historial-cell">{v.producto}</td>
                  <td className="table-historial-cell table-historial-cell-center">
                    <span className="cantidad-badge">{v.cantidad} un.</span>
                  </td>
                </tr>
              ))}
              {historial.length === 0 && (
                <tr>
                  <td colSpan="4" className="no-data">
                    No hay ventas registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default App