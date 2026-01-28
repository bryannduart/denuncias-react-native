const { DenunciaQueueSchema, normalizeDenuncia } = require("./schema");
const { logInfo, logError } = require("./logger");

let prisma;
function setPrismaClient(prismaClient) {
  prisma = prismaClient;
}

// erro "transitório" = vale tentar de novo (requeue=true)
function isTransientError(err) {
  const msg = (err && err.message ? err.message : "").toLowerCase();
  return (
    msg.includes("timeout") ||
    msg.includes("connection") ||
    msg.includes("econnrefused") ||
    msg.includes("could not connect") ||
    msg.includes("server has closed the connection")
  );
}

async function handleDenunciaMessage(rawContent) {
  // 1) parse do JSON
  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch (err) {
    return {
      ok: false,
      type: "BAD_JSON",
      requeue: false,
      error: "JSON inválido",
      details: err.message,
    };
  }

  // 2) validar campos obrigatórios
  const result = DenunciaQueueSchema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      type: "VALIDATION_ERROR",
      requeue: false,
      error: "Campos inválidos ou faltando",
      details: result.error.flatten(),
    };
  }

  // 3) normalizar (aceita localizacao.* ou direto)
  const data = normalizeDenuncia(result.data);

  // validação extra após normalização
  if (!data.endereco || !data.cep) {
    return {
      ok: false,
      type: "VALIDATION_ERROR",
      requeue: false,
      error: "endereco e cep são obrigatórios (direto ou localizacao.*)",
      details: data,
    };
  }

  // 4) salvar no banco via Prisma
  try {
    if (!prisma) throw new Error("Prisma client não configurado no handler.");

    const saved = await prisma.denuncia.create({
      data: {
        nome: data.nomeCompleto,
        cpf: data.cpf,
        idade: data.idade,
        sexo: data.sexo,
        endereco: data.endereco,
        cep: data.cep,
        complemento: data.complemento,
      },
    });

    logInfo("Denúncia salva via RabbitMQ!", { id: saved.id });
    return { ok: true };
  } catch (err) {
    const transient = isTransientError(err);

    logError("Erro ao salvar denúncia via RabbitMQ", {
      error: err.message,
      transient,
    });

    return {
      ok: false,
      type: "DB_ERROR",
      requeue: transient, // true se parece erro de infra
      error: err.message,
    };
  }
}

module.exports = { handleDenunciaMessage, setPrismaClient };
