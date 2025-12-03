// parser/nlpParser.js
import nlp from "compromise";
import { normalizeText } from "../utils/normalizeText.js";
import { JOB_DESCRIPTIONS } from "../data/jobDescriptions.js";

const SKILL_DICTIONARY = [
  "javascript", "typescript", "react", "node", "express", "mongodb",
  "mysql", "html", "css", "tailwind", "redux",
  "python", "django", "flask",
  "java", "spring", "c++", "c#", "git", "github",
  "docker", "kubernetes", "aws", "azure"
];

const patterns = {
  education: /(education|academics|qualification|academic background|academia)/i,
  experience: /(experience|work experience|employment|work history|professional experience|professional summary|summary|profile)/i,
  projects: /(projects|personal projects|academic projects|key projects)/i,
  skills: /(skills|technical skills|technologies|competencies|technical proficiency)/i,
  certificates: /(certifications|certificates|achievements|awards|honors)/i,
  interests: /(interests|hobbies)/i,
  links: /(links|portfolio links|socials|profiles)/i
};

function blockToLines(text) {
  if (!text) return [];
  return text.split('\n').map(l => l.trim()).filter(Boolean);
}

// Section Segmentation Logic
function segmentResume(text) {
  const sections = {
    experience: "",
    projects: "",
    education: "",
    skills: "",
    certificates: "",
    certificates: "",
    interests: "",
    links: "",
    unknown: ""
  };

  const lines = text.split("\n");
  let current = "unknown";

  for (let line of lines) {
    const check = line.trim();
    if (!check) continue;

    if (check.length < 50) {
      if (patterns.education.test(check)) current = "education";
      else if (patterns.experience.test(check)) current = "experience";
      else if (patterns.projects.test(check)) current = "projects";
      else if (patterns.skills.test(check)) current = "skills";
      else if (patterns.certificates.test(check)) current = "certificates";
      else if (patterns.interests.test(check)) current = "interests";
      else if (patterns.links.test(check)) current = "links";
      else {
        sections[current] += line + "\n";
      }
    } else {
      sections[current] += line + "\n";
    }
  }

  // Clean-up with education formatting
  for (const key in sections) {
    sections[key] = sections[key]
      .split("\n")
      .map(l => normalizeText(l))
      .filter(Boolean)
      .join("\n");
  }

  return sections;
}

function extractName(doc, raw) {
  // 0. Explicit "Name:" pattern
  const nameMatch = raw.match(/(?:Name|Candidate Name)\s*[:|-]\s*([A-Za-z\s]+)/i);
  if (nameMatch) {
    return nameMatch[1].trim();
  }

  // first 2 lines pe focus
  const firstBlock = raw
    .split("\n")
    .slice(0, 3)
    .join(" ")
    .replace(/(linkedin|github|portfolio|netlify|email|phone|contact).*/i, "")
    .replace(/[^a-zA-Z\s.]/g, "")
    .trim();

  if (firstBlock && firstBlock.split(" ").length <= 4) {
    return firstBlock;
  }

  // NLP fallback
  const people = doc.people().out("array");
  if (people.length > 0) return people[0];

  return firstBlock;
}

