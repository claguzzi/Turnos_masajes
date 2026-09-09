// src/routes/userRouter.js
const { Router } = require("express");
const { crearTurnoHandler,
  obtenerTurnosHandler,
  actualizarTurnoHandler,
  eliminarTurnoHandler, }
  = require("../handlers/turnos");




const TurnosRouter = Router();
const { requireAdmin } = require("../middleware/auth");



TurnosRouter.post('/', crearTurnoHandler);
TurnosRouter.get('/', obtenerTurnosHandler);
TurnosRouter.get('/admin', requireAdmin, obtenerTurnosHandler);
TurnosRouter.put('/:id', requireAdmin, actualizarTurnoHandler);
TurnosRouter.delete('/:id', requireAdmin, eliminarTurnoHandler);





module.exports = TurnosRouter;
