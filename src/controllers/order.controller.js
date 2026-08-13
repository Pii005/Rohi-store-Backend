const {
    crearOrden,
    obtenerOrdenesPorUsuario,
    obtenerTodasLasOrdenes,
} = require("../services/order.service");

const create = async (req, res, next) => {
    try {
        const { items } = req.body;
        // items esperado: [{ productoId: "...", cantidad: 2 }, ...]

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                mensaje: "Se requiere un array de items con productoId y cantidad",
            });
        }

        const orden = await crearOrden(req.usuario.id, items);

        res.status(201).json(orden);
    } catch (error) {
        next(error);
    }
};

const getMisOrdenes = async (req, res, next) => {
    try {
        const ordenes = await obtenerOrdenesPorUsuario(req.usuario.id);
        res.status(200).json(ordenes);
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const ordenes = await obtenerTodasLasOrdenes();
        res.status(200).json(ordenes);
    } catch (error) {
        next(error);
    }
};

module.exports = { create, getMisOrdenes, getAll };