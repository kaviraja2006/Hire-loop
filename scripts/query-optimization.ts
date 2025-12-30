import { PrismaClient, ApplicationStatus, Role } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Query Optimization Example 1: Selective Field Fetching
 *
 * Demonstrates the performance difference between fetching all fields
 * vs. selecting only needed fields
 */
async function demonstrateSelectiveFields() {
  console.log("\n=== Optimization 1: Selective Field Fetching ===\n");

  console.log("❌ INEFFICIENT: Fetching all user fields + all relations");
  console.log(
    "const users = await prisma.user.findMany({ include: { postedJobs: true, applications: true } });\n"
  );

  console.log("✅ OPTIMIZED: Selecting only required fields");
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      // Exclude createdAt, role if not needed
    },
    take: 5,
  });

  console.log(`Retrieved ${users.length} users with minimal data:`);
  users.forEach((user) => {
    console.log(`   - ${user.name} (${user.email})`);
  });

  console.log("\n💡 Benefits:");
  console.log("   • Reduced network transfer size");
  console.log("   • Lower memory usage");
  console.log("   • Faster query execution");
  console.log("   • Better API response times\n");
}

/**
 * Query Optimization Example 2: Pagination
 *
 * Demonstrates proper pagination to avoid loading large datasets
 */
async function demonstratePagination() {
  console.log("\n=== Optimization 2: Pagination ===\n");

  const pageSize = 10;
  const currentPage = 1;

  console.log("❌ INEFFICIENT: Loading all records at once");
  console.log(
    "const allJobs = await prisma.job.findMany(); // Could be thousands!\n"
  );

  console.log("✅ OPTIMIZED: Paginated query");
  const jobs = await prisma.job.findMany({
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    orderBy: { postedAt: "desc" },
    select: {
      id: true,
      title: true,
      company: true,
      postedAt: true,
    },
  });

  console.log(
    `Page ${currentPage}: Retrieved ${jobs.length} jobs (page size: ${pageSize})`
  );
  jobs.forEach((job, index) => {
    console.log(`   ${index + 1}. ${job.title} at ${job.company}`);
  });

  // Get total count for pagination metadata
  const totalJobs = await prisma.job.count();
  const totalPages = Math.ceil(totalJobs / pageSize);

  console.log(`\nPagination Info:`);
  console.log(`   Total Jobs: ${totalJobs}`);
  console.log(`   Total Pages: ${totalPages}`);
  console.log(`   Current Page: ${currentPage}/${totalPages}`);

  console.log("\n💡 Benefits:");
  console.log("   • Constant memory usage regardless of total records");
  console.log("   • Faster initial page load");
  console.log("   • Better user experience with infinite scroll/pagination");
  console.log("   • Reduced database load\n");
}

/**
 * Query Optimization Example 3: Batch Operations
 *
 * Demonstrates using createMany instead of multiple create calls
 */
