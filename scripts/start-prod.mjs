/**
 * Production starter for AWS Lightsail (and any Node host).
 * Loads `.env`, then boots the Nitro Node server.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const raw of readFileSync(filePath, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(resolve(root, ".env"));

process.env.NODE_ENV ||= "production";
process.env.HOST ||= "127.0.0.1";
process.env.PORT ||= "3000";

const candidates = [
  resolve(root, ".output/server/index.mjs"),
  resolve(root, "dist/server/index.mjs"),
];
const serverPath = candidates.find((p) => existsSync(p));

if (!serverPath) {
  console.error(
    "No production server found. Run `npm run build` first (expected .output/server/index.mjs).",
  );
  process.exit(1);
}

await import(pathToFileURL(serverPath).href);
