#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LocaleAnalyzer, SUPPORTED_LOCALES } from '../src/utils/locale-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  console.log('🌍 SuperClaude MVP Locale Analysis & Organization\n');
  console.log('=' .repeat(60));
  
  // Initialize analyzer with correct path
  const analyzer = new LocaleAnalyzer(
    path.join(__dirname, '../src/messages'),
    'en'
  );
  
  try {
    // Generate comprehensive report
    analyzer.generateReport();
    
    console.log('\n' + '=' .repeat(60));
    console.log('📋 Organization Recommendations:\n');
    
    // Check for missing locale files
    const missingFiles = SUPPORTED_LOCALES.filter(locale => {
      const filePath = path.join(__dirname, `../src/messages/${locale}.json`);
      return !fs.existsSync(filePath);
    });
    
    if (missingFiles.length > 0) {
      console.log('❌ Missing locale files:');
      missingFiles.forEach(locale => console.log(`  - ${locale}.json`));
    } else {
      console.log('✅ All locale files present');
    }
    
    // Check for consistency in i18n configuration
    console.log('\n🔧 Configuration Consistency:');
    
    const i18nPath = path.join(__dirname, '../src/i18n.ts');
    const routingPath = path.join(__dirname, '../src/i18n/routing.ts');
    
    if (fs.existsSync(i18nPath)) {
      console.log('✅ i18n.ts configuration found');
    } else {
      console.log('❌ i18n.ts configuration missing');
    }
    
    if (fs.existsSync(routingPath)) {
      console.log('✅ routing.ts configuration found');
    } else {
      console.log('❌ routing.ts configuration missing');
    }
    
    console.log('\n📝 Next Steps:');
    console.log('1. Review missing keys in each locale file');
    console.log('2. Add missing translations for incomplete locales');
    console.log('3. Ensure consistent structure across all files');
    console.log('4. Update i18n configuration if needed');
    console.log('5. Test locale switching functionality');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

// Run the analysis
main(); 