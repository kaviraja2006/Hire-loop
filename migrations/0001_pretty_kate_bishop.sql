CREATE TYPE "public"."experience_level" AS ENUM('Entry Level', 'Mid-Level', 'Senior', 'Manager');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('Full-time', 'Part-time', 'Contract', 'Internship');--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"job_type" "job_type" NOT NULL,
	"experience_level" "experience_level" NOT NULL,
	"salary" varchar(255),
	"description" text NOT NULL,
	"application_url" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "posts_table" CASCADE;--> statement-breakpoint
DROP TABLE "users_table" CASCADE;