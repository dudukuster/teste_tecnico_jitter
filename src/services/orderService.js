const { Order, Item } = require('../models');

/**
 * Mapeia o body da requisição (formato do cliente) para o formato do banco de dados.
 * numeroPedido   -> orderId
 * valorTotal     -> value
 * dataCriacao    -> creationDate
 * idItem         -> productId
 * quantidadeItem -> quantity
 * valorItem      -> price
 */
const mapearPedido = (body) => ({
  orderId: body.numeroPedido,
  value: body.valorTotal,
  creationDate: new Date(body.dataCriacao),
  items: body.items.map((item) => ({
    productId: parseInt(item.idItem),
    quantity: item.quantidadeItem,
    price: item.valorItem,
  })),
});

// Cria um novo pedido no banco de dados
const criarPedido = async (body) => {
  const { orderId, value, creationDate, items } = mapearPedido(body);

  const pedidoExistente = await Order.findByPk(orderId);
  if (pedidoExistente) {
    const error = new Error(`Pedido com ID "${orderId}" já existe.`);
    error.status = 409;
    throw error;
  }

  const pedido = await Order.create({ orderId, value, creationDate });
  const itensCriados = await Item.bulkCreate(
    items.map((item) => ({ ...item, orderId }))
  );

  return { ...pedido.toJSON(), items: itensCriados };
};

// Retorna todos os pedidos com seus itens
const listarPedidos = async () => {
  return Order.findAll({ include: [{ model: Item, as: 'items' }] });
};

// Retorna um pedido pelo ID com seus itens
const buscarPedido = async (orderId) => {
  const pedido = await Order.findByPk(orderId, {
    include: [{ model: Item, as: 'items' }],
  });

  if (!pedido) {
    const error = new Error(`Pedido "${orderId}" não encontrado.`);
    error.status = 404;
    throw error;
  }

  return pedido;
};

// Atualiza os dados de um pedido existente
const atualizarPedido = async (orderId, body) => {
  const pedido = await Order.findByPk(orderId);

  if (!pedido) {
    const error = new Error(`Pedido "${orderId}" não encontrado.`);
    error.status = 404;
    throw error;
  }

  const { value, creationDate, items } = mapearPedido({
    numeroPedido: orderId,
    valorTotal: body.valorTotal ?? pedido.value,
    dataCriacao: body.dataCriacao ?? pedido.creationDate,
    items: body.items ?? [],
  });

  await pedido.update({ value, creationDate });

  if (body.items && body.items.length > 0) {
    await Item.destroy({ where: { orderId } });
    await Item.bulkCreate(items.map((item) => ({ ...item, orderId })));
  }

  return Order.findByPk(orderId, { include: [{ model: Item, as: 'items' }] });
};

// Remove um pedido e seus itens do banco de dados
const deletarPedido = async (orderId) => {
  const pedido = await Order.findByPk(orderId);

  if (!pedido) {
    const error = new Error(`Pedido "${orderId}" não encontrado.`);
    error.status = 404;
    throw error;
  }

  await pedido.destroy();
  return { message: `Pedido "${orderId}" deletado com sucesso.` };
};

module.exports = { criarPedido, listarPedidos, buscarPedido, atualizarPedido, deletarPedido };
