import { TABLE_NAMES, emptyDatabase } from "./db/schema.js";
import { db, getDatabaseState, getDatabaseSyncError } from "./db/index.js";

/**
 * @param {unknown} payload
 * @returns {import('./db/schema.js').DatabaseSchema}
 */
function normalizeRemotePayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Remote API returned invalid JSON payload.");
  }

  /** @type {import('./db/schema.js').DatabaseSchema} */
  const normalized = structuredClone(emptyDatabase);

  for (const table of TABLE_NAMES) {
    const rows = /** @type {Record<string, unknown>} */ (payload)[table];

    if (!Array.isArray(rows)) {
      throw new Error(`Remote API payload is missing table: ${table}`);
    }

    normalized[table] = rows;
  }

  return normalized;
}

export async function syncDatabaseFromRemote() {
  const databaseState = getDatabaseState();

  if (!databaseState.valid) {
    throw new Error(
      databaseState.reason ?? getDatabaseSyncError(),
    );
  }

  const remoteUrl = process.env.REMOTE_DB_JSON_URL;

  if (!remoteUrl) {
    throw new Error("REMOTE_DB_JSON_URL is not configured.");
  }

  const response = await fetch(remoteUrl, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Remote sync failed with status ${response.status}: ${response.statusText}`,
    );
  }

  const payload = await response.json();
  const normalized = normalizeRemotePayload(payload);

  await db.replace(normalized);

  return {
    syncedAt: new Date().toISOString(),
    counts: await db.getCounts(),
  };
}
