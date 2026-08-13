const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

const crearOrden = async (usuarioId, itemsSolicitados) => {
    if (!itemsSolicitados || itemsSolicitados.length === 0) {
        const error = new Error("El carrito está vacío");
        error.statusCode = 400;
        throw error;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const itemsOrden = [];
        let total = 0;

        for (const item of itemsSolicitados) {
            const producto = await Product.findById(item.productoId).session(session);

            if (!producto) {
                const error = new Error(`Producto no encontrado: ${item.productoId}`);
                error.statusCode = 404;
                throw error;
            }

            if (producto.stock < item.cantidad) {
                const error = new Error(
                    `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, solicitado: ${item.cantidad}`
                );
                error.statusCode = 400;
                throw error;
            }

            producto.stock -= item.cantidad;
            await producto.save({ session });

            itemsOrden.push({
                producto: producto._id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: item.cantidad,
            });

            total += producto.precio * item.cantidad;
        }

        const nuevaOrden = await Order.create(
            [
                {
                    usuario: usuarioId,
                    items: itemsOrden,
                    total,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return nuevaOrden[0];
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const obtenerOrdenesPorUsuario = async (usuarioId) => {
    const ordenes = await Order.find({ usuario: usuarioId }).sort({ createdAt: -1 });
    return ordenes;
};

const obtenerTodasLasOrdenes = async () => {
    const ordenes = await Order.find()
        .populate("usuario", "nombre email")
        .sort({ createdAt: -1 });
    return ordenes;
};

module.exports = { crearOrden, obtenerOrdenesPorUsuario, obtenerTodasLasOrdenes };