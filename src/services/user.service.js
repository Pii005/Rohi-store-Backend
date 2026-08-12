const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generarToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

const registrarUsuario = async ({ nombre, email, password }) => {
    const existe = await User.findOne({ email });
    if (existe) {
        const error = new Error("Ya existe un usuario con ese email");
        error.statusCode = 400;
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await User.create({
        nombre,
        email,
        password: passwordHash,
    });

    const token = generarToken(nuevoUsuario._id, nuevoUsuario.role);

    return {
        usuario: {
            id: nuevoUsuario._id,
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email,
            role: nuevoUsuario.role,
        },
        token,
    };
};

const loginUsuario = async ({ email, password }) => {
    const usuario = await User.findOne({ email });
    if (!usuario) {
        const error = new Error("Credenciales inválidas");
        error.statusCode = 401;
        throw error;
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
        const error = new Error("Credenciales inválidas");
        error.statusCode = 401;
        throw error;
    }

    const token = generarToken(usuario._id, usuario.role);

    return {
        usuario: {
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            role: usuario.role,
        },
        token,
    };
};

const obtenerUsuarios = async () => {
    // select("-password") excluye el campo password de la respuesta
    const usuarios = await User.find().select("-password");
    return usuarios;
};

const obtenerUsuarioPorId = async (id) => {
    const usuario = await User.findById(id).select("-password");
    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        error.statusCode = 404;
        throw error;
    }
    return usuario;
};

const actualizarUsuario = async (id, datos) => {
    // si viene password en el body, hay que hashearla antes de guardar
    if (datos.password) {
        const salt = await bcrypt.genSalt(10);
        datos.password = await bcrypt.hash(datos.password, salt);
    }

    const usuario = await User.findByIdAndUpdate(id, datos, {
        new: true,
        runValidators: true,
    }).select("-password");

    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        error.statusCode = 404;
        throw error;
    }

    return usuario;
};

const eliminarUsuario = async (id) => {
    const usuario = await User.findByIdAndDelete(id);
    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        error.statusCode = 404;
        throw error;
    }
    return usuario;
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
};