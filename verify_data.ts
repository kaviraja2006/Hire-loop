import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Verification: Database Contents ===");

  const users = await prisma.user.findMany({
    include: { postedJobs: true, applications: true },
  });
  console.log("\n--- Users ---");
  console.dir(users, { depth: null });

  const jobs = await prisma.job.findMany({ include: { applications: true } });
  console.log("\n--- Jobs ---");
  console.dir(jobs, { depth: null });

  const applications = await prisma.application.findMany();
  console.log("\n--- Applications ---");
  console.dir(applications, { depth: null });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
