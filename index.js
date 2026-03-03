const express = require('express');
const conectarDB = require('./database');
const cors = require('cors');

const app = express(); // ESTA LÍNEA ES LA CLAVE

app.use(express.json());
app.use(cors());

const PORT = 3000;

app.get('/ventas', async (req, res) => {
    try {
        const db = await conectarDB();
        // Esta consulta trae el nombre del cliente y el del producto en lugar de solo los IDs
        const historial = await db.all(`
            SELECT 
                ventas.id, 
                compradores.nombre AS cliente, 
                productos.nombre AS producto, 
                ventas.cantidad, 
                ventas.fecha
            FROM ventas
            JOIN compradores ON ventas.id_comprador = compradores.id
            JOIN productos ON ventas.id_producto = productos.id
            ORDER BY ventas.fecha DESC
        `);
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener historial" });
    }
});

// Ruta de productos
app.get('/productos', async (req, res) => {
    console.log("Intentando leer productos...");
    try {
        const db = await conectarDB();
        const productos = await db.all('SELECT * FROM productos');
        res.json(productos);
    } catch (error) {
        console.error("Error en DB:", error);
        res.status(500).json({ error: "Error al leer la base de datos" });
    }
});

// Ver todos los compradores
app.get('/compradores', async (req, res) => {
    try {
        const db = await conectarDB();
        const compradores = await db.all('SELECT * FROM compradores');
        res.json(compradores);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener compradores" });
    }
});

// Agregar un nuevo comprador
app.post('/compradores', async (req, res) => {
    try {
        const db = await conectarDB();
        const { nombre, email, cuit_cuil } = req.body;
        await db.run(
            'INSERT INTO compradores (nombre, email, cuit_cuil) VALUES (?, ?, ?)',
            [nombre, email, cuit_cuil]
        );
        res.status(201).json({ mensaje: "Comprador registrado" });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar comprador" });
    }
});

app.post('/ventas', async (req, res) => {
    const { id_comprador, id_producto, cantidad } = req.body;
    try {
        const db = await conectarDB();
        const producto = await db.get('SELECT stock FROM productos WHERE id = ?', [id_producto]);

        if (producto.stock < cantidad) {
            return res.status(400).json({ error: "Stock insuficiente" });
        }

        await db.run('INSERT INTO ventas (id_comprador, id_producto, cantidad) VALUES (?, ?, ?)', [id_comprador, id_producto, cantidad]);
        await db.run('UPDATE productos SET stock = stock - ? WHERE id = ?', [cantidad, id_producto]);
        
        // Enviamos el nuevo stock de vuelta
        const nuevoStock = producto.stock - cantidad;
        res.json({ mensaje: "Venta exitosa", nuevoStock });
    } catch (error) {
        res.status(500).json({ error: "Error en la venta" });
    }
});

// BORRAR un producto por ID
app.delete('/productos/:id', async (req, res) => {
    try {
        const db = await conectarDB();
        await db.run('DELETE FROM productos WHERE id = ?', [req.params.id]);
        res.json({ mensaje: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

// ACTUALIZAR stock de un producto
app.patch('/productos/:id', async (req, res) => {
    const { stock } = req.body;
    try {
        const db = await conectarDB();
        await db.run('UPDATE productos SET stock = ? WHERE id = ?', [stock, req.params.id]);
        res.json({ mensaje: "Stock actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});