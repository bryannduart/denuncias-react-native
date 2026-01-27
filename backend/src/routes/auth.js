const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../prisma");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Valida entrada
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    // 2) Busca usuário no banco
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3) Se não achou, já retorna 401
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // 4) Compara senha digitada com o hash do banco
    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // 5) Gera token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    return res.status(200).json({ token });
  } catch (e) {
    console.log("ERRO /login:", e);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

module.exports = router;
