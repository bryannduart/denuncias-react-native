const express = require("express");
const prisma = require("../prisma");
const auth = require("../middlewares/auth");

const router = express.Router();

//GET /denuncias
//Lista denúncias (rota protegida)

router.get("/", auth, async (req, res) => {
  try {
    const denuncias = await prisma.denuncia.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(denuncias);
  } catch (err) {
    console.log("ERRO GET /denuncias:", err);
    return res.status(500).json({ error: "Erro ao buscar denúncias" });
  }
});

//POST /denuncias
//Cria denúncia (rota protegida)

router.post("/", auth, async (req, res) => {
  try {
    const { nome, cpf, idade, sexo, endereco, cep, complemento } = req.body;

    if (!nome || !cpf || !idade || !sexo || !endereco || !cep) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    const denuncia = await prisma.denuncia.create({
      data: {
        nome,
        cpf,
        idade,
        sexo,
        endereco,
        cep,
        complemento: complemento || null,
      },
    });

    return res.status(201).json({
      message: "Denúncia criada com sucesso",
      denuncia,
    });
  } catch (err) {
    console.log("ERRO POST /denuncias:", err);
    return res.status(500).json({ error: "Erro ao salvar denúncia." });
  }
});

// PUT /denuncias/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const denuncia = await prisma.denuncia.findUnique({
      where: { id: Number(id) },
    });

    if (!denuncia) {
      return res.status(404).json({ error: "Denúncia não encontrada" });
    }

    const denunciaAtualizada = await prisma.denuncia.update({
      where: { id: Number(id) },
      data: dados,
    });

    return res.status(200).json(denunciaAtualizada);
  } catch (err) {
    console.log("ERRO PUT /denuncias:", err);
    return res.status(500).json({ error: "Erro ao atualizar denúncia" });
  }
});

// DELETE /denuncias/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const idNumber = Number(id);

    // 1) valida se o id é número
    if (isNaN(idNumber)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // 2) verifica se existe
    const denuncia = await prisma.denuncia.findUnique({
      where: { id: idNumber },
    });

    if (!denuncia) {
      return res.status(404).json({ error: "Denúncia não encontrada" });
    }

    // 3) deleta
    await prisma.denuncia.delete({
      where: { id: idNumber },
    });

    // 4) resposta ok
    return res.status(200).json({ message: "Denúncia excluída com sucesso" });
  } catch (err) {
    console.log("ERRO DELETE /denuncias:", err);
    return res.status(500).json({ error: "Erro ao excluir denúncia" });
  }
});

module.exports = router;
