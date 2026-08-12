const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ mensaje: "No autorizado, falta token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // queda disponible en los controllers como req.usuario.id
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
};

const esAdmin = (req, res, next) => {
    if (req.usuario.role !== "admin") {
        return res.status(403).json({ mensaje: "Acceso solo para administradores" });
    }
    next();
};

module.exports = { verificarToken, esAdmin };