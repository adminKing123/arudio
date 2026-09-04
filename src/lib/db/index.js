import { Db } from "./Db.js";
import { initializeDatabase } from "./validate.js";

/** @type {{ valid: boolean, reason?: string, created?: boolean }} */
const databaseState = initializeDatabase();

export function getDatabaseState() {
  return databaseState;
}

export const db = new Db();

export { Db } from "./Db.js";
export * from "./models/index.js";
export {
  getDbFilePath,
  isValidDatabaseSchema,
  getDatabaseSyncError,
} from "./validate.js";
export { isServerlessRuntime, getBundledDbFilePath } from "./paths.js";
