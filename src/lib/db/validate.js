import fs from "fs";
import path from "path";
import { emptyDatabase, TABLE_NAMES } from "./schema.js";

export function getDbFilePath() {
  return path.join(process.cwd(), "data", "db.json");
}

function writeValidDatabase(filePath) {
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

/**
 * @returns {{ valid: boolean, reason?: string, created?: boolean, repaired?: boolean }}
 */
export function initializeDatabase() {
  const filePath = getDbFilePath();

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

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
      writeValidDatabase(filePath);

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
  return `Database is not ready for sync. Ensure data/db.json exists with tables: ${TABLE_NAMES.join(", ")}.`;
}
