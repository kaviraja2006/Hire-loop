import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Connecting to database...");
    const users = await prisma.user.findMany();
    console.log("Successfully connected to database!");
    console.log(`Found ${users.length} users.`);
    // Log one user to show structure if any exist
    if (users.length > 0) {
      console.log("Sample user:", users[0]);
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
