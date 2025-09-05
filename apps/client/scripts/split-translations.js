import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the sections we want to extract
const sections = ['admin', 'common', 'client', 'dashboard', 'places'];

// Languages to process
const languages = ['ar', 'de', 'es', 'fa', 'fr', 'hi', 'it', 'ja', 'ru', 'th', 'zh'];

function extractSection(data, sectionName) {
  const result = {};
  
  // Extract top-level keys that match the section
  if (data[sectionName]) {
    result[sectionName] = data[sectionName];
  }
  
  // Extract keys that start with the section name (capitalized)
  const sectionKey = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
  if (data[sectionKey]) {
    result[sectionKey] = data[sectionKey];
  }
  
  // Extract common keys that should be in common.json
  if (sectionName === 'common') {
    const commonKeys = ['common', 'general', 'navigation', 'buttons', 'forms', 'errors', 'success'];
    commonKeys.forEach(key => {
      if (data[key]) {
        result[key] = data[key];
      }
    });
  }
  
  return result;
}

function splitTranslations(language) {
  const inputPath = path.join(__dirname, '../src/messages', `${language}.json`);
  const outputDir = path.join(__dirname, '../locales', language);
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Read the source file
  if (!fs.existsSync(inputPath)) {
    console.log(`Skipping ${language}: ${inputPath} not found`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  // Extract each section
  sections.forEach(section => {
    const sectionData = extractSection(data, section);
    
    if (Object.keys(sectionData).length > 0) {
      const outputPath = path.join(outputDir, `${section}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(sectionData, null, 2));
      console.log(`Created ${outputPath}`);
    }
  });
}

// Process all languages
languages.forEach(language => {
  console.log(`Processing ${language}...`);
  splitTranslations(language);
});

console.log('Translation splitting complete!'); 