import { PrismaClient, ApplicationStatus, Role } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

/**
 * Transaction Example 1: Job Application with Validation
 *
 * Demonstrates:
 * - Creating an application within a transaction
 * - Validating business rules (no duplicate applications)
 * - Automatic rollback on constraint violation
 */
async function createApplicationWithValidation() {
  console.log(
    "\n=== Transaction Example 1: Job Application with Validation ===\n"
  );

  try {
    // First, get a valid job and candidate
    const job = await prisma.job.findFirst();
    const candidate = await prisma.user.findFirst({
      where: { role: Role.CANDIDATE },
    });

    if (!job || !candidate) {
      console.log("❌ No job or candidate found. Skipping this example.");
      return;
    }

    console.log(`Attempting to create application for job: "${job.title}"`);
    console.log(`Candidate: ${candidate.name} (${candidate.email})`);

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Check if application already exists
      const existingApplication = await tx.application.findUnique({
        where: {
          jobId_candidateId: {
            jobId: job.id,
            candidateId: candidate.id,
          },
        },
      });

      if (existingApplication) {
        throw new Error("Candidate has already applied to this job");
      }

      // Create the application
      const application = await tx.application.create({
        data: {
          jobId: job.id,
          candidateId: candidate.id,
          status: ApplicationStatus.PENDING,
        },
        include: {
          job: { select: { title: true } },
          candidate: { select: { name: true, email: true } },
        },
      });

      console.log("✅ Application created successfully!");
      console.log(`   Job: ${application.job.title}`);
      console.log(`   Candidate: ${application.candidate.name}`);
      console.log(`   Status: ${application.status}`);

      return application;
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.log("❌ Transaction failed and was rolled back:");
      console.log(`   Reason: ${error.message}`);
    }
    console.log("✅ Database integrity maintained - no partial data created\n");
  }
}

/**
 * Transaction Example 2: Bulk Application Status Update
 *
 * Demonstrates:
 * - Updating multiple records atomically
 * - All-or-nothing behavior (if one fails, all rollback)
 * - Complex business logic in transactions
 */
