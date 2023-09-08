CREATE TABLE IF NOT EXISTS "errors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"word" text NOT NULL,
	"input" text NOT NULL,
	"date" date NOT NULL
);

CREATE TABLE IF NOT EXISTS "results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"word" text NOT NULL,
	"duration" integer NOT NULL,
	"date" date NOT NULL,
	"error_date" date
);

DO $$ BEGIN
 ALTER TABLE errors ADD CONSTRAINT errors_user_id_users_id_fk FOREIGN KEY ("user_id") REFERENCES users("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE results ADD CONSTRAINT results_user_id_users_id_fk FOREIGN KEY ("user_id") REFERENCES users("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
