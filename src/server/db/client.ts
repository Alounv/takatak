import { z } from "zod";

export const dbConfig = {
  connectionString: z.string().nonempty().parse(import.meta.env.VITE_DATABASE_URL),
  ssl: true,
};
