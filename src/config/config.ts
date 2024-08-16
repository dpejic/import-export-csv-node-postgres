import z from "zod";

const envSchema = z.object({
  POSTGRES_HOST: z.coerce.string(),
  POSTGRES_USER: z.coerce.string(),
  POSTGRES_PASSWORD: z.coerce.string(),
  POSTGRES_DB: z.coerce.string(),
  POSTGRES_PORT: z.coerce.number().default(6432),
});

const envServer = envSchema.safeParse({
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
});

if (!envServer.success) {
  console.log(envServer.error.issues);
  throw new Error("There is an error with the server environment variables");
}

export const envServerSchema = envServer.data;
export type EnvSchemaType = z.infer<typeof envSchema>;
