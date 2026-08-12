const Product = require("../models/Product");

const crearProducto = async (datos) => {
    const nuevoProducto = await Product.create(datos);
    return nuevoProducto;
};

const obtenerProductos = async (filtros = {}) => {
    const { categoria, nombre, precioMin, precioMax, orden } = filtros;

    const query = {};

    if (categoria) {
        query.categoria = categoria.toLowerCase();
    }

    if (nombre) {
        // busqueda parcial, insensible a mayusculas
        query.nombre = { $regex: nombre, $options: "i" };
    }

    if (precioMin || precioMax) {
        query.precio = {};
        if (precioMin) query.precio.$gte = Number(precioMin);
        if (precioMax) query.precio.$lte = Number(precioMax);
    }

    let ordenamiento = {};
    if (orden === "precio_asc") ordenamiento.precio = 1;
    if (orden === "precio_desc") ordenamiento.precio = -1;
    if (orden === "reciente") ordenamiento.createdAt = -1;

    const productos = await Product.find(query).sort(ordenamiento);
    return productos;
};

const obtenerProductoPorId = async (id) => {
    const producto = await Product.findById(id);
    if (!producto) {
        const error = new Error("Producto no encontrado");
        error.statusCode = 404;
        throw error;
    }
    return producto;
};

const actualizarProducto = async (id, datos) => {
    const producto = await Product.findByIdAndUpdate(id, datos, {
        new: true,
        runValidators: true,
    });

    if (!producto) {
        const error = new Error("Producto no encontrado");
        error.statusCode = 404;
        throw error;
    }

    return producto;
};

const eliminarProducto = async (id) => {
    const producto = await Product.findByIdAndDelete(id);

    if (!producto) {
        const error = new Error("Producto no encontrado");
        error.statusCode = 404;
        throw error;
    }

    return producto;
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
};

