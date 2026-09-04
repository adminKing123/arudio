export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeDatabase } = await import("./lib/db/validate.js");

    const result = initializeDatabase();

    if (result.created) {
      console.info("[db] Created data/db.json with empty tables.");
    } else if (result.repaired) {
      console.info("[db] Repaired data/db.json with valid empty tables.");
    } else {
      console.info("[db] Database file validated.");
    }
  }
}
