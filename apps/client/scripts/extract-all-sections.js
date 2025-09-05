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

// Define all the sections to extract
const sections = {
  tasks: ['Tasks', 'tasks'],
  agencies: ['Agencies'],
  agents: ['Agents', 'agents'],
  tenants: ['Tenants', 'tenants'],
  properties: ['Properties', 'properties', 'propertyManagement'],
  facilities: ['facilities'],
  payments: ['payments', 'payment'],
  messages: ['messages', 'Chat'],
  notifications: ['notifications'],
  settings: ['settings'],
  profile: ['profile', 'Profile'],
  analytics: ['analytics', 'Analytics'],
  reports: ['reports', 'Reports'],
  support: ['support', 'Support'],
  help: ['help', 'Help'],
  documentation: ['documentation', 'Documentation'],
  places: ['places'],
  posts: ['Posts', 'posts'],
  index: ['Index'],
  common: ['common', 'dateTime', 'toast', 'error', 'success', 'navigation', 'buttons', 'forms', 'status', 'statusOptions', 'statusValues', 'nav'],
  admin: ['Admin', 'admin'],
  client: ['ClientDashboard'],
  dashboard: ['dashboard', 'Dashboard']
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

console.log('All sections extracted successfully!'); 