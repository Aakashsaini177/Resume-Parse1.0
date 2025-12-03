// utils/normalizeDownloadURL.js

export function normalizeDownloadURL(url) {
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
        direct: `https://drive.google.com/uc?export=download&id=${fileId}`,
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

/*
  Ye function kya karta hai?

  - URL ko detect karta hai kis platform ka hai:
    - Google Drive
    - Dropbox
    - OneDrive / SharePoint
    - CloudFront
    - GitHub
    - Direct file URL (.pdf / .docx / etc.)
  - Phir usko "direct download" URL me convert karta hai.

  Example:
    https://drive.google.com/file/d/<ID>/view
      -> https://drive.google.com/uc?export=download&id=<ID>

  Final output:
    { type: 'google_drive', direct: 'https://drive.google.com/uc?export=download&id=...' }
*/
