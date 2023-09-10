ALTER TABLE "errors" ADD COLUMN "timestamp" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "results" ADD COLUMN "timestamp" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "errors" DROP COLUMN IF EXISTS "date";--> statement-breakpoint
ALTER TABLE "results" DROP COLUMN IF EXISTS "date";--> statement-breakpoint
ALTER TABLE "results" DROP COLUMN IF EXISTS "error_date";