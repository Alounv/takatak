import { z } from "zod";

export const dbConfig = {
  url: z.string().nonempty().parse(import.meta.env.VITE_DATABASE_URL),
  ssl: true,
};
