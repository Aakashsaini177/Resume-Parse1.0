// services/extractRawText.js
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { fileTypeFromBuffer } from "file-type";
import { normalizeText } from "../utils/normalizeText.js";

export async function extractRawText(filePath) {
  try {
    const buffer = await fs.promises.readFile(filePath);
    
    // Determine extension from file path or content
    let ext = "unknown";
    if (filePath.includes(".")) {
      ext = filePath.split(".").pop().toLowerCase();
    }

    const fileInfo = await fileTypeFromBuffer(buffer);
    const mime = fileInfo?.mime || "application/octet-stream";
    const finalExt = fileInfo?.ext || ext;

    const text = await bufferToText(buffer, finalExt, mime);

    return {
      mime,
      ext: finalExt,
      rawText: text,
      cleanedText: normalizeText(text),
      filePath
    };
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error);
    throw new Error("Failed to extract text from file");
  }
}

// helper: buffer -> text (pdf/docx/txt)
async function bufferToText(buffer, ext, mime) {
  if (ext === "pdf" || mime === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text || "";
  }

  if (ext === "docx") {
    const { value } = await mammoth.extractRawText({ buffer });
    return value || "";
  }

  if (ext === "txt" || mime.startsWith("text/")) {
    return buffer.toString("utf8");
  }

  // fallback
  return buffer.toString("utf8");
}
