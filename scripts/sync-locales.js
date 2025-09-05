const fs = require('fs');
const path = require('path');

// Paths to locale directories
const enDir = path.join(__dirname, '../apps/client/locales/en');
const trDir = path.join(__dirname, '../apps/client/locales/tr');

// Function to recursively merge objects, preserving existing Turkish translations
function mergeObjects(enObj, trObj) {
  const result = {};
  
  for (const key in enObj) {
    if (typeof enObj[key] === 'object' && enObj[key] !== null && !Array.isArray(enObj[key])) {
      // If it's an object, recursively merge
      result[key] = mergeObjects(enObj[key], trObj[key] || {});
    } else {
      // If it's a string or array, check if Turkish has a proper translation
      if (trObj[key] && typeof trObj[key] === 'string' && !trObj[key].startsWith('[') && !trObj[key].startsWith('{') && !trObj[key].endsWith('}')) {
        // Use existing Turkish translation
        result[key] = trObj[key];
      } else {
        // Use English default
        result[key] = enObj[key];
      }
    }
  }
  
  return result;
}

// Function to check if a file is already properly translated
function isProperlyTranslated(enObj, trObj) {
  // Check if the file has the same structure
  const enKeys = Object.keys(enObj);
  const trKeys = Object.keys(trObj);
  
  if (enKeys.length !== trKeys.length) {
    return false;
  }
  
  // Check if all values in Turkish file are proper translations (not placeholders)
  function hasPlaceholders(obj) {
    if (typeof obj === 'string') {
      return obj.startsWith('[') && obj.endsWith(']');
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (hasPlaceholders(obj[key])) {
          return true;
        }
      }
    }
    return false;
  }
  
  return !hasPlaceholders(trObj);
}

// Get all JSON files in English directory
const enFiles = fs.readdirSync(enDir).filter(file => file.endsWith('.json'));

console.log(`Found ${enFiles.length} locale files to process...`);

// Process each file
enFiles.forEach(file => {
  const enPath = path.join(enDir, file);
  const trPath = path.join(trDir, file);
  
  // Read English file
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  // Check if Turkish file exists
  if (fs.existsSync(trPath)) {
    const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));
    
    // Check if file is already properly translated
    if (isProperlyTranslated(enData, trData)) {
      console.log(`✓ ${file} is already properly translated. Skipping...`);
      return;
    }
    
    // Merge objects preserving existing translations
    const mergedData = mergeObjects(enData, trData);
    
    // Write merged data to Turkish file
    fs.writeFileSync(trPath, JSON.stringify(mergedData, null, 2) + '\n', 'utf8');
    console.log(`✓ Updated ${file}`);
  } else {
    // If Turkish file doesn't exist, create it with English content
    fs.writeFileSync(trPath, JSON.stringify(enData, null, 2) + '\n', 'utf8');
    console.log(`✓ Created ${file} with English content`);
  }
});

console.log('Locale synchronization completed!');
