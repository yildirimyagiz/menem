import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the original en.json file
const inputPath = path.join(__dirname, '../src/messages/en.json');
const outputDir = path.join(__dirname, '../locales/en');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read the source file
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Define the sections and their key mappings
const sections = {
  admin: ['Admin'],
  client: ['ClientDashboard'],
  dashboard: ['dashboard', 'Dashboard'],
  common: ['common', 'dateTime', 'toast', 'error', 'success', 'navigation', 'buttons', 'forms', 'status', 'statusOptions', 'statusValues'],
  places: ['places']
};

// Function to extract nested objects
function extractNestedObjects(obj, keys) {
  const result = {};
  
  keys.forEach(key => {
    if (obj[key]) {
      result[key] = obj[key];
    }
  });
  
  return result;
}

// Process each section
Object.entries(sections).forEach(([sectionName, keys]) => {
  const sectionData = extractNestedObjects(data, keys);
  
  if (Object.keys(sectionData).length > 0) {
    const outputPath = path.join(outputDir, `${sectionName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(sectionData, null, 2));
    console.log(`Created ${outputPath} with keys:`, Object.keys(sectionData));
  }
});

console.log('English translation splitting complete!'); 