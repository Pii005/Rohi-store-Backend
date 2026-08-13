const errorHandler = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        mensaje: err.message || "Error interno del servidor",
    });
};

module.exports = errorHandler;