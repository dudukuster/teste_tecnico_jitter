// Mocka o index de models antes de importar o service,
// evitando qualquer conexão real com o banco de dados
jest.mock('../models');

const orderService = require('../services/orderService');
const { Order, Item } = require('../models');

// Body de entrada no formato que o cliente envia
const bodyEntrada = {
  numeroPedido: 'v10089015vdb-01',
  valorTotal: 10000,
  dataCriacao: '2023-07-19T12:24:11.529Z',
  items: [{ idItem: '2434', quantidadeItem: 1, valorItem: 1000 }],
};

// Pedido no formato salvo no banco (após mapeamento)
const pedidoBanco = {
  orderId: 'v10089015vdb-01',
  value: 10000,
  creationDate: new Date('2023-07-19T12:24:11.529Z'),
  items: [{ productId: 2434, quantity: 1, price: 1000, orderId: 'v10089015vdb-01' }],
  toJSON: function () {
    return { orderId: this.orderId, value: this.value, creationDate: this.creationDate };
  },
  update: jest.fn(),
  destroy: jest.fn(),
};

// Limpa os mocks entre cada teste para evitar interferência
beforeEach(() => jest.clearAllMocks());

// ─── criarPedido ────────────────────────────────────────────────────────────

describe('criarPedido', () => {
  test('deve criar um pedido com sucesso e retornar os dados mapeados', async () => {
    Order.findByPk.mockResolvedValue(null); // pedido ainda não existe
    Order.create.mockResolvedValue(pedidoBanco);
    Item.bulkCreate.mockResolvedValue(pedidoBanco.items);

    const resultado = await orderService.criarPedido(bodyEntrada);

    expect(Order.findByPk).toHaveBeenCalledWith('v10089015vdb-01');
    expect(Order.create).toHaveBeenCalledWith({
      orderId: 'v10089015vdb-01',
      value: 10000,
      creationDate: new Date('2023-07-19T12:24:11.529Z'),
    });
    expect(resultado.items).toHaveLength(1);
    expect(resultado.items[0].productId).toBe(2434);
  });

  test('deve lançar erro 409 quando o pedido já existe', async () => {
    Order.findByPk.mockResolvedValue(pedidoBanco); // pedido já existe

    await expect(orderService.criarPedido(bodyEntrada)).rejects.toMatchObject({
      status: 409,
      message: 'Pedido com ID "v10089015vdb-01" já existe.',
    });

    expect(Order.create).not.toHaveBeenCalled();
  });
});

// ─── listarPedidos ──────────────────────────────────────────────────────────

describe('listarPedidos', () => {
  test('deve retornar a lista de todos os pedidos', async () => {
    Order.findAll.mockResolvedValue([pedidoBanco]);

    const resultado = await orderService.listarPedidos();

    expect(Order.findAll).toHaveBeenCalledTimes(1);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].orderId).toBe('v10089015vdb-01');
  });
});

// ─── buscarPedido ───────────────────────────────────────────────────────────

describe('buscarPedido', () => {
  test('deve retornar o pedido quando encontrado', async () => {
    Order.findByPk.mockResolvedValue(pedidoBanco);

    const resultado = await orderService.buscarPedido('v10089015vdb-01');

    expect(Order.findByPk).toHaveBeenCalledWith('v10089015vdb-01', expect.any(Object));
    expect(resultado.orderId).toBe('v10089015vdb-01');
  });

  test('deve lançar erro 404 quando o pedido não for encontrado', async () => {
    Order.findByPk.mockResolvedValue(null);

    await expect(orderService.buscarPedido('inexistente')).rejects.toMatchObject({
      status: 404,
      message: 'Pedido "inexistente" não encontrado.',
    });
  });
});

// ─── atualizarPedido ────────────────────────────────────────────────────────

describe('atualizarPedido', () => {
  test('deve atualizar o pedido com sucesso', async () => {
    const pedidoAtualizado = { ...pedidoBanco, value: 20000 };

    // Primeira chamada: busca para verificar existência
    // Segunda chamada: busca para retornar o pedido atualizado
    Order.findByPk
      .mockResolvedValueOnce(pedidoBanco)
      .mockResolvedValueOnce(pedidoAtualizado);

    Item.destroy.mockResolvedValue(1);
    Item.bulkCreate.mockResolvedValue(pedidoBanco.items);

    const resultado = await orderService.atualizarPedido('v10089015vdb-01', {
      valorTotal: 20000,
      dataCriacao: '2023-07-19T12:24:11.529Z',
      items: [{ idItem: '2434', quantidadeItem: 2, valorItem: 1000 }],
    });

    expect(pedidoBanco.update).toHaveBeenCalled();
    expect(resultado.value).toBe(20000);
  });

  test('deve lançar erro 404 ao tentar atualizar pedido inexistente', async () => {
    Order.findByPk.mockResolvedValue(null);

    await expect(
      orderService.atualizarPedido('inexistente', bodyEntrada)
    ).rejects.toMatchObject({
      status: 404,
      message: 'Pedido "inexistente" não encontrado.',
    });
  });
});

// ─── deletarPedido ──────────────────────────────────────────────────────────

describe('deletarPedido', () => {
  test('deve deletar o pedido com sucesso e retornar mensagem de confirmação', async () => {
    Order.findByPk.mockResolvedValue(pedidoBanco);

    const resultado = await orderService.deletarPedido('v10089015vdb-01');

    expect(pedidoBanco.destroy).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual({ message: 'Pedido "v10089015vdb-01" deletado com sucesso.' });
  });

  test('deve lançar erro 404 ao tentar deletar pedido inexistente', async () => {
    Order.findByPk.mockResolvedValue(null);

    await expect(orderService.deletarPedido('inexistente')).rejects.toMatchObject({
      status: 404,
      message: 'Pedido "inexistente" não encontrado.',
    });

    expect(pedidoBanco.destroy).not.toHaveBeenCalled();
  });
});
