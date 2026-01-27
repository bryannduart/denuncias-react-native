require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("../prisma");

async function main() {
  const email = "user@email.com";
  const password = "123456";

  // gera o hash da senha
  const passwordHash = await bcrypt.hash(password, 10);

  // cria o usuário (ou atualiza se já existir)
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log("Usuário pronto:", user.email);
}

main()
  .catch((e) => {
    console.log("Erro no seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
