const database = require("../model/database");
const { DataTypes } = require("sequelize");
var nameTable = 'sonoff';  //nombre de la tabla

const sonoffPow = database.define(nameTable, {
  deviceid: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  voltaje: {
    type: DataTypes.DECIMAL,
  },
  status: {
    type: DataTypes.BOOLEAN,
  },
});




module.exports = sonoffPow