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
    // 🧾 ID del pago en Mercado Pago
  }, {
    timestamps: true, // createdAt / updatedAt
    indexes: [
      {
        unique: true,
        fields: ["fecha", "hora"],
        name: "turnos_fecha_hora_unico",
      },
    ],
  });
};
