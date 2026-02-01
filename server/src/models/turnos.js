const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Turnos', {

   
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    hora: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    estado: {
      type: DataTypes.ENUM(
        'pendiente',
        'confirmado',
        'realizado',
        'bloqueado',
        'cancelado'
      ),
      defaultValue: 'pendiente',
    },

    // 💰 Pago
    pagado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // 🧾 ID del pago en Mercado Pago
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  }, {
    timestamps: true, // createdAt / updatedAt
  });
};
