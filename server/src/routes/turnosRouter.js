// src/routes/userRouter.js
const { Router } = require("express");
const { crearTurnoHandler,
  obtenerTurnosHandler,
  actualizarTurnoHandler,
  eliminarTurnoHandler, }
  = require("../handlers/turnos");




const TurnosRouter = Router();



TurnosRouter.post('/', crearTurnoHandler);
TurnosRouter.get('/', obtenerTurnosHandler);
TurnosRouter.put('/:id', actualizarTurnoHandler);
TurnosRouter.delete('/:id', eliminarTurnoHandler);





module.exports = TurnosRouter;