function extractEmail(text) {
  // Explicit "Email:" pattern
  const explicit = text.match(/(?:Email|Mail|E-mail)\s*[:|-]\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (explicit) return explicit[1];

  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

function extractPhone(text) {
  // Explicit "Phone:" pattern
  const explicit = text.match(/(?:Phone|Contact|Mobile|Cell)\s*[:|-]\s*(\+?\d[\d\s-]{8,})/i);
  if (explicit) return explicit[1].trim();

  const match = text.match(/(\+?\d{1,3}[- ]?)?\d{10}/);
  return match ? match[0] : null;
}

function extractLocation(doc, text) {
  // 0. Explicit "Location:" pattern
  const explicit = text.match(/(?:Location|Address|City)\s*[:|-]\s*([A-Za-z\s,]+)/i);
  if (explicit) {
     return explicit[1].trim();
  }

  // 1. Regex Fallback for "City, State" or "City, Country"
  // Prioritize this if it appears in the first 10 lines (header area)
  const lines = text.split('\n').slice(0, 15);
  const locationRegex = /([A-Z][a-zA-Z\s]+),\s*([A-Z][a-zA-Z\s]+)/;
  
  for (let line of lines) {
    // Skip lines that look like education/institution names to avoid "Technology, Jaipur"
    if (/(university|college|school|institute|technology|engineering)/i.test(line)) continue;

    const match = line.match(locationRegex);
    if (match) {
      const loc = match[0].trim();
      // Validate it's not a sentence
      if (loc.split(' ').length < 6) {
         return loc;
      }
    }
  }

  // 2. NLP Extraction (Compromise)
  const places = doc.places().out('array');
  if (places.length > 0) {
    // Filter out false positives (universities, events, etc.)
    const validPlaces = places.filter(p => {
      const lower = p.toLowerCase();
      // Exclude common non-location words that might be tagged as places
      if (lower.includes("university") || lower.includes("college") || lower.includes("school") || lower.includes("institute")) return false;
      if (lower.includes("park") || lower.includes("participation") || lower.includes("hackathon") || lower.includes("conclave")) return false;
      if (lower.includes("limited") || lower.includes("pvt") || lower.includes("ltd")) return false;
      return true;
    });

    if (validPlaces.length > 0) {
      return validPlaces[0];
    }
  }

  return null;
}

function extractSkills(text, sectionLines) {
  // Use section lines if available, otherwise fallback to full text
  const sourceText = sectionLines && sectionLines.length > 0 ? sectionLines.join(" ") : text;
  const lower = sourceText.toLowerCase();
  const found = new Set();

  SKILL_DICTIONARY.forEach((skill) => {
    // Escape special regex characters (like +, #)
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // If skill contains non-word chars (like c++, c#), use whitespace/punctuation boundaries instead of \b
    // \b only works between word (a-z0-9_) and non-word characters.
    // So \bc++\b fails because + is non-word, and space is non-word, so no boundary between + and space.
    const isSymbol = /[^a-zA-Z0-9_]/.test(skill);
    const pattern = isSymbol 
      ? `(^|\\s|[,./])${escapedSkill}($|\\s|[,./])` 
      : `\\b${escapedSkill}\\b`;

    const regex = new RegExp(pattern, 'i');
    if (regex.test(lower)) {
      found.add(
        skill.charAt(0).toUpperCase() + skill.slice(1)
      );
    }
  });

  return Array.from(found);
}

const eduKeywords = /(bca|mca|b\.tech|university|college|bachelors|masters|diploma|higher secondary|matriculation|school|institute)/i;

function extractEducation(lines) {
  const edu = [];
  let buffer = "";

  lines.forEach(line => {
    const trim = line.trim();
    if (trim.length < 4) return;

    // Check if line is just a date range
    const isDate = /^\d{4}|present|current|ongoing/i.test(trim) && trim.length < 20;
    
    if (isDate) {
      // Append date to previous line if it exists
      if (edu.length > 0) {
        edu[edu.length - 1] += " (" + trim + ")";
      }
      return;
    }

    // Keep lines that match keywords OR are capitalized (likely school names)
    if (eduKeywords.test(trim) || /^[A-Z]/.test(trim)) {
      edu.push(trim);
    }
  });

  return edu;
}

function extractExperience(lines) {
  const exp = [];
  // Keywords for roles
  const roleKeywords = /(intern|developer|engineer|software|full.?stack|mern|associate|consultant|analyst|lead|architect|manager)/i;
  
  lines.forEach(line => {
    const trim = line.trim();
    if (!trim) return;

    // Exclude lines that start with common verbs (likely descriptions)
    if (/^(learned|developed|created|utilized|managed|worked|assisted|designed|implemented|maintained|gaining|building)/i.test(trim)) return;

    // Exclude long lines (sentences) - Role titles are usually short
    if (trim.split(/\s+/).length > 10) return;

    // If it matches a role keyword OR looks like a Company/Date line
    // We want to capture: "Web Developer Intern", "Deeva Payon Global...", "09/2024 - Present"
    
    // 1. Role Match
    if (roleKeywords.test(trim)) {
        exp.push(trim);
        return;
    }

    // 2. Date Match (keep it as part of details if user wants, but user said "no years")
    // User said "years nhi chaiye only detailes chaiye".
    // If I include the date line "09/2024 - Present", that IS the years.
    // So I should SKIP date-only lines.
    if (/^\d{2}\/\d{4}|present|current|ongoing/i.test(trim)) return;

    // 3. Company Match (Heuristic: Capitalized, not a verb, not too long)
    if (/^[A-Z]/.test(trim) && !/^[a-z]/.test(trim) && trim.length > 3) {
        // It might be a company name
        exp.push(trim);
    }
  });

  // Clean up: Remove duplicates and date-like strings from the captured lines
  // Clean up: Remove duplicates and date-like strings from the captured lines
  return [...new Set(exp)].map(line => {
      let l = line.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s?\d{4}\s?[-–]\s?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s?\d{4}/gi, "")
                 .replace(/\b\d{4}\s?[-–]\s?\d{4}\b/g, "")
                 .replace(/present|current|ongoing/gi, "")
                 .replace(/[-–,]\s*$/, "")
                 .trim();
      
      // Remove "GitHub" if it appears alone or at end
      l = l.replace(/GitHub$/i, "").trim();
      return l;
  }).filter(l => l.length > 3 && !/^\d+$/.test(l));
}

const projectKeywords = /(project|application|system|website|store|clone|tracker|portfolio|gallery|platform)/i;

function extractProjects(lines) {
  const items = lines.filter(line => {
    const trim = line.trim();
    if (!trim) return false;
    // Exclude bullet points
    if (/^[•●\-]/.test(trim)) return false;
    // Exclude long sentences
    if (trim.split(/\s+/).length > 10) return false;
    // Exclude lines starting with verbs
    if (/^(learned|developed|created|utilized|managed|worked|assisted|designed|implemented|maintained|building|creating|integrated|deployed|optimized)/i.test(trim)) return false;
    
    // Accept if matches keyword OR looks like a title
    return projectKeywords.test(trim) || (trim.length < 50 && /^[A-Z]/.test(trim) && !trim.endsWith('.'));
  }).map(i => i.replace(/GitHub$/i, "").trim());
  
  return [...new Set(items)];
}

function extractLinks(text) {
  const clean = text
    .replace(/\s+/g, " ")
    .replace(/\)+/g, ") ")
    .trim(); // Don't lowercase yet to preserve case for some IDs if needed, but usually URLs are case-insensitive. Lowercasing helps matching.
  
  const lower = clean.toLowerCase();

  const normalizeURL = (url) => {
    if (!url) return null;
    let normalized = url.trim().replace(/(\)|,|;|\.|\|)+$/, ""); // Remove trailing punctuation
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = "https://" + normalized;
    }
    return normalized;
  };

  const find = (regex) => {
    const matches = lower.match(regex);
    return matches ? [...new Set(matches.map(normalizeURL))] : [];
  };

  // 1. Specific Platform Regexes (More permissive)
  // Matches: linkedin.com/in/..., www.linkedin.com/..., https://...
  // Allow dots, dashes, underscores in username.
  const linkedIn = find(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-z0-9._-]+\/?/gi);
  const github = find(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-z0-9._-]+\/?/gi);
  const leetcode = find(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/[a-z0-9._-]+\/?/gi);

  // 2. Generic URL Extraction
  // Captures anything looking like a domain: word.word (e.g. myportfolio.com, cool-site.io)
  // Excludes common file extensions or tech names like node.js, react.js
  const genericUrlRegex = /\b(?:https?:\/\/)?(?:www\.)?[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.[a-z]{2,}(?:\/[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*)?/gi;
  
  const allUrls = find(genericUrlRegex);

  // 3. Filter and Categorize
  const portfolio = [];
  const other = [];

  const ignoreList = [
    "linkedin.com", "github.com", "leetcode.com", // Already handled
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", // Emails
    "node.js", "react.js", "vue.js", "next.js", "express.js", "chart.js", "moment.js", // Tech libraries
    "example.com", "localhost" // Noise
  ];

  allUrls.forEach(url => {
    const lowerUrl = url.toLowerCase();
    
    // Skip if in ignore list
    if (ignoreList.some(ignore => lowerUrl.includes(ignore))) return;

    // Skip if it's likely an email (contains @ before domain, though regex \b start helps, email regex is better to exclude)
    if (lowerUrl.includes("@")) return; 

    // Categorize
    if (lowerUrl.includes("linkedin.com")) {
       if (!linkedIn.includes(url)) linkedIn.push(url);
    } else if (lowerUrl.includes("github.com")) {
       if (!github.includes(url)) github.push(url);
    } else if (lowerUrl.includes("leetcode.com")) {
       if (!leetcode.includes(url)) leetcode.push(url);
    } else {
       // Assume it's a portfolio or other link
       // Prioritize common portfolio TLDs or keywords
       if (/(portfolio|resume|cv|personal|website)/i.test(url) || /\.(io|me|dev|app|tech|site)$/i.test(url)) {
         portfolio.push(url);
       } else {
         other.push(url);
       }
    }
  });

  // If portfolio is empty but 'other' has items, move the first 'other' to portfolio (heuristic)
  if (portfolio.length === 0 && other.length > 0) {
    portfolio.push(other.shift());
  }

  return {
    linkedIn: linkedIn[0] || null, // Return single string as per original structure expectation if needed, or array? 
    // Original code returned single string for specific, array for other? 
    // Looking at original: find returns ONE string (match[0]). 
    // Let's keep it consistent: return FIRST match for specific, array for others?
    // Actually, user might have multiple. But UI usually shows one. 
    // Let's return the first one for specific platforms to maintain backward compatibility if UI expects string.
    // Wait, original `find` returned `normalizeURL(match[0])` -> String.
    // So yes, return string for specific, array for other.
    
    linkedIn: linkedIn.length > 0 ? linkedIn[0] : null,
    github: github.length > 0 ? github[0] : null,
    leetcode: leetcode.length > 0 ? leetcode[0] : null,
    portfolio: portfolio.length > 0 ? portfolio[0] : null,
    other: [...new Set([...portfolio.slice(1), ...other])] // Put rest in other
  };
}

function predictDomain(text){
  const domainMap = [
    { domain:"Frontend", keywords:["react","html","css","tailwind","javascript"] },
    { domain:"MERN", keywords:["mern","mongodb","express","node"] },
    { domain:"Backend", keywords:["node","express","sql","api"] },
    { domain:"Data Science", keywords:["numpy","pandas","analysis","ml","ai"] },
    { domain:"DevOps", keywords:["docker","aws","cloud","kubernetes","ci","cd"] },
    { domain:"Mobile", keywords:["flutter","android","kotlin","swift"] }
  ];

  text = text.toLowerCase();

  const matches = domainMap.filter(item =>
    item.keywords.some(kw => text.includes(kw))
  );

  return matches.map(m=>m.domain);
}



const DEFAULT_JD = JOB_DESCRIPTIONS["MERN"];

function calculateATSScore(resumeText, predictedDomains = []) {
  // Select best JD based on predicted domain
  let jobDescription = DEFAULT_JD;
  let selectedDomain = "MERN (Default)";

  if (predictedDomains && predictedDomains.length > 0) {
    const mainDomain = predictedDomains[0]; // Use the first/strongest prediction
    if (JOB_DESCRIPTIONS[mainDomain]) {
        jobDescription = JOB_DESCRIPTIONS[mainDomain];
        selectedDomain = mainDomain;
    }
  }

  // normalize
  const rText = resumeText.toLowerCase();
  const jdText = jobDescription.toLowerCase();

  // tokenize
  const tokenize = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9+.#\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

  const resumeWords = tokenize(rText);
  const jdWords = tokenize(jdText);

  // 1. Keyword Match
  const matchedKeywords = jdWords.filter(word =>
    resumeWords.includes(word)
  );

  const keywordScore = jdWords.length > 0 ? matchedKeywords.length / jdWords.length : 0;

  // 2. Skills extraction
  const skillsList = [
    "react", "node", "express", "mongodb",
    "javascript", "typescript", "aws",
    "docker", "python", "html", "css",
    "java", "sql", "devops", "postman",
    "tailwind", "redux"
  ];

  const resumeSkills = skillsList.filter(skill =>
    resumeWords.includes(skill)
  );

  const skillScore = skillsList.length > 0 ? resumeSkills.length / skillsList.length : 0;

  // 3. Experience Score
  const experienceKeywords = [
    "experience", "internship", "work", "developer",
    "engineer", "software", "project"
  ];

  const experienceScore =
    experienceKeywords.filter(x => rText.includes(x)).length /
    experienceKeywords.length;

  // 4. Education Score
  const educationKeywords = [
    "btech", "mca", "masters", "bachelor",
    "b.e", "m.e", "degree"
  ];

  const educationScore =
    educationKeywords.filter(x => rText.includes(x)).length /
    educationKeywords.length;

  // 5. Formatting score
  const requiredSections = [
    "skills", "experience", "projects",
    "education"
  ];

  const formatScore =
    requiredSections.filter(x => rText.includes(x)).length /
    requiredSections.length;

  // final weighted score
  const ATSScore =
    (keywordScore * 0.4) +
    (skillScore * 0.3) +
    (experienceScore * 0.15) +
    (educationScore * 0.1) +
    (formatScore * 0.05);

  // Cap at 100, ensure integer
  const finalScore = Math.min(Math.round(ATSScore * 100), 100);

  return {
    ats_score: finalScore,
    applied_domain: selectedDomain,
    matched_keywords: [...new Set(matchedKeywords)],
    matched_skills: resumeSkills,
    missing_keywords: [...new Set(jdWords.filter(x => !matchedKeywords.includes(x)))].slice(0, 10) // Limit missing to 10
  };
}

export async function parseResumeText(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Invalid resume text");
  }

  // Normalize text but DO NOT remove section headers or structure
  const normalized = normalizeText(rawText);
  const doc = nlp(normalized);
  
  // Segment the resume into sections
  const sections = segmentResume(rawText);

  const name = extractName(doc, rawText);
  const email = extractEmail(rawText);
  const phone = extractPhone(rawText);
  const location = extractLocation(doc, rawText);
  
  const links = extractLinks(rawText);

  // Use section-specific content where possible
  const skills = extractSkills(rawText, blockToLines(sections.skills));
  
  // Fallback: If sections are empty (segmentation failed), use full text
  const eduLines = sections.education ? blockToLines(sections.education) : blockToLines(sections.unknown);
  const expLines = sections.experience ? blockToLines(sections.experience) : blockToLines(sections.unknown);
  const projLines = sections.projects ? blockToLines(sections.projects) : blockToLines(sections.unknown);

  const education = extractEducation(eduLines);
  const experience = extractExperience(expLines);
  const projects = extractProjects(projLines);
  
  const domains = predictDomain(rawText);
  const atsData = calculateATSScore(rawText, domains);

  return {
    name,
    email,
    phone,
    location,
    skills,
    education,
    experience,
    projects,
    certificates: blockToLines(sections.certificates), // Return raw lines for certificates
    domains,
    atsScore: atsData.ats_score,
    atsDetails: {
        matched_skills: atsData.matched_skills,
        missing_keywords: atsData.missing_keywords,
        applied_domain: atsData.applied_domain
    },
    links,
    cleanedText: normalized,
  };
}
