const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "dubstep" },
        { name: "trance" },
        { name: "house" },
        { name: "techno" },
      ],
    });
  } catch (error) {
  } finally {
    await database.$disconnect();
  }
}

main();
