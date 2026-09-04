import fs from "fs";
import os from "os";
import path from "path";

export function isServerlessRuntime() {
  return Boolean(
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.NETLIFY === "true" ||
      process.env.VERCEL === "1" ||
      process.cwd().startsWith("/var/task"),
  );
}

/** Read-only bundled db path inside the deployment package. */
export function getBundledDbFilePath() {
  return path.join(process.cwd(), "data", "db.json");
}

/** Writable db path for the current runtime. */
export function getDbFilePath() {
  if (process.env.DB_FILE_PATH) {
    return process.env.DB_FILE_PATH;
  }

  if (isServerlessRuntime()) {
    return path.join(os.tmpdir(), "arudio", "data", "db.json");
  }

  return path.join(process.cwd(), "data", "db.json");
}

export function ensureDbDirectory(filePath = getDbFilePath()) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}
