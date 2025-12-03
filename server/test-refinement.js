import { parseResumeText } from "./parser/nlpParser.js";

const sample1 = `
Anmol Panchal
anmolpanchal0207@gmail.com
8619036305
Guwahati Research Park Participation

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

Links
https://linkedin.com/in/anmol-panchal02
https://github.com/Anmolpanchal02
`;

const sample2 = `
Nikul Suthar
nikulsuthar973@gmail.com
Rajasthan,

Education
JECRC University Aug 2023 - Present
Masters of Computer Application (MCA) Jaipur, Rajasthan
Coursework: Operating System, DBMS, Data Structures and Algorithms, Software Engineering
Current CGPA: 8.41 (up to 3
CVM University | NVPAS College Aug 2020 May 2023
Bachelors of Computer Application (BCA) Anand, Gujarat
CGPA: 9.72

Experience
Accenture Feb 21, 2025 Jun 20, 2025
Packaged Application Development Associate Intern Ahmedabad, Gujarat (Hybrid)
E-BOOK STORE | MCA Final Year Project GitHub

Projects
REALTIME CHATTING SYSTEM GitHub

Links
https://nikulsuthar.netlify.app
`;

const sample3 = `
Aakash Saini
sainiaakash177@gmail.com
+91-9782681155
Jaipur

Education
JECRC University Aug 2023 Jul 2025
Masters in Computer Applications (MCA) Jaipur, Rajasthan
Specialization: Cloud Computing & Full Stack Development
University Maharaja College Aug 2020 Jun 2023
Bachelors in Computer Applications (BCA) Jaipur, Rajasthan

Experience
MERN Full-Stack Developer Intern Feb 2025 Jun 2025
Grras Solution Pvt. Ltd. Jaipur, Rajasthan
(MERN) in a live development environment.

Projects
Auth-System

Links
`;

const sample4 = `
Embedded Links Test
Check out my github.com/embedded-user and linkedin.com/in/embedded-user profile.
Also https://github.com/full-url and www.linkedin.com/in/www-url
`;
const sample5 = `
Riya Sharma
riyasharma@gmail.com
+91 9876543210
Jaipur, Rajasthan

Summary
Looking for a frontend developer job in React and Tailwind.

Skills
React, Node, Tailwind, Git, MongoDB

Experience
Intern - XYZ Tech Solutions
Worked on developing UI components.

Projects
Food Ordering App
Portfolio Website

Links
linkedin.com/in/riyasharma
github.com/riya-dev
`;

const sample6 = `
SOURABH MEHTA | Java Developer
Email: sourabhmehta@gmail.com | Contact: 9992221114
Location: Delhi, India

WORK EXPERIENCE
Accenture (Intern) - Java Spring Boot Developer

EDUCATION
B.Tech - Computer Science
2021-2025

SKILLS
Java, Spring Boot, OOPS, MySQL, REST API

GITHUB
github.com/sourabh-code
`;

const sample7 = `
Name: Priyanka Gupta
Location: Mumbai
Mail: priyankag@gmail.com

EDUCATION
MCA 2023-present
BCA from Mumbai University

PROJECTS
AI Chatbot using Python
Student Management System

LINKS:
https://www.linkedin.com/in/priyankag/
`;

const sample8 = `
AMAN KUMAR
Software Engineer

Summary
Full Stack Developer with MERN stack knowledge.

Skills:
Html | Css | Js | React | Node | Express | MongoDB

Experience:
Google Pay Clone Project
Weather App

Github: github.com/amankode
LinkedIn: linkedin.com/in/aman
`;

const sample9 = `
Vishal Singh
Email: vsingh@gmail.com | Jaipur

PROFILE
React developer with interest in javascript.

ACADEMIA
B.Tech (IT)
St. Xaviers College, Jaipur

Achievements
Smart India Hackathon finalist

LINKS:
www.github.com/vishal-code
www.linkedin.com/in/vishal
`;

const sample10 = `
Manas Rathore
Phone: 8899222201
Email: manas@gmail.com
Location: Kota

EDUCATION
JECRC University
BCA

Skills
JavaScript, Express.js

Links:
https://github.com/abc
`;

