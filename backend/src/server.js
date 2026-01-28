require("dotenv").config();

const express = require("express");
const cors = require("cors");

const prisma = require("./prisma");

// RabbitMQ
const { startConsumer } = require("./rabbitmq/consumer");
const { setPrismaClient } = require("./rabbitmq/handler");

// Documentação Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// ROTAS
const authRoutes = require("./routes/auth");
const denunciasRoutes = require("./routes/denuncias");

// MIDDLEWARE DE AUTENTICAÇÃO (JWT)
const auth = require("./middlewares/auth");

const app = express();
const PORT = process.env.PORT || 3333;

// MIDDLEWARES GLOBAIS
app.use(cors());
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROTAS PÚBLICAS:

// rota de teste (healthcheck)
app.get("/health", async (req, res) => {
  try {
    // consulta simples pra testar conexão com o banco
    await prisma.denuncia.count();
    return res.status(200).json({ status: "ok", db: "connected" });
  } catch (err) {
    console.log("ERRO /health:", err);
    return res.status(500).json({ status: "error", db: "failed" });
  }
});

// USO DA ROTA DE AUTH
app.use("/auth", authRoutes);

// ROTAS PROTEGIDAS (JWT):

// AQUI o middleware auth é usado
app.use("/denuncias", auth, denunciasRoutes);

// 404 (sempre por último, depois das rotas)
app.use((_req, res) => {
  return res.status(404).json({ error: "Rota não encontrada" });
});

// Conecta Prisma ao RabbitMQ handler
setPrismaClient(prisma);

// Inicia consumer RabbitMQ (sem derrubar a API se falhar)
startConsumer().catch((err) => {
  console.error(
    "[RABBITMQ] Consumer não iniciou (API continua rodando).",
    err.message,
  );
});

// Start do Servidor
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
