#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUPPORTED_LOCALES } from '../src/utils/locale-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface LocaleStats {
  locale: string;
  totalKeys: number;
  missingKeys: string[];
  extraKeys: string[];
  completionPercentage: number;
}

function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

function getNestedValue(obj: Record<string, unknown>, keyPath: string): unknown {
  return keyPath.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function setNestedValue(obj: Record<string, unknown>, keyPath: string, value: unknown): void {
  const keys = keyPath.split('.');
  const lastKey = keys.pop();
  if (!lastKey) return;
  
  const target = keys.reduce((current, key) => {
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    return current[key] as Record<string, unknown>;
  }, obj);
  target[lastKey] = value;
}

function analyzeLocaleFile(locale: string, baseStructure: Record<string, unknown>): LocaleStats {
  const filePath = path.join(__dirname, `../src/messages/${locale}.json`);
  
  if (!fs.existsSync(filePath)) {
    return {
      locale,
      totalKeys: 0,
      missingKeys: getAllKeys(baseStructure),
      extraKeys: [],
      completionPercentage: 0
    };
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const structure = JSON.parse(content) as Record<string, unknown>;
  
  const baseKeys = getAllKeys(baseStructure);
  const localeKeys = getAllKeys(structure);
  
  const missingKeys = baseKeys.filter(key => !localeKeys.includes(key));
  const extraKeys = localeKeys.filter(key => !baseKeys.includes(key));
  
  const completionPercentage = ((baseKeys.length - missingKeys.length) / baseKeys.length) * 100;
  
  return {
    locale,
    totalKeys: localeKeys.length,
    missingKeys,
    extraKeys,
    completionPercentage
  };
}

function generateMissingKeysReport(): void {
  console.log('🔍 SuperClaude MVP Locale Organization Report\n');
  console.log('=' .repeat(80));
  
  // Load base locale (English)
  const basePath = path.join(__dirname, '../src/messages/en.json');
  const baseContent = fs.readFileSync(basePath, 'utf-8');
  const baseStructure = JSON.parse(baseContent) as Record<string, unknown>;
  
  const baseKeys = getAllKeys(baseStructure);
  console.log(`📊 Base locale (en) has ${baseKeys.length} total keys\n`);
  
  // Analyze all locales
  const stats: LocaleStats[] = [];
  
  for (const locale of SUPPORTED_LOCALES) {
    const stat = analyzeLocaleFile(locale, baseStructure);
    stats.push(stat);
  }
  
  // Sort by completion percentage
  stats.sort((a, b) => b.completionPercentage - a.completionPercentage);
  
  // Print summary table
  console.log('📋 Locale Completion Summary:\n');
  console.log('Locale\t\tTotal Keys\tMissing\tExtra\tCompletion');
  console.log('------\t\t----------\t-------\t-----\t----------');
  
  for (const stat of stats) {
    console.log(
      `${stat.locale.padEnd(12)}\t${stat.totalKeys.toString().padStart(10)}\t${stat.missingKeys.length.toString().padStart(7)}\t${stat.extraKeys.length.toString().padStart(5)}\t${stat.completionPercentage.toFixed(1).padStart(8)}%`
    );
  }
  
  // Print detailed missing keys for incomplete locales
  console.log('\n🔍 Missing Keys by Locale:\n');
  
  for (const stat of stats) {
    if (stat.missingKeys.length > 0) {
      console.log(`\n${stat.locale.toUpperCase()} (${stat.missingKeys.length} missing, ${stat.completionPercentage.toFixed(1)}% complete):`);
      
      // Group missing keys by category
      const groupedKeys: Record<string, string[]> = {};
      
      for (const key of stat.missingKeys) {
        const category = key.split('.')[0];
        groupedKeys[category] ??= [];
        groupedKeys[category].push(key);
      }
      
      for (const [category, keys] of Object.entries(groupedKeys)) {
        console.log(`  ${category}:`);
        keys.slice(0, 5).forEach(key => {
          const value = getNestedValue(baseStructure, key);
          console.log(`    - ${key}: "${String(value)}"`);
        });
        if (keys.length > 5) {
          console.log(`    ... and ${keys.length - 5} more`);
        }
      }
    }
  }
  
  // Generate action plan
  console.log('\n📝 Action Plan:\n');
  
  const incompleteLocales = stats.filter(s => s.completionPercentage < 100);
  
  if (incompleteLocales.length === 0) {
    console.log('✅ All locales are complete!');
  } else {
    console.log('🚧 Locales requiring attention:');
    incompleteLocales.forEach(stat => {
      console.log(`  - ${stat.locale}: ${stat.missingKeys.length} keys missing`);
    });
    
    console.log('\n🔧 Recommended actions:');
    console.log('1. Prioritize locales with lowest completion percentage');
    console.log('2. Focus on common UI elements first (nav, common, ui)');
    console.log('3. Use translation services for missing keys');
    console.log('4. Review and approve translations before deployment');
    console.log('5. Test locale switching functionality');
  }
}

function generateLocaleTemplate(locale: string): void {
  const basePath = path.join(__dirname, '../src/messages/en.json');
  const baseContent = fs.readFileSync(basePath, 'utf-8');
  const baseStructure = JSON.parse(baseContent) as Record<string, unknown>;
  
  const stat = analyzeLocaleFile(locale, baseStructure);
  
  if (stat.missingKeys.length === 0) {
    console.log(`✅ ${locale} locale is complete!`);
    return;
  }
  
  console.log(`\n📝 Template for missing keys in ${locale}:`);
  console.log('=' .repeat(60));
  
  // Create template with missing keys
  const template: Record<string, unknown> = {};
  
  for (const key of stat.missingKeys) {
    const value = getNestedValue(baseStructure, key);
    setNestedValue(template, key, `[TODO: Translate "${String(value)}" to ${locale}]`);
  }
  
  const templatePath = path.join(__dirname, `../src/messages/${locale}-template.json`);
  fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
  
  console.log(`Template saved to: ${templatePath}`);
  console.log(`Missing keys: ${stat.missingKeys.length}`);
  console.log(`Completion needed: ${(100 - stat.completionPercentage).toFixed(1)}%`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    generateMissingKeysReport();
  } else if (args[0] === 'template' && args[1]) {
    const locale = args[1];
    if (SUPPORTED_LOCALES.includes(locale as typeof SUPPORTED_LOCALES[number])) {
      generateLocaleTemplate(locale);
    } else {
      console.error(`❌ Invalid locale: ${locale}`);
      console.log(`Supported locales: ${SUPPORTED_LOCALES.join(', ')}`);
    }
  } else {
    console.log('Usage:');
    console.log('  npm run analyze-locales          # Generate full report');
    console.log('  npm run analyze-locales template <locale>  # Generate template for locale');
  }
}

main(); 