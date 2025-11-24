// IMPORTS
import axios from "axios";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { fileTypeFromBuffer } from "file-type";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";


// NORMALIZE DOWNLOAD URLS
function normalizeDownloadURL(url) {
  url = url.trim();

  if (url.includes("drive.google.com") || url.includes("docs.google.com")) {
    const patterns = [
      /\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /\/open\?id=([a-zA-Z0-9_-]+)/
    ];

    let fileId = null;

    for (const pattern of patterns) {
      const found = url.match(pattern);
      if (found) {
        fileId = found[1];
        break;
      }
    }

    if (fileId) {
      return {
        type: "google_drive",
        direct: `https://drive.google.com/uc?export=download&id=${fileId}`
      };
    }
  }

  if (url.includes("dropbox.com")) {
    return {
      type: "dropbox",
      direct: url.replace(/dl=0/, "dl=1"),
    };
  }

  if (url.includes("onedrive") || url.includes("sharepoint")) {
    return {
      type: "onedrive_sharepoint",
      direct: url.includes("download") ? url : `${url}&download=1`,
    };
  }

  if (url.includes("cloudfront.net")) {
    return {
      type: "cloudfront",
      direct: url,
    };
  }

  if (url.includes("github.com")) {
    return {
      type: "github",
      direct: url
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/"),
    };
  }

  if (url.match(/\.(pdf|doc|docx|txt|rtf|pptx)$/i)) {
    return {
      type: "direct",
      direct: url,
    };
  }

  return {
    type: "unknown",
    direct: url,
  };
}


// REMOVE UNWANTED CHARACTERS AND NORMALIZE SPACES
function normalize(text) {
  return text
    .replace(/•|●|▪|–|—|\t+/g, "")
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}


// EXTRACT RAW TEXT FROM PDF AND DOCX FILES
async function extractRawText(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = response.data;

  const detected = await fileTypeFromBuffer(buffer);
  let text = "";

  if (!detected) {
    throw new Error("Could not determine file type.");
  }

  if (detected.ext === "pdf") {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    text = result.text;

  } else if (detected.ext === "docx" || detected.ext === "doc") {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;

  } else {
    text = "Unsupported file: " + detected.mime;
  }

  return text;
}


// EXTRACT SECTIONS FROM RESUME TEXT
function parseResume(text) {
  const sections = {
    name: "",
    contact: "",
    objective: "",
    experience: "",
    projects: "",
    education: "",
    skills: "",
    certifications: "",
  };

  const patterns = {
    name: /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+$/,
    objective: /(objective|summary|career goal)/i,
    experience: /(experience|work history|employment)/i,
    education: /(education|academics|qualification)/i,
    skills: /(skills|technical skills|core skills)/i,
    projects: /(project|projects|portfolio|work samples)/i,
    certifications: /(certifications|courses|achievements)/i,
  };

  const lines = text
    .split("\n")
    .map((line) => normalize(line))
    .filter(Boolean);

  let current = "header";

  for (const line of lines) {
    const check = line.toLowerCase();

    if (patterns.objective.test(check)) current = "objective";
    else if (patterns.experience.test(check)) current = "experience";
    else if (patterns.education.test(check)) current = "education";
    else if (patterns.skills.test(check)) current = "skills";
    else if (patterns.projects.test(check)) current = "projects";
    else if (patterns.certifications.test(check)) current = "certifications";
    else {
      if (current === "header") {
        if (!sections.name && patterns.name.test(line)) {
          sections.name = line;
        } else {
          sections.contact += line + " ";
        }
      } else {
        sections[current] += line + "\n";
      }
    }
  }

  Object.keys(sections).forEach((key) => {
    sections[key] = normalize(sections[key]);
  });

  return sections;
}