const sample11 = `
Rohit Sharma
+91-998848448
Noida

ACADEMIC BACKGROUND
Bachelor in Computer Science

PROJECTS
Ecommerce website using MERN

Github Profile: github.com/rohitsharma
`;

const sample12 = `
HARSH PRAJAPAT

SUMMARY
Experienced in web technology.

EDUCATION
MCA 2024-present

PORTFOLIO LINKS
Portfolio: harshprajapat.dev
LinkedIn: linkedin.com/harsh
`;

const sample13 = `
Resume

Sunil Kumar
Email: sunilweb@gmail.com

WORK HISTORY
Intern at Coding Ninjas

PROJECTS:
Realtime Chat App
Invoice generator

LINKS
http://github.com/sunil
http://linkedin.com/in/sunil
`;

const sample14 = `
Name: Abhishek Yadav
Email: abhi@dev.com

Experience
DevOps Intern

Education
Diploma in Computer Engineering
`;

const sample15 = `
-----------------------------------------------
|       RAJAT VERMA                          |
|  Email: rajatv@gmail.com                   |
|  Phone: 9898989898                          |
-----------------------------------------------

EDUCATION:
B.Tech in Computer Science
JECRC University (2019-2023)

SKILLS:
• Java
• Python
• HTML • CSS  • JS

PROJECTS:
> Smart Parking System
> Face Detection System

GitHub: https://github.com/rajat
LinkedIn: www.linkedin.com/in/rajat
`;
const sample16 = `
Simran Kaur
Email: simrankaur@gmail.com
Contact: 9090999999

MCA from Delhi University, 2023
BCA from Delhi University, 2021

Worked on:
React, Node, Express.js, PostgreSQL

Developed E-commerce and Social Media apps.

github.com/simran
linkedin.com/in/simran
`;
const sample17 = `
<img src="https://some-photo-storage.com/photo.jpg" />

RAKESH SINGH
Developer

Email: rakesh@dev.com

Projects:
Portfolio Website
QR Code Generator

LinkedIn Profile:
https://linkedin.com/in/rakesh
GitHub:
https://github.com/raksh
`;
const sample18 = `
My name is Pratibha Sharma and I am a MERN Stack Developer.
I completed MCA from JECRC. I have experience with React,
Node, MongoDB and Express. My projects include Ecommerce App,
Weather App and Portfolio App. Contact: 9988776655 Email:
pratibhadev@gmail.com. GitHub link is github.com/pratibha
and my LinkedIn is linkedin.com/in/pratibha.
`;
const sample19 = `
PROFESSIONAL SUMMARY
4 years of experience as Software Engineer.

WORK EXPERIENCE
TCS | Full-Stack Developer | June 2021 – present
Infosys | Web Developer | Jan 2020 – May 2021

EDUCATION
M.Tech in CS, IIT Delhi
B.Tech in CS, AKTU

SKILLS
JavaScript, React, SQL, AWS, Docker

PROJECTS
Attendance Management System

Profile Links:
naukri.com/r/profile/12345
github.com/tcscode
www.linkedin.com/in/infosysdev
`;


async function test() {
  const samples = [
    sample1, sample2, sample3, sample4, sample5, sample6, sample7, sample8, sample9, sample10,
    sample11, sample12, sample13, sample14, sample15, sample16, sample17, sample18, sample19
  ];

  for (let i = 0; i < samples.length; i++) {
    console.log(`\n--- Sample ${i + 1} ---`);
    try {
        const res = await parseResumeText(samples[i]);
        console.log("Name:", res.name);
        console.log("Email:", res.email);
        console.log("Phone:", res.phone);
        console.log("Location:", res.location);
        console.log("Links:", JSON.stringify(res.links, null, 2));
        // console.log("Education:", JSON.stringify(res.education, null, 2)); // Keeping it brief for overview
        // console.log("Experience:", JSON.stringify(res.experience, null, 2));
    } catch (e) {
        console.log("Error parsing sample", i+1, e.message);
    }
  }
}

test();
