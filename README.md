# Jitterbit Orders API

API REST para gerenciamento de pedidos desenvolvida como parte do Teste Técnico Jitterbit.

---

## Tecnologias

- **Node.js** + **Express**
- **Sequelize** (ORM)
- **PostgreSQL**
- **JWT** — autenticação
- **Swagger** — documentação
- **Jest** — testes unitários

---

## Arquitetura

O projeto segue uma arquitetura simples em camadas:

```
Route → Controller → Service → Model
```

| Camada | Responsabilidade |
|---|---|
| **Route** | Define os endpoints e aplica middlewares |
| **Controller** | Recebe a requisição, aciona o serviço responsável e retorna a resposta HTTP |
| **Service** | Controla as Regras de negócio e mapeia os dados |
| **Model** | Entidade das tabelas no banco de dados |

```
src/
├── config/        # Configurações de banco e Swagger
├── controllers/   # Camada HTTP
├── middleware/    # Validação JWT
├── models/        # Tabelas e associações
├── routes/        # Endpoints
├── services/      # Regras de negócio
└── tests/         # Testes unitários
```

---

## Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/dudukuster/teste_tecnico_jitter.git
cd teste_tecnico_jitter
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

### 3. Banco de dados

Caso prefira, disponibilizei um `docker-compose.yml` que sobe o PostgreSQL automaticamente sem necessidade de instalação local:

```bash
docker compose up -d
```

Caso prefira usar seu próprio PostgreSQL, basta ajustar as variáveis no `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jitterbit_orders
DB_USER=postgres
DB_PASS=sua_senha
```

### 4. Instale as dependências e inicie

```bash
npm install
npm start
```

A API estará disponível em **http://localhost:3000**

---

## Documentação

Acesse o Swagger em: **http://localhost:3000/api-docs**

### Autenticação no Swagger

1. Faça `POST /auth/login` com as credenciais abaixo e copie o token retornado:
```json
{ "username": "admin", "password": "admin123" }
```

2. Clique em **Authorize** e cole **apenas o token**, sem o prefixo `Bearer` — o Swagger já o adiciona automaticamente.

---

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Gera token JWT |
| POST | `/order` | Cria um pedido |
| GET | `/order/list` | Lista todos os pedidos |
| GET | `/order/:orderId` | Busca um pedido pelo ID |
| PUT | `/order/:orderId` | Atualiza um pedido |
| DELETE | `/order/:orderId` | Deleta um pedido |

### Exemplo de requisição

```bash
curl --location 'http://localhost:3000/order' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>' \
--data '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [{ "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 }]
}'
```

### Mapeamento de campos

A API transforma os dados recebidos antes de salvar no banco:

| Input | Banco |
|---|---|
| `numeroPedido` | `orderId` |
| `valorTotal` | `value` |
| `dataCriacao` | `creationDate` |
| `idItem` | `productId` |
| `quantidadeItem` | `quantity` |
| `valorItem` | `price` |

---

## Testes

```bash
npm test
```

9 testes unitários cobrindo todos os cenários de sucesso e erro do `orderService`, utilizando mocks do Jest sem necessidade de conexão com o banco.
