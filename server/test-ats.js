import { parseResumeText } from "./parser/nlpParser.js";
import fs from "fs";

const mernResume = `
Anmol Panchal
anmolpanchal0207@gmail.com
Jaipur, Rajasthan

Skills
Javascript, React, Mongodb, Mysql, Html, Css, Java, Git, Github

Experience
Web Developer Intern
Deeva Payon Global Private Limited
Full-stack web applications, gaining hands-on experience in
Express.js, React.js, and Node.js.
`;

const javaResume = `
Sourabh Mehta
sourabh@gmail.com
Delhi

Skills
Java, Spring Boot, Hibernate, SQL, Microservices

Experience
Java Developer
Accenture
Developed enterprise applications using Java and Spring Boot.
`;

async function testATS() {
  const results = [];
  
  console.log("--- Testing Dynamic ATS Scoring ---");

  console.log("\n1. MERN Resume:");
  const res1 = await parseResumeText(mernResume);
  results.push({
    type: "MERN",
    predicted: res1.domains,
    applied: res1.atsDetails.applied_domain,
    score: res1.atsScore,
    missing: res1.atsDetails.missing_keywords.slice(0, 3)
  });

  console.log("\n2. Java Resume:");
  const res2 = await parseResumeText(javaResume);
  results.push({
    type: "Java",
    predicted: res2.domains,
    applied: res2.atsDetails.applied_domain,
    score: res2.atsScore,
    missing: res2.atsDetails.missing_keywords.slice(0, 3)
  });

  fs.writeFileSync("ats_results.json", JSON.stringify(results, null, 2));
  console.log("Results written to ats_results.json");
}

testATS();
