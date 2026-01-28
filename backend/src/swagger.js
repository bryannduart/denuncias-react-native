const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Denúncias",
    version: "1.0.0",
    description:
      "Documentação da API do projeto Denúncias (Express + Prisma + JWT + RabbitMQ).",
  },
  servers: [
    {
      url: "http://localhost:3333",
      description: "Servidor local",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "admin@email.com" },
          password: { type: "string", example: "123456" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..." },
        },
      },

      DenunciaCreate: {
        type: "object",
        required: ["nome", "cpf", "idade", "sexo", "endereco", "cep"],
        properties: {
          nome: { type: "string", example: "Maria Oliveira" },
          cpf: { type: "string", example: "12345678901" },
          idade: { type: "integer", example: 25 },
          sexo: { type: "string", example: "Feminino" },
          endereco: { type: "string", example: "Rua Teste, 100" },
          cep: { type: "string", example: "01001000" },
          complemento: { type: "string", nullable: true, example: "Apto 10" },
        },
      },
      DenunciaResponse: {
        type: "object",
        properties: {
          id: { type: "integer", example: 5 },
          nome: { type: "string", example: "Maria Oliveira" },
          cpf: { type: "string", example: "12345678901" },
          idade: { type: "integer", example: 25 },
          sexo: { type: "string", example: "Feminino" },
          endereco: { type: "string", example: "Rua Teste, 100" },
          cep: { type: "string", example: "01001000" },
          complemento: { type: "string", nullable: true, example: "Apto 10" },
          createdAt: { type: "string", example: "2026-01-28T16:00:00.000Z" },
          updatedAt: { type: "string", example: "2026-01-28T16:00:00.000Z" },
        },
      },
    },
  },
  tags: [
    { name: "Health", description: "Verificação de status" },
    { name: "Auth", description: "Autenticação" },
    { name: "Denúncias", description: "CRUD de denúncias" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Healthcheck da API e banco",
        responses: {
          200: {
            description: "API OK e banco conectado",
            content: {
              "application/json": {
                example: { status: "ok", db: "connected" },
              },
            },
          },
          500: {
            description: "Banco falhou",
            content: {
              "application/json": {
                example: { status: "error", db: "failed" },
              },
            },
          },
        },
      },
    },

    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login (retorna JWT)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          401: { description: "Credenciais inválidas" },
        },
      },
    },

    "/denuncias": {
      get: {
        tags: ["Denúncias"],
        summary: "Listar denúncias (protegido)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de denúncias",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/DenunciaResponse" },
                },
              },
            },
          },
          401: { description: "Sem token/Token inválido" },
        },
      },

      post: {
        tags: ["Denúncias"],
        summary: "Criar denúncia (protegido)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DenunciaCreate" },
            },
          },
        },
        responses: {
          201: {
            description: "Criada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DenunciaResponse" },
              },
            },
          },
          400: { description: "Dados inválidos" },
          401: { description: "Sem token/Token inválido" },
        },
      },
    },

    "/denuncias/{id}": {
      put: {
        tags: ["Denúncias"],
        summary: "Atualizar denúncia (protegido)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            example: 5,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DenunciaCreate" },
            },
          },
        },
        responses: {
          200: {
            description: "Atualizada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DenunciaResponse" },
              },
            },
          },
          401: { description: "Sem token/Token inválido" },
          404: { description: "Não encontrada" },
        },
      },

      delete: {
        tags: ["Denúncias"],
        summary: "Deletar denúncia (protegido)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            example: 5,
          },
        ],
        responses: {
          200: { description: "Deletada" },
          401: { description: "Sem token/Token inválido" },
          404: { description: "Não encontrada" },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: [], // a gente não vai usar comentários por enquanto (mais simples)
});

module.exports = swaggerSpec;
