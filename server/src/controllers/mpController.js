const { MercadoPagoConfig, Preference } = require("mercadopago");



const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const crearPreferencia = async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: "Seña Turno de masajes",
          quantity: 1,
          unit_price: 5000,
          currency_id: "ARS",
          sandbox_mode: true
        }
      ],
      back_urls: {
        success: "http://localhost:5174/success",
        failure: "http://localhost:5174/failure",
        pending: "http://localhost:5174/pending"
      },
      // auto_return: "approved"
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { crearPreferencia };
