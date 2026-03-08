const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Jitterbit Orders API',
      version: '1.0.0',
      description: 'API para gerenciamento de pedidos — Teste Técnico Jitterbit',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        PedidoInput: {
          type: 'object',
          required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
          properties: {
            numeroPedido: { type: 'string', example: 'v10089015vdb-01' },
            valorTotal: { type: 'number', example: 10000 },
            dataCriacao: { type: 'string', format: 'date-time', example: '2023-07-19T12:24:11.529Z' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  idItem: { type: 'string', example: '2434' },
                  quantidadeItem: { type: 'integer', example: 1 },
                  valorItem: { type: 'number', example: 1000 },
                },
              },
            },
          },
        },
      },
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
