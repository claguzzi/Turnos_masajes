require('dotenv').config();
const { Sequelize } = require('sequelize');
const TurnosModel = require("./models/turnos");
const UserModel = require("./models/User"); 


const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
  logging: false
});


TurnosModel(sequelize);
UserModel(sequelize); // ✅ definir User


const { Turnos, User } = sequelize.models;

// Exportar sequelize y modelos
module.exports = { sequelize, Turnos, User };
