const {Sequelize} = require('sequelize');

const database = new Sequelize(
  'dashboard_seguridad', // nombre de la base de datos
  'root', //nombre de usuario
  '', //contraseña
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

module.exports = database;