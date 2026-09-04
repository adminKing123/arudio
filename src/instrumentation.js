export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { initializeDatabase, getDbFilePath } = await import(
        "./lib/db/validate.js"
      );

      const result = initializeDatabase();
      const dbPath = getDbFilePath();

      if (result.created && result.seeded) {
        console.info(`[db] Seeded database from bundle to ${dbPath}`);
      } else if (result.created) {
        console.info(`[db] Created database at ${dbPath}`);
      } else if (result.repaired) {
        console.info(`[db] Repaired database at ${dbPath}`);
      } else {
        console.info(`[db] Database validated at ${dbPath}`);
      }
    } catch (error) {
      console.error(
        "[db] Database initialization failed:",
        error instanceof Error ? error.message : error,
      );
    }
  }
}
