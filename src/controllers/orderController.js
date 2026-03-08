const orderService = require('../services/orderService');

// POST /order
const criarPedido = async (req, res) => {
  try {
    const pedido = await orderService.criarPedido(req.body);
    return res.status(201).json(pedido);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
};

// GET /order/list
const listarPedidos = async (req, res) => {
  try {
    const pedidos = await orderService.listarPedidos();
    return res.status(200).json(pedidos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /order/:orderId
const buscarPedido = async (req, res) => {
  try {
    const pedido = await orderService.buscarPedido(req.params.orderId);
    return res.status(200).json(pedido);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
};

// PUT /order/:orderId
const atualizarPedido = async (req, res) => {
  try {
    const pedido = await orderService.atualizarPedido(req.params.orderId, req.body);
    return res.status(200).json(pedido);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
};

// DELETE /order/:orderId
const deletarPedido = async (req, res) => {
  try {
    const resultado = await orderService.deletarPedido(req.params.orderId);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = { criarPedido, listarPedidos, buscarPedido, atualizarPedido, deletarPedido };
