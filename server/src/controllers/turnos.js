const { Turnos } = require('../db');

const crearTurnoController = async (data) => {
  const nuevoTurno = await Turnos.create(data);
  return nuevoTurno;
};


const obtenerTurnosController = async (fecha) => {
  const where = fecha ? { fecha } : {};

  const turnos = await Turnos.findAll({
    where,
    order: [['fecha', 'ASC'], ['hora', 'ASC']]
  });

  return turnos;
};


const actualizarTurnoController = async (id, data) => {
  const turno = await Turnos.findByPk(id);
  if (!turno) throw new Error('Turno no encontrado');
  await turno.update(data);
  return turno;
};

const eliminarTurnoController = async (id) => {
  const eliminado = await Turnos.destroy({ where: { id } });
  if (!eliminado) throw new Error('Turno no encontrado');
  return { mensaje: 'Turno eliminado correctamente' };
};

module.exports = {
  crearTurnoController,
  obtenerTurnosController,
  actualizarTurnoController,
  eliminarTurnoController
};
