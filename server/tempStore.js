// tempStore.js
import { randomUUID } from "crypto";

const tempFiles = new Map(); // id -> { buffer, mime }

export function saveTempFile(buffer, mime) {
  const id = randomUUID();
  tempFiles.set(id, { buffer, mime, createdAt: Date.now() });
  return id;
}

export function getTempFile(id) {
  return tempFiles.get(id) || null;
}

// Optional: clean old temp files (not using cron here, simple)
export function cleanupOldFiles(maxAgeMs = 1000 * 60 * 60) {
  const now = Date.now();
  for (const [id, file] of tempFiles.entries()) {
    if (now - file.createdAt > maxAgeMs) {
      tempFiles.delete(id);
    }
  }
}
