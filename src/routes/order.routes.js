const express = require("express");
const router = express.Router();
const { create, getMisOrdenes, getAll } = require("../controllers/order.controller");
const { verificarToken, esAdmin } = require("../middlewares/auth.middleware");

router.post("/", verificarToken, create);
router.get("/mis-ordenes", verificarToken, getMisOrdenes);
router.get("/", verificarToken, esAdmin, getAll);

module.exports = router;