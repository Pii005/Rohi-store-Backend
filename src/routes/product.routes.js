const express = require("express");
const router = express.Router();
const { create, getAll, getById, update, remove } = require("../controllers/product.controller");
const { verificarToken, esAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.post("/", verificarToken, esAdmin, upload.single("imagen"), create);
// públicas
router.get("/", getAll);
router.get("/:id", getById);

// protegidas
router.post("/", verificarToken, esAdmin, upload.single("imagen"), create);
router.put("/:id", verificarToken, esAdmin, upload.single("imagen"), update);
router.delete("/:id", verificarToken, esAdmin, remove);

module.exports = router;