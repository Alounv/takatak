CREATE TABLE IF NOT EXISTS "selected_presets" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"preset_id" uuid NOT NULL
);

DO $$ BEGIN
 ALTER TABLE selected_presets ADD CONSTRAINT selected_presets_user_id_users_id_fk FOREIGN KEY ("user_id") REFERENCES users("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE selected_presets ADD CONSTRAINT selected_presets_preset_id_presets_id_fk FOREIGN KEY ("preset_id") REFERENCES presets("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