// EXTRACT SPECIFIC FIELDS FROM PARSED SECTIONS
function extractFields(parsed) {
  const final = {
    name: parsed.name || null,
    email: null,
    phone: null,
    location: null,
    linkedin: null,
    github: null,
    experience: parsed.experience || null,
    education: parsed.education || null,
    projects: parsed.projects || null,
    certifications: parsed.certifications || null,
    skills: parsed.skills || null,
  };

  const emailMatch = parsed.contact.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) final.email = emailMatch[0];

  const phoneMatch = parsed.contact.match(/(\+91[\s-]?)?(\d{10})/);
  if (phoneMatch) final.phone = `+91-${phoneMatch[2]}`;
  else final.phone = null;

  const linkedinMatch = parsed.contact.match(/(https?:\/\/)?(www\.)?linkedin\.com\/[^\s]+|linkedin\/[^\s]+/i);
  if (linkedinMatch) final.linkedin = linkedinMatch[0];

  const githubMatch = parsed.contact.match(/(https?:\/\/)?(www\.)?github\.com\/[^\s]+|github\/[^\s]+/i);
  if (githubMatch) final.github = githubMatch[0];

  const locationPattern = /\b([A-Za-z]+(?:[\s-][A-Za-z]+)*),\s*([A-Za-z]+(?:[\s-][A-Za-z]+)*)(?:,\s*([A-Za-z]+))?\b/;
  const locationMatch = parsed.contact.match(locationPattern);
  final.location = locationMatch ? locationMatch[0] : null;

  final.certifications = parsed.certifications
    ? parsed.certifications
        .split(/[\|\n]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    : null;

  return final;
}


// NORMALIZE RESUME TO CLEAN OUTPUT JSON
function normalizeResume(raw) {
  let result = {};

  result.name = raw.name || null;
  result.email = raw.email || null;
  result.phone = raw.phone || null;
  result.location = raw.location?.replace(/india/i, "").trim() || null;

  const degreeKeywords = /(mca|bca|b\.?tech|m\.?tech|bba|mba|bsc|msc)/gi;
  let degrees = [];

  if (raw.education) {
    raw.education.split("\n").forEach((line) => {
      const match = line.match(degreeKeywords);
      if (match) {
        match.forEach((d) => degrees.push(d.replace(".", "").toUpperCase()));
      }
    });
  }

  result.education = [...new Set(degrees.sort())];

  if (typeof raw.skills === "string") {
    result.skills = raw.skills
      .replace(/\n/g, " ")
      .split(/[:,;]/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 1);
  } else {
    result.skills = [];
  }

  if (raw.experience) {
    const stopKeywords = [
      "education",
      "skills",
      "projects",
      "certifications",
      "summary",
    ];
    const stopIndex = stopKeywords
      .map((keyword) => raw.experience.toLowerCase().indexOf(keyword))
      .filter((i) => i > 0)
      .sort((a, b) => a - b)[0];

    result.experience = stopIndex
      ? raw.experience.slice(0, stopIndex).trim()
      : raw.experience.trim();
  }

  result.profile_links = [];
  if (raw.linkedin) {
    let id = raw.linkedin.replace(/(linkedin\.com\/in\/|LinkedIn\/)/gi, "").trim();
    result.profile_links.push(`https://www.linkedin.com/in/${id}`);
  }

  if (raw.github) {
    let id = raw.github.replace(/(github\.com\/|GitHub\/)/gi, "").trim();
    result.profile_links.push(`https://github.com/${id}`);
  }

  if (result.profile_links.length === 0)
    result.profile_links = null;

  result.projects = raw.projects || null;
  result.certifications = raw.certifications || null;

  return result;
}


// MAIN PARSER FUNCTION
async function parseResumeFromInput(urlFromUser) {
  const url = normalizeDownloadURL(urlFromUser).direct;

  const rawtext = await extractRawText(url);
  const parsedSections = parseResume(rawtext);
  const result = normalizeResume(extractFields(parsedSections));

  console.log(result);
  return result;
}


// EXPRESS SERVER
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/parse", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.trim()) {
    return res.json({ success: false, error: "Please enter a URL" });
  }

  try {
    const result = await parseResumeFromInput(url);
    res.json({ success: true, data: result });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Resume Parser API Running");
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