async function demonstrateBatchOperations() {
  console.log("\n=== Optimization 3: Batch Operations ===\n");

  const recruiter = await prisma.user.findFirst({
    where: { role: Role.RECRUITER },
  });

  if (!recruiter) {
    console.log("❌ No recruiter found. Skipping batch operations example.");
    return;
  }

  console.log("❌ INEFFICIENT: Creating records one by one");
  console.log("for (const job of jobs) {");
  console.log(
    "  await prisma.job.create({ data: job }); // N database round-trips!"
  );
  console.log("}\n");

  console.log("✅ OPTIMIZED: Batch insert with createMany");

  const jobsToCreate = [
    {
      title: "DevOps Engineer",
      company: "CloudTech",
      location: "Remote",
      jobType: "FULL_TIME" as const,
      experienceLevel: "MID_LEVEL" as const,
      salary: "$110k - $140k",
      description: "Manage our cloud infrastructure",
      recruiterId: recruiter.id,
    },
    {
      title: "Data Scientist",
      company: "AI Corp",
      location: "San Francisco, CA",
      jobType: "FULL_TIME" as const,
      experienceLevel: "SENIOR" as const,
      salary: "$130k - $170k",
      description: "Build ML models",
      recruiterId: recruiter.id,
    },
    {
      title: "QA Engineer",
      company: "TestLabs",
      location: "Austin, TX",
      jobType: "CONTRACT" as const,
      experienceLevel: "ENTRY_LEVEL" as const,
      salary: "$70k - $90k",
      description: "Ensure product quality",
      recruiterId: recruiter.id,
    },
  ];

  const result = await prisma.job.createMany({
    data: jobsToCreate,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${result.count} jobs in a single operation`);

  console.log("\n💡 Benefits:");
  console.log("   • Single database round-trip instead of N");
  console.log("   • Significantly faster for bulk operations");
  console.log("   • Reduced network overhead");
  console.log("   • Better transaction performance\n");

  // Cleanup
  await prisma.job.deleteMany({
    where: {
      title: { in: jobsToCreate.map((j) => j.title) },
    },
  });
  console.log("🧹 Cleaned up test jobs");
}

/**
 * Query Optimization Example 4: Avoiding N+1 Queries
 *
 * Demonstrates how to use include to fetch related data in one query
 */
async function avoidNPlusOneQueries() {
  console.log("\n=== Optimization 4: Avoiding N+1 Queries ===\n");

  console.log("❌ ANTI-PATTERN: N+1 Query Problem");
  console.log("const jobs = await prisma.job.findMany(); // 1 query");
  console.log("for (const job of jobs) {");
  console.log(
    "  const recruiter = await prisma.user.findUnique({ where: { id: job.recruiterId } }); // N queries!"
  );
  console.log("}\n");

  console.log("✅ OPTIMIZED: Fetch related data with include");

  const jobs = await prisma.job.findMany({
    take: 5,
    include: {
      recruiter: {
        select: {
          name: true,
          email: true,
        },
      },
      applications: {
        select: {
          status: true,
        },
      },
    },
  });

  console.log(`Retrieved ${jobs.length} jobs with recruiter data in 1 query:`);
  jobs.forEach((job) => {
    console.log(
      `   - ${job.title} by ${job.recruiter.name} (${job.applications.length} applications)`
    );
  });

  console.log("\n💡 Benefits:");
  console.log("   • 1 query instead of N+1 queries");
  console.log("   • Massive performance improvement");
  console.log("   • Reduced database connection overhead");
  console.log("   • Lower latency\n");
}

/**
 * Query Optimization Example 5: Filtering with Indexes
 *
 * Demonstrates queries that benefit from our newly added indexes
 */
async function demonstrateIndexedQueries() {
  console.log("\n=== Optimization 5: Leveraging Indexes ===\n");

  console.log("✅ OPTIMIZED: Filtering by jobType (uses index)");
  const fullTimeJobs = await prisma.job.findMany({
    where: {
      jobType: "FULL_TIME", // Uses @@index([jobType])
    },
    select: {
      title: true,
      company: true,
      jobType: true,
    },
    take: 5,
  });

  console.log(`Found ${fullTimeJobs.length} full-time jobs:`);
  fullTimeJobs.forEach((job) => {
    console.log(`   - ${job.title} at ${job.company}`);
  });

  console.log(
    "\n✅ OPTIMIZED: Filtering by status with date sorting (uses composite index)"
  );
  const pendingApps = await prisma.application.findMany({
    where: {
      status: ApplicationStatus.PENDING, // Uses @@index([status, appliedAt])
    },
    orderBy: {
      appliedAt: "desc",
    },
    include: {
      job: { select: { title: true } },
      candidate: { select: { name: true } },
    },
    take: 5,
  });

  console.log(
    `Found ${pendingApps.length} pending applications (sorted by date):`
  );
  pendingApps.forEach((app) => {
    console.log(
      `   - ${app.candidate.name} → ${app.job.title} (${app.appliedAt.toLocaleDateString()})`
    );
  });

  console.log("\n💡 Index Benefits:");
  console.log("   • @@index([jobType]) speeds up job filtering");
  console.log("   • @@index([experienceLevel]) speeds up experience filtering");
  console.log("   • @@index([status, appliedAt]) speeds up dashboard queries");
  console.log("   • Queries use INDEX SCAN instead of FULL TABLE SCAN\n");
}

/**
 * Main function to run all optimization examples
 */
async function main() {
  console.log(
    "╔════════════════════════════════════════════════════════════════╗"
  );
  console.log(
    "║          PRISMA QUERY OPTIMIZATION BEST PRACTICES              ║"
  );
  console.log(
    "╚════════════════════════════════════════════════════════════════╝"
  );

  await demonstrateSelectiveFields();
  await demonstratePagination();
  await demonstrateBatchOperations();
  await avoidNPlusOneQueries();
  await demonstrateIndexedQueries();

  console.log(
    "\n╔════════════════════════════════════════════════════════════════╗"
  );
  console.log(
    "║                   ALL EXAMPLES COMPLETED                       ║"
  );
  console.log(
    "╚════════════════════════════════════════════════════════════════╝\n"
  );

  console.log("📚 Key Takeaways:");
  console.log("   1. Use `select` to fetch only needed fields");
  console.log("   2. Always paginate large result sets");
  console.log("   3. Use `createMany` for bulk operations");
  console.log("   4. Use `include` to avoid N+1 query problems");
  console.log("   5. Add indexes for frequently filtered/sorted fields");
  console.log("   6. Monitor queries with DEBUG=prisma:query\n");
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