async function bulkUpdateApplicationStatus() {
  console.log(
    "\n=== Transaction Example 2: Bulk Application Status Update ===\n"
  );

  try {
    // Get all pending applications for a specific job
    const job = await prisma.job.findFirst({
      include: {
        applications: {
          where: { status: ApplicationStatus.PENDING },
          take: 3,
        },
      },
    });

    if (!job || job.applications.length === 0) {
      console.log("❌ No pending applications found. Skipping this example.");
      return;
    }

    console.log(
      `Found ${job.applications.length} pending applications for "${job.title}"`
    );
    console.log("Updating all to REVIEWED status atomically...");

    // Use transaction to update all applications
    const result = await prisma.$transaction(async (tx) => {
      const updates = [];

      for (const app of job.applications) {
        const updated = await tx.application.update({
          where: { id: app.id },
          data: { status: ApplicationStatus.REVIEWED },
          include: {
            candidate: { select: { name: true } },
          },
        });
        updates.push(updated);
      }

      return updates;
    });

    console.log(
      `✅ Successfully updated ${result.length} applications to REVIEWED`
    );
    result.forEach((app) => {
      console.log(`   - ${app.candidate.name}: ${app.status}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("❌ Bulk update transaction failed:");
      console.log(`   Reason: ${error.message}`);
      console.log(
        "✅ All updates rolled back - database in consistent state\n"
      );
    }
  }
}

/**
 * Transaction Example 3: Intentional Rollback Demo
 *
 * Demonstrates:
 * - How to intentionally trigger a rollback
 * - Verification that no data persists after rollback
 * - Error handling in transactions
 */
async function demonstrateRollback() {
  console.log("\n=== Transaction Example 3: Intentional Rollback Demo ===\n");

  const testEmail = `rollback-test-${Date.now()}@example.com`;

  try {
    console.log("Creating a user and job, then intentionally failing...");

    await prisma.$transaction(async (tx) => {
      // Create a test user
      const user = await tx.user.create({
        data: {
          email: testEmail,
          name: "Rollback Test User",
          role: Role.RECRUITER,
        },
      });

      console.log(`✅ Created user: ${user.name} (${user.email})`);

      // Create a test job
      const job = await tx.job.create({
        data: {
          title: "Test Job for Rollback",
          company: "Test Company",
          location: "Test Location",
          jobType: "FULL_TIME",
          experienceLevel: "ENTRY_LEVEL",
          description: "This job should not persist",
          recruiterId: user.id,
        },
      });

      console.log(`✅ Created job: ${job.title}`);

      // Intentionally throw an error to trigger rollback
      throw new Error("Intentional error to demonstrate rollback");
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("\n❌ Transaction failed (as expected):");
      console.log(`   Reason: ${error.message}`);
    }

    // Verify the user was NOT created (rollback successful)
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!user) {
      console.log("✅ ROLLBACK VERIFIED: User was not persisted to database");
      console.log("✅ Database integrity maintained\n");
    } else {
      console.log("❌ ROLLBACK FAILED: User still exists in database!");
    }
  }
}

/**
 * Transaction Example 4: Array-based Transaction
 *
 * Demonstrates:
 * - Using array syntax for simple transactions
 * - Parallel operations within transaction
 */
async function arrayBasedTransaction() {
  console.log("\n=== Transaction Example 4: Array-Based Transaction ===\n");

  try {
    const recruiter = await prisma.user.findFirst({
      where: { role: Role.RECRUITER },
    });

    if (!recruiter) {
      console.log("❌ No recruiter found. Skipping this example.");
      return;
    }

    console.log("Creating two jobs atomically using array syntax...");

    const [job1, job2] = await prisma.$transaction([
      prisma.job.create({
        data: {
          title: "Senior Frontend Developer",
          company: "TechCorp",
          location: "Remote",
          jobType: "FULL_TIME",
          experienceLevel: "SENIOR",
          salary: "$120k - $150k",
          description: "Build amazing UIs with React",
          recruiterId: recruiter.id,
        },
      }),
      prisma.job.create({
        data: {
          title: "Backend Engineer",
          company: "TechCorp",
          location: "New York, NY",
          jobType: "FULL_TIME",
          experienceLevel: "MID_LEVEL",
          salary: "$100k - $130k",
          description: "Build scalable APIs",
          recruiterId: recruiter.id,
        },
      }),
    ]);

    console.log("✅ Both jobs created successfully!");
    console.log(`   Job 1: ${job1.title}`);
    console.log(`   Job 2: ${job2.title}`);
    console.log(
      "\n💡 If either creation failed, both would have been rolled back\n"
    );

    // Clean up the test jobs
    await prisma.job.deleteMany({
      where: {
        id: { in: [job1.id, job2.id] },
      },
    });
    console.log("🧹 Test jobs cleaned up");
  } catch (error) {
    if (error instanceof Error) {
      console.log("❌ Array transaction failed:");
      console.log(`   Reason: ${error.message}\n`);
    }
  }
}

/**
 * Main function to run all transaction examples
 */
async function main() {
  console.log(
    "╔════════════════════════════════════════════════════════════════╗"
  );
  console.log(
    "║     PRISMA TRANSACTION EXAMPLES & ROLLBACK DEMONSTRATIONS      ║"
  );
  console.log(
    "╚════════════════════════════════════════════════════════════════╝"
  );

  await createApplicationWithValidation();
  await bulkUpdateApplicationStatus();
  await demonstrateRollback();
  await arrayBasedTransaction();

  console.log(
    "\n╔════════════════════════════════════════════════════════════════╗"
  );
  console.log(
    "║                    ALL EXAMPLES COMPLETED                      ║"
  );
  console.log(
    "╚════════════════════════════════════════════════════════════════╝\n"
  );

  console.log("📚 Key Takeaways:");
  console.log("   • Transactions ensure atomicity (all-or-nothing)");
  console.log("   • Prisma automatically rolls back on errors");
  console.log("   • Use transactions when operations depend on each other");
  console.log(
    "   • Two syntaxes: $transaction([...]) or $transaction(async tx => {})"
  );
  console.log("   • Always handle errors to provide user feedback\n");
}

// Run the examples
main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
