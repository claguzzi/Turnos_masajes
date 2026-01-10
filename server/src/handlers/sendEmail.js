const sendEmailController = require('../controllers/sendEmail'); // ajustar ruta según tu estructura

const sendEmailHandler = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    // Validación básica
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: to, subject y text o html' });
    }

    await sendEmailController({ to, subject, text, html });

    res.status(200).json({ message: 'Correo electrónico enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = sendEmailHandler;
