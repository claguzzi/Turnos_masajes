const { Turnos } = require('../db');

const crearTurnoController = async (data) => {
  const { nombre, telefono, email, fecha, hora } = data;
  if (!nombre || !telefono || !email || !fecha || !hora) {
    const error = new Error("Completá todos los campos obligatorios");
    error.status = 400;
    throw error;
  }
  if (!/^\d{10,15}$/.test(String(telefono))) {
    const error = new Error("El teléfono debe contener entre 10 y 15 dígitos");
    error.status = 400;
    throw error;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    const error = new Error("La fecha u hora no tienen un formato válido");
    error.status = 400;
    throw error;
  }
  const nuevoTurno = await Turnos.create({ nombre, telefono, email, fecha, hora });
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
  const estados = ["pendiente", "confirmado", "realizado", "bloqueado", "cancelado"];
  if (!estados.includes(data.estado)) {
    const error = new Error("Estado no válido");
    error.status = 400;
    throw error;
  }
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
