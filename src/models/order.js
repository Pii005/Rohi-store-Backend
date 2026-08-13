const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        nombre: {
            type: String,
            required: true,
        },
        precio: {
            type: Number,
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
            min: [1, "La cantidad debe ser al menos 1"],
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "La orden debe tener al menos un producto",
            },
        },
        total: {
            type: Number,
            required: true,
            min: [0, "El total no puede ser negativo"],
        },
        estado: {
            type: String,
            enum: ["pendiente", "confirmada", "cancelada"],
            default: "confirmada",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);