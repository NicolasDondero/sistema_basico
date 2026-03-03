📦 Sistema de Gestión para Distribuidora
Este proyecto es una aplicación web Full-Stack diseñada para la administración comercial de una distribuidora. Permite gestionar el inventario en tiempo real y registrar transacciones vinculadas a clientes específicos.

🚀 Funcionalidades Actuales
El sistema ya cuenta con las siguientes capacidades operativas:

Gestión de Inventario (CRUD): * Crear, listar y eliminar productos.

Control de stock físico (con alertas visuales cuando el stock es bajo).

Módulo de Ventas Inteligente: * Registro de ventas vinculando un Comprador con un Producto.

Automatización: El sistema descuenta automáticamente las unidades del stock al confirmar la venta.

Validación de stock disponible antes de procesar la transacción.

Base de Datos Relacional: * Registro de Compradores con datos de contacto (Email, CUIT/CUIL).

Historial de Ventas: Visualización detallada de quién compró qué, cuándo y en qué cantidad.

🛠️ Tecnologías Utilizadas
Frontend: React.js (Vite) + Axios para consumo de APIs.

Backend: Node.js + Express.js.

Base de Datos: SQLite (Persistencia local mediante archivo .db).

🧩 Arquitectura del Proyecto
La aplicación sigue una arquitectura Cliente-Servidor:

Frontend (React): Maneja la interfaz de usuario, los estados globales y las peticiones asíncronas al servidor.

API REST (Express): Expone los endpoints necesarios para que el frontend pueda leer y escribir datos. Contiene la lógica de negocio (como el cálculo de stock).

Capa de Datos (SQLite): Almacena de forma estructurada la información de productos, compradores y el historial transaccional mediante relaciones SQL.

🎯 Objetivo del Proyecto
El objetivo principal es consolidar el desarrollo Full-Stack, aplicando conceptos clave:

Diseño y consumo de API REST.

Modelado de datos relacional y consultas con Joins complejos.

Sincronización de estados entre la interfaz y la base de datos.

Manejo de errores y validaciones en el servidor.
