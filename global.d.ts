import { type EnvSchemaType } from "./src/config/config";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchemaType {}
  }
}
