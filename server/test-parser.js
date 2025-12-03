import { parseResumeText } from "./parser/nlpParser.js";

const sampleText = `
Projects

Realtime Chatting System
MERN, TailwindCSS
Built real time chat app with authentication.

Portfolio Website
React, Node.js
Personal portfolio to showcase projects.
`;

async function test() {
  try {
    const result = await parseResumeText(sampleText);
    console.log(JSON.stringify(result.projects, null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
