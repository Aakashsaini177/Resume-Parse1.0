import fs from 'fs';
import path from 'path';

const source = String.raw`C:\Users\aashu\.gemini\antigravity\brain\0f877abc-33ba-4b0c-a932-9efcbfc99ecb\uploaded_image_1764663812294.png`;
const dest = String.raw`c:\Users\aashu\OneDrive\Desktop\demo\client\public\favicon.ico`;

try {
  fs.copyFileSync(source, dest);
  console.log('Favicon copied successfully to:', dest);
} catch (err) {
  console.error('Error copying favicon:', err);
}
