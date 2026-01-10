// handlers/turnosHandlers.js
const {
  crearTurnoController,
  obtenerTurnosController,
  actualizarTurnoController,
  eliminarTurnoController,
} = require('../controllers/turnos');

// Handler para crear un turno
const crearTurnoHandler = async (req, res) => {
  try {
    const data = req.body;
    const nuevoTurno = await crearTurnoController(data);
    res.status(201).json(nuevoTurno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Handler para obtener todos los turnos
const obtenerTurnosHandler = async (req, res) => {
  try {
    const { fecha } = req.query;

    const turnos = await obtenerTurnosController(fecha);

    res.status(200).json(turnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Handler para actualizar un turno
const actualizarTurnoHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const turnoActualizado = await actualizarTurnoController(id, data);
    res.status(200).json(turnoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Handler para eliminar un turno
const eliminarTurnoHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const mensaje = await eliminarTurnoController(id);
    res.status(200).json(mensaje);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  crearTurnoHandler,
  obtenerTurnosHandler,
  actualizarTurnoHandler,
  eliminarTurnoHandler,
};
