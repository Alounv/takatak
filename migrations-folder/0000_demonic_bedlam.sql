CREATE TABLE IF NOT EXISTS "objectives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"description" text NOT NULL,
	"duration" integer NOT NULL,
	"cost" integer NOT NULL,
	"coach" text NOT NULL,
	"motivation" text NOT NULL,
	"motivation_url" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "success" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"objective_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatar_url" text
);

DO $$ BEGIN
 ALTER TABLE objectives ADD CONSTRAINT objectives_user_id_users_id_fk FOREIGN KEY ("user_id") REFERENCES users("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE success ADD CONSTRAINT success_objective_id_objectives_id_fk FOREIGN KEY ("objective_id") REFERENCES objectives("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
