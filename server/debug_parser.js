
import { parseResumeText } from "./parser/nlpParser.js";

const resume = `
Anmol Panchal
anmolpanchal0207@gmail.com
Skills: React, Node, MongoDB
`;

async function run() {
  console.log("Running debug parser...");
  try {
    const res = await parseResumeText(resume);
    console.log("Applied Domain:", res.atsDetails.applied_domain);
    console.log("ATS Score:", res.atsScore);
  } catch (e) {
    console.error(e);
  }
}

run();
