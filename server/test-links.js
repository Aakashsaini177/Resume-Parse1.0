import { parseResumeText } from "./parser/nlpParser.js";

const testCases = [
  {
    name: "Standard Links",
    text: `
      Name: John Doe
      LinkedIn: https://www.linkedin.com/in/johndoe
      GitHub: https://github.com/johndoe
      Portfolio: https://johndoe.com
    `,
    expected: { linkedIn: "https://www.linkedin.com/in/johndoe", github: "https://github.com/johndoe" }
  },
  {
    name: "Short Links (No Protocol)",
    text: `
      Name: Jane Doe
      linkedin.com/in/janedoe
      github.com/janedoe
      janedoe.github.io
    `,
    expected: { linkedIn: "https://linkedin.com/in/janedoe", github: "https://github.com/janedoe" }
  },
  {
    name: "Embedded in Text",
    text: `
      Check out my projects on github.com/devuser or see my profile at linkedin.com/in/devuser.
      I also solve problems on leetcode.com/devuser.
    `,
    expected: { github: "https://github.com/devuser", linkedIn: "https://linkedin.com/in/devuser", leetcode: "https://leetcode.com/devuser" }
  },
  {
    name: "Portfolio TLDs",
    text: `
      My website is https://cooldev.io.
      Also check https://project.app and https://me.dev.
    `,
    expected: { portfolio: "https://cooldev.io" }
  },
  {
    name: "False Positives",
    text: `
      I am proficient in Node.js, React.js, and Vue.js.
      Contact me at john@example.com.
    `,
    expected: { other: [] } // Should NOT match node.js or email
  },
  {
    name: "Messy Formatting",
    text: `
      Links: github.com/messy(Code) | linkedin.com/in/messy;
      Portfolio: messy.netlify.app
    `,
    expected: { github: "https://github.com/messy", linkedIn: "https://linkedin.com/in/messy" }
  }
];

import fs from 'fs';

async function runTests() {
  let output = "Running Link Extraction Tests...\n\n";

  for (const test of testCases) {
    output += `--- Test: ${test.name} ---\n`;
    try {
      const result = await parseResumeText(test.text);
      output += "Extracted Links: " + JSON.stringify(result.links, null, 2) + "\n";
    } catch (err) {
      output += "Error: " + err.message + "\n";
    }
    output += "\n";
  }
  fs.writeFileSync('test_links_result.txt', output);
  console.log("Test results written to test_links_result.txt");
}

runTests();
