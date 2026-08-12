const {
    registrarUsuario,
    loginUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
} = require("../services/user.service");

const register = async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                mensaje: "Nombre, email y password son obligatorios",
            });
        }

        const resultado = await registrarUsuario({ nombre, email, password });
        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                mensaje: "Email y password son obligatorios",
            });
        }

        const resultado = await loginUsuario({ email, password });
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const usuario = await obtenerUsuarioPorId(req.params.id);
        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const usuario = await actualizarUsuario(req.params.id, req.body);
        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await eliminarUsuario(req.params.id);
        res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getAll, getById, update, remove };