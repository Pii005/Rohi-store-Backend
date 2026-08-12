const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre es obligatorio"],
            trim: true,
        },
        precio: {
            type: Number,
            required: [true, "El precio es obligatorio"],
            min: [0, "El precio no puede ser negativo"],
        },
        descripcion: {
            type: String,
            required: [true, "La descripción es obligatoria"],
            trim: true,
        },
        stock: {
            type: Number,
            required: [true, "El stock es obligatorio"],
            min: [0, "El stock no puede ser negativo"],
            default: 0,
        },
        categoria: {
            type: String,
            required: [true, "La categoría es obligatoria"],
            trim: true,
            lowercase: true,
        },
        imagen: {
            type: String,
            required: [true, "La imagen es obligatoria"],
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);