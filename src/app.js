require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const sequelize = require('./config/database');

// Importa os models para que o Sequelize registre as tabelas
require('./models/Order');
require('./models/Item');

const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware para parsing de JSON
app.use(express.json());

// Documentação Swagger disponível em /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/auth', authRoutes);
app.use('/order', orderRoutes);

// Sincroniza os models com o banco e sobe o servidor
const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true }) // alter: true atualiza as tabelas sem recriar
  .then(() => {
    console.log('Banco de dados sincronizado.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error.message);
    process.exit(1);
  });

module.exports = app;
