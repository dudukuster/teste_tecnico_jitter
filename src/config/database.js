const { Sequelize } = require('sequelize');

// Instância do Sequelize conectando ao PostgreSQL via variáveis de ambiente
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // desativa logs SQL no console
  }
);

module.exports = sequelize;
