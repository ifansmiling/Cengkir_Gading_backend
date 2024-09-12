const Sequelize = require("sequelize");

const db = new Sequelize("db_gading-cengkir", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const database = db;

module.exports = database;