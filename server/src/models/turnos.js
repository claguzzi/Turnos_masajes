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
        isEmail: true, // valida que tenga formato de email
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
      type: DataTypes.ENUM('pendiente', 'realizado', 'confirmado', 'cancelado'),
      defaultValue: 'pendiente',
    },
    
  }
);
};
