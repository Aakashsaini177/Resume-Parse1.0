// utils/normalizeText.js

export function normalizeText(text) {
  if (!text) return "";
  return text
    .replace(/•|●|▪|–|—|\t+/g, " ")
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, " ") // page markers
    .replace(/\r/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/*
  Ye text cleaning stage hai:

  - Bullet symbols remove karta hai
  - Extra whitespace remove karta hai
  - Page markers remove
  - Final output: clean plain text
*/
