import {
  PrismaClient,
  Role,
  JobType,
  ExperienceLevel,
  ApplicationStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // Create Users
  const recruiter = await prisma.user.upsert({
    where: { email: "recruiter@hireloop.com" },
    update: {},
    create: {
      email: "recruiter@hireloop.com",
      name: "Alice Recruiter",
      role: Role.RECRUITER,
    },
  });

  const candidate = await prisma.user.upsert({
    where: { email: "candidate@element.com" },
    update: {},
    create: {
      email: "candidate@element.com",
      name: "Bob Candidate",
      role: Role.CANDIDATE,
    },
  });

  console.log("Created Users:", { recruiter, candidate });

  // Create Jobs
  const job1 = await prisma.job.create({
    data: {
      title: "Senior React Developer",
      company: "Tech Corp",
      location: "Remote",
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.SENIOR,
      salary: "$120k - $150k",
      description:
        "We are looking for an experienced React developer to lead our frontend team.",
      recruiterId: recruiter.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: "Junior Backend Engineer",
      company: "Tech Corp",
      location: "New York, NY",
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.ENTRY_LEVEL,
      salary: "$80k - $100k",
      description:
        "Join our backend team building scalable APIs with Node.js and PostgreSQL.",
      recruiterId: recruiter.id,
    },
  });

  console.log("Created Jobs:", { job1, job2 });

  // Create Application
  const application = await prisma.application.create({
    data: {
      jobId: job1.id,
      candidateId: candidate.id,
      status: ApplicationStatus.PENDING,
    },
  });

  console.log("Created Application:", application);

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
