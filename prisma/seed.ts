import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.language.upsert({
    where: { id: "pt-BR" },
    update: {},
    create: {
      id: "pt-BR",
      name: "Português (Brasil)",
    },
  });

  await prisma.language.upsert({
    where: { id: "en-US" },
    update: {},
    create: {
      id: "en-US",
      name: "Inglês (Estados Unidos)",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
