import { config } from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

config({ path: ".env.local" });

const databaseUrl = drizzle(
  postgres(`${process.env.VITE_DATABASE_URL}`, { ssl: "require", max: 1 }),
);

const main = async () => {
  try {
    await migrate(databaseUrl, { migrationsFolder: "drizzle" });
    console.info("Migration complete");
  } catch (error) {
    console.info(error);
  }
  process.exit(0);
};
main();
