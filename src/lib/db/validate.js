import fs from "fs";
import { emptyDatabase, TABLE_NAMES } from "./schema.js";
import {
  ensureDbDirectory,
  getBundledDbFilePath,
  getDbFilePath,
  isServerlessRuntime,
} from "./paths.js";

function writeValidDatabase(filePath) {
  ensureDbDirectory(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(emptyDatabase, null, 2)}\n`, "utf-8");
}

/**
 * @param {unknown} data
 * @returns {data is import("./schema.js").DatabaseSchema}
 */
export function isValidDatabaseSchema(data) {
  if (!data || typeof data !== "object") {
    return false;
  }

  return TABLE_NAMES.every((table) =>
    Array.isArray(/** @type {Record<string, unknown>} */ (data)[table]),
  );
}

function seedFromBundledDatabase(filePath) {
  const bundledPath = getBundledDbFilePath();

  if (!fs.existsSync(bundledPath)) {
    return false;
  }

  try {
    const raw = fs.readFileSync(bundledPath, "utf-8").trim();

    if (!raw) {
      return false;
    }

    const data = JSON.parse(raw);

    if (!isValidDatabaseSchema(data)) {
      return false;
    }

    ensureDbDirectory(filePath);
    fs.copyFileSync(bundledPath, filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * @returns {{ valid: boolean, reason?: string, created?: boolean, repaired?: boolean, seeded?: boolean }}
 */
export function initializeDatabase() {
  const filePath = getDbFilePath();

  ensureDbDirectory(filePath);

  if (!fs.existsSync(filePath) && isServerlessRuntime() && seedFromBundledDatabase(filePath)) {
    return {
      valid: true,
      created: true,
      seeded: true,
    };
  }

  if (!fs.existsSync(filePath)) {
    writeValidDatabase(filePath);

    return {
      valid: true,
      created: true,
    };
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8").trim();

    if (!raw) {
      writeValidDatabase(filePath);

      return {
        valid: true,
        repaired: true,
      };
    }

    const data = JSON.parse(raw);

    if (!isValidDatabaseSchema(data)) {
      /** @type {Record<string, unknown>} */
      const repaired = { ...structuredClone(emptyDatabase), ...data };

      for (const table of TABLE_NAMES) {
        if (!Array.isArray(repaired[table])) {
          repaired[table] = [];
        }
      }

      ensureDbDirectory(filePath);
      fs.writeFileSync(
        filePath,
        `${JSON.stringify(repaired, null, 2)}\n`,
        "utf-8",
      );

      return {
        valid: true,
        repaired: true,
      };
    }

    return { valid: true };
  } catch {
    writeValidDatabase(filePath);

    return {
      valid: true,
      repaired: true,
    };
  }
}

/**
 * @returns {string}
 */
export function getDatabaseSyncError() {
  return `Database is not ready for sync. Ensure the database file exists with tables: ${TABLE_NAMES.join(", ")}.`;
}

export { getDbFilePath } from "./paths.js";
