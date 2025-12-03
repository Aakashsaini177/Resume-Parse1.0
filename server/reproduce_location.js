import { parseResumeText } from "./parser/nlpParser.js";
import nlp from "compromise";

const anmolText = `
Anmol Panchal
anmolpanchal0207@gmail.com
8619036305

Education
Bachelors of Technology ( Computer Science Engineering)
Vivekananda Institute of Technology,Jaipur
08/2021 - Present
S.S. International School,Jaipur,Rajasthan
04/2020 - 06/2021
Matriculation [RBSE]
S.S. International School,Jaipur,Rajasthan
04/2018 - 06/2019

Experience
Web Developer Intern
Deeva Payon Global Private Limited
Zidio Development
full-stack web applications, gaining hands-on experience in
Express.js, React.js, and Node.js.
CodEvo Solutions
JavaScript).
This project highlights skills in HTML, CSS, and JavaScript

Projects
Real Estate Website
Clothing E-Commerce Website
Anon E-Commerce Website

Certificates
Participation in Hack Conclave 24
organized by IIT Guwahati, & IIT Guwahati Research Park
Participation in the Informatica Data Engineering
Hackathon 2024
Participation in the Space Hackathon
organized by India International Science Festival

Links
https://linkedin.com/in/anmol-panchal02
https://github.com/Anmolpanchal02
`;

async function debugLocation() {
  console.log("--- Debugging Location Extraction ---");
  
  // 1. Check what Compromise detects
  const doc = nlp(anmolText);
  const places = doc.places().out('array');
  console.log("Compromise detected places:", places);

  // 2. Run full parser
  const result = await parseResumeText(anmolText);
  console.log("Extracted Location:", result.location);
}

debugLocation();
