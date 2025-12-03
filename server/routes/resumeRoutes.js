import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import { extractRawText } from "../services/extractRawText.js";
import { parseResumeText } from "../parser/nlpParser.js";
import { normalizeDownloadURL } from "../utils/normalizeDownloadURL.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_DIR = path.join(__dirname, "../temp");

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (req, file, cb) => {
    // Use a simple timestamp + originalname to avoid conflicts
    const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, unique);
  }
});

const upload = multer({ storage });

// 1) URL se resume parse
router.post("/from-url", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    console.log("Processing URL:", url);
    const { direct } = normalizeDownloadURL(url);
    console.log("Normalized URL:", direct);

    const response = await axios.get(direct, {
      responseType: "arraybuffer"
    });

    console.log("Download status:", response.status);
    console.log("Content-Type:", response.headers["content-type"]);

    const id = Date.now();
    const tempPath = path.join(TEMP_DIR, `${id}.pdf`);

    await fs.promises.writeFile(tempPath, response.data);
    console.log("File saved to:", tempPath);

    const { rawText } = await extractRawText(tempPath);
    console.log("Text extracted, length:", rawText?.length);
    
    const parsed = await parseResumeText(rawText);
    console.log("Resume parsed successfully");

    res.json({
      source: "url",
      tempId: `${id}.pdf`,
      parsed
    });
  } catch (err) {
    console.error("Error in /from-url:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response headers:", err.response.headers);
    }
    res.status(500).json({ 
      error: "Failed to parse resume from URL", 
      details: err.message 
    });
  }
});

// 2) File upload se resume parse
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const filePath = req.file.path;
    const { rawText } = await extractRawText(filePath);
    const parsed = await parseResumeText(rawText);

    res.json({
      source: "upload",
      tempId: req.file.filename,
      parsed
    });
  } catch (err) {
    console.error("Error in /upload:", err.message);
    res.status(500).json({ error: "Failed to parse uploaded resume" });
  }
});

// 3) Temp file se PDF serve (UI me iframe ke liye)
router.get("/temp/:filename", async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(TEMP_DIR, filename);

  try {
    await fs.promises.access(filePath);
    res.sendFile(filePath);
  } catch (err) {
    res.status(404).send("File not found");
  }
});

export default router;
