const express = require("express");
const router = express.Router();
const { register, login, getAll, getById, update, remove } = require("../controllers/user.controller");
const { verificarToken, esAdmin } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);

router.get("/", verificarToken, esAdmin, getAll);
router.get("/:id", verificarToken, getById);
router.put("/:id", verificarToken, update);
router.delete("/:id", verificarToken, esAdmin, remove);

module.exports = router;