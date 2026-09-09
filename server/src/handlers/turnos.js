// handlers/turnosHandlers.js
const {
  crearTurnoController,
  obtenerTurnosController,
  actualizarTurnoController,
  eliminarTurnoController,
} = require('../controllers/turnos');
const sendEmail = require("../controllers/sendEmail");

const escapeHtml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

// Handler para crear un turno
const crearTurnoHandler = async (req, res) => {
  try {
    const data = req.body;
    const nuevoTurno = await crearTurnoController(data);
    const nombre = escapeHtml(nuevoTurno.nombre);
    const fecha = escapeHtml(nuevoTurno.fecha);
    const hora = escapeHtml(nuevoTurno.hora);
    const html = `
      <!doctype html>
      <html lang="es">
        <body style="margin:0;background:#f4efe9;font-family:Arial,Helvetica,sans-serif;color:#44403c;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;background:#f4efe9;">
            <tr><td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fff;border:1px solid #e7e5e4;border-radius:16px;overflow:hidden;">
                <tr><td style="padding:32px 24px 20px;text-align:center;background:#7b6f5b;color:#fff;">
                  <h1 style="margin:0;font-family:Georgia,serif;font-size:30px;letter-spacing:1px;">ESPACIO ZEN</h1>
                  <p style="margin:8px 0 0;font-size:14px;opacity:.9;">Masajes relajantes y descontracturantes</p>
                </td></tr>
                <tr><td style="padding:32px;">
                  <h2 style="margin:0 0 16px;font-size:22px;color:#57534e;">¡Tu turno fue reservado!</h2>
                  <p style="margin:0 0 24px;line-height:1.6;">Hola ${nombre},<br>Gracias por elegirnos. Estos son los datos de tu reserva:</p>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f4;border-radius:10px;">
                    <tr><td style="padding:14px 16px;border-bottom:1px solid #e7e5e4;font-weight:bold;width:90px;">Fecha</td><td style="padding:14px 16px;border-bottom:1px solid #e7e5e4;">${fecha}</td></tr>
                    <tr><td style="padding:14px 16px;font-weight:bold;">Horario</td><td style="padding:14px 16px;">${hora}</td></tr>
                  </table>
                  <p style="margin:24px 0 0;line-height:1.6;">Te esperamos para que disfrutes un momento de calma y bienestar.</p>
                </td></tr>
                <tr><td style="padding:20px 32px;text-align:center;background:#f5f5f4;color:#78716c;font-size:12px;">Espacio Zen · Reserva confirmada</td></tr>
              </table>
            </td></tr>
          </table>
        </body>
      </html>`;
    const mensaje = `Hola ${nuevoTurno.nombre},\n\nTu turno fue reservado correctamente.\n\nFecha: ${nuevoTurno.fecha}\nHora: ${nuevoTurno.hora}\n\nEspacio Zen`;
    try {
      await sendEmail({
        to: nuevoTurno.email,
        subject: "Confirmación de turno — Espacio Zen",
        text: mensaje,
        html,
      });
    } catch (emailError) {
      console.error("No se pudo enviar el correo de confirmación:", emailError.message);
    }
    res.status(201).json(nuevoTurno);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Ese horario ya fue reservado" });
    }
    res.status(error.status || 400).json({ error: error.message });
  }
};

// Handler para obtener todos los turnos
const obtenerTurnosHandler = async (req, res) => {
  try {
    const { fecha } = req.query;

    if (!fecha && !req.admin) {
      return res.status(400).json({ error: "Indicá una fecha para consultar disponibilidad" });
    }

    const turnos = await obtenerTurnosController(fecha);
    res.status(200).json(req.admin ? turnos : turnos.map(({ hora }) => ({ hora })));
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
