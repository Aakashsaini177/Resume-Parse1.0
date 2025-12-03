import { parseResumeText } from "./parser/nlpParser.js";

const sampleText = `
John Doe
Full Stack Developer
john@example.com
1234567890

Skills: React, Node.js, MongoDB, Express

Experience:
Software Engineer at Tech Co
2 years of experience

Projects:
E-commerce App
MERN Stack
Built a full stack e-commerce app.

Certifications:
IBM Data Science Professional Certificate
Udemy React Course

Links:
linkedin.com/in/johndoe
github.com/johndoe
`;

async function test() {
  try {
    const result = await parseResumeText(sampleText);
    console.log("Certificates:", result.certificates);
    console.log("Domains:", result.domains);
    console.log("ATS Score:", result.atsScore);
  } catch (e) {
    console.error(e);
  }
}

test();
