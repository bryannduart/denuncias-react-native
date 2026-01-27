require("dotenv").config();

const express = require("express");
const cors = require("cors");

const prisma = require("./prisma");

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

// Start do Servidor
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
