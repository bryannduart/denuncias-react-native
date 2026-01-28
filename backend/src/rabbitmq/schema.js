const { z } = require("zod");

// Aceita:
// - endereco/cep/complemento direto
// OU
// - localizacao: { endereco, cep, complemento }
const DenunciaQueueSchema = z.object({
  nomeCompleto: z.string().min(3),
  cpf: z.string().min(11),
  idade: z.number().int().min(0).max(130),
  sexo: z.enum(["Masculino", "Feminino"]),

  endereco: z.string().optional(),
  cep: z.string().optional(),
  complemento: z.string().optional(),

  localizacao: z
    .object({
      endereco: z.string().optional(),
      cep: z.string().optional(),
      complemento: z.string().optional(),
    })
    .optional(),
});

function normalizeDenuncia(input) {
  const loc = input.localizacao || {};

  return {
    nomeCompleto: input.nomeCompleto,
    cpf: input.cpf,
    idade: input.idade,
    sexo: input.sexo,
    endereco: input.endereco ?? loc.endereco ?? "",
    cep: input.cep ?? loc.cep ?? "",
    complemento: input.complemento ?? loc.complemento ?? null,
  };
}

module.exports = { DenunciaQueueSchema, normalizeDenuncia };
