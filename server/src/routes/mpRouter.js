const { Router } = require("express");
const { crearPreferencia } = require("../controllers/mpController");

const mpRouter = Router();

// Ruta para crear preferencia de pago
mpRouter.post("/create_preference", crearPreferencia);

module.exports = mpRouter;
