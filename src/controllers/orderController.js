const Order = require('../models/Order');
const Item = require('../models/Item');

/**
 * Mapeia o body da requisição (formato do cliente) para o formato do banco de dados.
 * numeroPedido -> orderId
 * valorTotal   -> value
 * dataCriacao  -> creationDate
 * idItem       -> productId
 * quantidadeItem -> quantity
 * valorItem    -> price
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

// POST /order — Cria um novo pedido
const criarPedido = async (req, res) => {
  try {
    const { orderId, value, creationDate, items } = mapearPedido(req.body);

    // Verifica se já existe um pedido com o mesmo ID
    const pedidoExistente = await Order.findByPk(orderId);
    if (pedidoExistente) {
      return res.status(409).json({ error: `Pedido com ID "${orderId}" já existe.` });
    }

    // Cria o pedido no banco
    const pedido = await Order.create({ orderId, value, creationDate });

    // Cria os itens vinculados ao pedido
    const itensCriados = await Item.bulkCreate(
      items.map((item) => ({ ...item, orderId }))
    );

    return res.status(201).json({ ...pedido.toJSON(), items: itensCriados });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar pedido.', details: error.message });
  }
};

// GET /order/list — Lista todos os pedidos
const listarPedidos = async (req, res) => {
  try {
    const pedidos = await Order.findAll({ include: [{ model: Item, as: 'items' }] });
    return res.status(200).json(pedidos);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar pedidos.', details: error.message });
  }
};

// GET /order/:orderId — Busca um pedido pelo ID
const buscarPedido = async (req, res) => {
  try {
    const pedido = await Order.findByPk(req.params.orderId, {
      include: [{ model: Item, as: 'items' }],
    });

    if (!pedido) {
      return res.status(404).json({ error: `Pedido "${req.params.orderId}" não encontrado.` });
    }

    return res.status(200).json(pedido);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar pedido.', details: error.message });
  }
};

// PUT /order/:orderId — Atualiza um pedido pelo ID
const atualizarPedido = async (req, res) => {
  try {
    const pedido = await Order.findByPk(req.params.orderId);

    if (!pedido) {
      return res.status(404).json({ error: `Pedido "${req.params.orderId}" não encontrado.` });
    }

    const { value, creationDate, items } = mapearPedido({
      numeroPedido: req.params.orderId,
      valorTotal: req.body.valorTotal ?? pedido.value,
      dataCriacao: req.body.dataCriacao ?? pedido.creationDate,
      items: req.body.items ?? [],
    });

    // Atualiza os dados do pedido
    await pedido.update({ value, creationDate });

    // Se novos itens foram enviados, remove os antigos e insere os novos
    if (req.body.items && req.body.items.length > 0) {
      await Item.destroy({ where: { orderId: pedido.orderId } });
      await Item.bulkCreate(items.map((item) => ({ ...item, orderId: pedido.orderId })));
    }

    const pedidoAtualizado = await Order.findByPk(pedido.orderId, {
      include: [{ model: Item, as: 'items' }],
    });

    return res.status(200).json(pedidoAtualizado);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar pedido.', details: error.message });
  }
};

// DELETE /order/:orderId — Deleta um pedido pelo ID
const deletarPedido = async (req, res) => {
  try {
    const pedido = await Order.findByPk(req.params.orderId);

    if (!pedido) {
      return res.status(404).json({ error: `Pedido "${req.params.orderId}" não encontrado.` });
    }

    // Os itens são deletados automaticamente pelo CASCADE definido no model
    await pedido.destroy();

    return res.status(200).json({ message: `Pedido "${req.params.orderId}" deletado com sucesso.` });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar pedido.', details: error.message });
  }
};

module.exports = { criarPedido, listarPedidos, buscarPedido, atualizarPedido, deletarPedido };
