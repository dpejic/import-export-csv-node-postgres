import pg from "pg";
import { envServerSchema } from "../config/config";

export const client = new pg.Client({
  user: envServerSchema.POSTGRES_USER,
  host: envServerSchema.POSTGRES_HOST,
  port: envServerSchema.POSTGRES_PORT,
  database: envServerSchema.POSTGRES_DB,
  password: envServerSchema.POSTGRES_PASSWORD,
});

export const connectClient = async () => {
  try {
    await client.connect();
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    throw error;
  }
};

export default client;
