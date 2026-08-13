const {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
} = require("../services/product.service");

const create = async (req, res, next) => {
    try {
        const { nombre, precio, descripcion, stock, categoria } = req.body;

        if (!nombre || !precio || !descripcion || !categoria) {
            return res.status(400).json({
                mensaje: "Nombre, precio, descripcion y categoria son obligatorios",
            });
        }

        const datosProducto = {
            ...req.body,
            imagen: req.file ? req.file.path : "",
        };

        const producto = await crearProducto(datosProducto);

        res.status(201).json(producto);
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        // filtros vienen por query params: /api/products?categoria=ropa&precioMin=100
        const productos = await obtenerProductos(req.query);
        // console.log("PRODUCTOS ENCONTRADOS:", productos);
        res.status(200).json(productos);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const producto = await obtenerProductoPorId(req.params.id);

        res.status(200).json(producto);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const producto = await actualizarProducto(req.params.id, req.body);
        res.status(200).json(producto);
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await eliminarProducto(req.params.id);
        res.status(200).json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};

module.exports = { create, getAll, getById, update, remove };

