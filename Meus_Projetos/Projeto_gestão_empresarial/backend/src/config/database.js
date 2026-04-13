const { Sequelize } = require('sequelize');
require('dotenv').config();

const explicitDialect = process.env.DB_DIALECT;
const hasMysqlConfig = Boolean(
  process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER
);

const dialect = explicitDialect || (hasMysqlConfig ? 'mysql' : 'sqlite');

let sequelize;

if (dialect === 'mysql') {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      dialect: 'mysql',
      logging: false
    }
  );
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: false
  });
}

module.exports = sequelize;
