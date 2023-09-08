CREATE TABLE IF NOT EXISTS "presets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"text" text NOT NULL,
	"session_length" integer NOT NULL,
	"speed" integer NOT NULL,
	"repetitions" integer NOT NULL
);

DO $$ BEGIN
 ALTER TABLE presets ADD CONSTRAINT presets_user_id_users_id_fk FOREIGN KEY ("user_id") REFERENCES users("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
