# Api-Product-Manager
[![NPM](https://img.shields.io/npm/l/react)](https://github.com/GabrielSS187/api-product-manager/blob/main/LICENSE) 

# Sobre o projeto

### Api Documentação: [Api-Product-Manager-Doc](https://documenter.getpostman.com/view/18692384/2s93Xu1Qx2#2cd108d5-7ff2-415f-8183-0d744d834a2f)

A api: ``Api-Product-Manager``, consiste em ser uma api rest facíl de sí usar. Para gerenciar produtos de games. Com as categorias
disponíveis para criação: game, console, pc e monitor. A api possui um sitema ``CRUD`` completo, onde você pode criar, buscar, editar e deletar produtos.
Mais para as ações de criar, editar e deletar são apenas para usuários administradores.

## Rotas

### User
- 1 - ``SIGN-UP`` : ``POST`` http://localhost:8000/user/sign-up
- 2 - ``SIGN-IN`` : ``POST`` http://localhost:8000/user/sign-in

### Product
- 1 - ``CREATE-PRODUCT`` : ``POST`` http://localhost:8000/product
- 2 - ``EDIT-PRODUCT`` : ``PATCH`` http://localhost:8000/product/:id
- 3 - ``DELETE-PRODUCT`` : ``DELETE`` http://localhost:8000/product/:id
- 4 - ``GET-PRODUCT`` : ``GET`` http://localhost:8000/product/:id
- 5 - ``GET-ALL-PRODUCT`` : ``GET`` http://localhost:8000/product
- 6 - ``GET-ALL-CATEGORIES`` : ``GET`` http://localhost:8000/product/categories

## Schemas

### User - Schema
```typescript
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "normal"],
      default: "normal",
      required: true,
    },
  },
  { timestamps: true }
);
```

## Product / Category - Schema
```typescript
const categorySchema: Schema = new mongoose.Schema({
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		default: null,
	},
	_id: { type: mongoose.Schema.Types.ObjectId, required: true },
	name: { type: String, required: true },
});

const productSchema: Schema = new mongoose.Schema({
	categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
	name: { type: String, required: true, unique: true },
	qty: { type: Number, required: true },
	price: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
});
```

## Competências
- Boas Práticas
- Princípios ( S.O.L.I.D )
- Testes Automatizados ( TDD )
- Design Patterns
- Design Systems
- Clean Code

# Tecnologias utilizadas

## Banco de dados
- Mongo DB

## ORM
- Mongoose

## Outras Tecnologias
- Node Js
- TypeScript
- Cors
- Express Js
- Tsup
- Tsx
- Jsonwebtoken
- Zod
- Bcryptjs
- Vitest
- Env

# Como executar o projeto na sua máquina 💻💻

#### Pré-requisitos: npm / yarn / pnpm
#### É preencher as variáveis de ambiente do .env

#### ===============================================================================
```bash
# 1 - clonar repositório
git clone https://github.com/GabrielSS187/api-product-manager.git

# 2 - entrar na pasta: api-product-manager
cd api-product-manager

# 3 - instalar as dependências
npm install

# 5 - rodar o projeto
npm run start:dev

# caso queira roda todos os testes, rode o comando
npm run test
```
#### =================================================================================

### Caso nada de errado o projeto vai esta rodando na rota: http://localhost:8000

# Autor

Gabriel Silva Souza

https://www.linkedin.com/in/gabriel-silva-souza-developer

