import fs from "fs";
import path from "path";

export function startCleanupTask() {
  const TEMP_DIR = "temp";
  const MAX_AGE = 2 * 60 * 1000; // 2 minutes

  // Ensure temp dir exists
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }

  setInterval(() => {
    fs.readdir(TEMP_DIR, (err, files) => {
      if (err) return console.error("Cleanup error:", err);

      const now = Date.now();

      files.forEach((file) => {
        const filePath = path.join(TEMP_DIR, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;

          if (now - stats.mtimeMs > MAX_AGE) {
            fs.unlink(filePath, (err) => {
              if (err) console.error(`Failed to delete ${file}:`, err);
              else console.log(`Deleted old temp file: ${file}`);
            });
          }
        });
      });
    });
  }, 60000); // Run every 1 minute
}
