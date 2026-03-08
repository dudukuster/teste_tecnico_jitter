const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  criarPedido,
  listarPedidos,
  buscarPedido,
  atualizarPedido,
  deletarPedido,
} = require('../controllers/orderController');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoInput'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       409:
 *         description: Pedido já existe
 *       500:
 *         description: Erro interno
 */
router.post('/', authMiddleware, criarPedido);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 */
router.get('/list', authMiddleware, listarPedidos);

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089016vdb
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:orderId', authMiddleware, buscarPedido);

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     summary: Atualiza um pedido pelo ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoInput'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:orderId', authMiddleware, atualizarPedido);

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Deleta um pedido pelo ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:orderId', authMiddleware, deletarPedido);

module.exports = router;
