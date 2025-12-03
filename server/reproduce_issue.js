import dotenv from "dotenv";
dotenv.config();
import { parseResumeText } from "./parser/nlpParser.js";

const testText = `
Aakash Saini
sainiaakash177@gmail.com
+91-9782681155

Links:
https://www.linkedin.com/in/aakash-saini-12345
https://github.com/aakashsaini
github.com/testuser
linkedin.com/in/testuser
`;

import fs from "fs";
import path from "path";

async function run() {
  console.log("Testing Link Extraction with sample text:");
  try {
    const result = await parseResumeText(testText);
    const outputPath = path.join(process.cwd(), "reproduction_result.json");
    fs.writeFileSync(outputPath, JSON.stringify(result.links, null, 2));
    console.log("Output written to reproduction_result.json");
  } catch (err) {
    console.error("Error:", err);
    fs.writeFileSync("reproduction_error.txt", err.message);
  }
}

run();
