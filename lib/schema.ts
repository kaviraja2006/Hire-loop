import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const jobTypeEnum = pgEnum("job_type", [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
]);

export const experienceLevelEnum = pgEnum("experience_level", [
  "Entry Level",
  "Mid-Level",
  "Senior",
  "Manager",
]);

export const jobsTable = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  jobType: jobTypeEnum("job_type").notNull(),
  experienceLevel: experienceLevelEnum("experience_level").notNull(),
  salary: varchar("salary", { length: 255 }),
  description: text("description").notNull(),
  applicationUrl: varchar("application_url").notNull(),
  postedAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type NewJob = typeof jobsTable.$inferInsert;
export type Job = typeof jobsTable.$inferSelect;
