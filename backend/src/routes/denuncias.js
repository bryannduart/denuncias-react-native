const express = require("express");
const prisma = require("../prisma");
const { publishToQueue } = require("../rabbitmq/publisher");

const router = express.Router();

//GET /denuncias
//Lista denúncias (rota protegida)

router.get("/", async (req, res) => {
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

router.post("/", async (req, res) => {
  try {
    const { nome, cpf, idade, sexo, endereco, cep, complemento } = req.body;

    if (
      !nome ||
      !cpf ||
      idade === undefined ||
      idade === null ||
      !sexo ||
      !endereco ||
      !cep
    ) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    const idadeNum = Number(idade);
    if (Number.isNaN(idadeNum)) {
      return res.status(400).json({ error: "Idade inválida." });
    }

    if (idadeNum < 0 || idadeNum > 130) {
      return res.status(400).json({ error: "Idade deve estar entre 0 e 130." });
    }

    if (sexo !== "Masculino" && sexo !== "Feminino") {
      return res
        .status(400)
        .json({ error: "Sexo inválido. Use Masculino ou Feminino." });
    }

    const payload = {
      nomeCompleto: nome,
      cpf: String(cpf),
      idade: idadeNum,
      sexo,
      localizacao: {
        endereco,
        cep: String(cep),
        complemento: complemento || null,
      },
    };

    await publishToQueue(payload);

    return res.status(202).json({
      ok: true,
      message: "Denúncia recebida e enviada para processamento.",
    });
  } catch (err) {
    console.log("ERRO POST /denuncias (fila):", err);
    return res.status(503).json({
      ok: false,
      error: "Não foi possível enviar para a fila agora.",
      details: err.message,
    });
  }
});

// PUT /denuncias/:id
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
