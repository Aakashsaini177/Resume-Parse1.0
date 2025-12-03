import { parseResumeText } from "./parser/nlpParser.js";

const sampleText = `
John Doe
john.doe@example.com
123-456-7890
New York, NY

Education
B.Tech in Computer Science
University of Technology
2018-2022

Skills
JavaScript, React, Node.js

Experience
Software Engineer
Tech Corp
New York, NY
Developed web applications.

Projects
Portfolio Website
React, Node.js
Personal portfolio.

Links
https://github.com/johndoe
https://linkedin.com/in/johndoe
`;

async function test() {
  try {
    const result = await parseResumeText(sampleText);
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
