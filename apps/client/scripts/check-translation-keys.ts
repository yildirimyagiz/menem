#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TranslationUsage {
  namespace: string;
  keys: string[];
  file: string;
  line: number;
}

interface TranslationKey {
  key: string;
  value: string;
  namespace: string;
}

class TranslationKeyChecker {
  private srcDir: string;
  private messagesDir: string;
  private usedKeys: TranslationUsage[] = [];
  private definedKeys: Map<string, Set<string>> = new Map();

  constructor() {
    this.srcDir = path.join(__dirname, '../src');
    this.messagesDir = path.join(__dirname, '../src/messages');
  }

  private getAllKeys(obj: Record<string, unknown>, prefix = '', namespace = ''): TranslationKey[] {
    const keys: TranslationKey[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        keys.push(...this.getAllKeys(value as Record<string, unknown>, fullKey, namespace));
      } else {
        keys.push({
          key: fullKey,
          value: String(value),
          namespace
        });
      }
    }
    
    return keys;
  }

  private loadTranslationFiles(): void {
    const files = fs.readdirSync(this.messagesDir).filter(file => file.endsWith('.json'));
    
    for (const file of files) {
      const locale = file.replace('.json', '');
      const filePath = path.join(this.messagesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const structure = JSON.parse(content) as Record<string, unknown>;
      
      const keys = this.getAllKeys(structure, '', locale);
      this.definedKeys.set(locale, new Set(keys.map(k => k.key)));
    }
  }

  private extractTranslationKeysFromCode(): void {
    const tsxFiles = glob.sync('**/*.{tsx,ts}', { 
      cwd: this.srcDir,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/scripts/**']
    });

    for (const file of tsxFiles) {
      const filePath = path.join(this.srcDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Find useTranslations usage
      const useTranslationsRegex = /useTranslations\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
      let match;
      
      while ((match = useTranslationsRegex.exec(content)) !== null) {
        const namespace = match[1];
        const line = content.substring(0, match.index).split('\n').length;
        
        // Find t() function calls in the same file
        const tFunctionRegex = new RegExp(`t\\s*\\(\\s*['"\`]([^'"\`]+)['"\`]`, 'g');
        const keys: string[] = [];
        let tMatch;
        
        while ((tMatch = tFunctionRegex.exec(content)) !== null) {
          keys.push(tMatch[1]);
        }
        
        this.usedKeys.push({
          namespace,
          keys,
          file,
          line
        });
      }
    }
  }

  private checkMissingKeys(): void {
    console.log('🔍 Checking for missing translation keys...\n');
    
    const baseLocale = 'en';
    const baseKeys = this.definedKeys.get(baseLocale);
    
    if (!baseKeys) {
      console.error('❌ Base locale (en) not found');
      return;
    }

    // Check for keys used in code but not defined in translations
    const missingKeys: Set<string> = new Set();
    const usedNamespaces = new Set<string>();

    for (const usage of this.usedKeys) {
      usedNamespaces.add(usage.namespace);
      
      for (const key of usage.keys) {
        const fullKey = usage.namespace ? `${usage.namespace}.${key}` : key;
        if (!baseKeys.has(fullKey)) {
          missingKeys.add(fullKey);
        }
      }
    }

    // Check for defined keys that are not used in code
    const unusedKeys: Set<string> = new Set();
    for (const key of baseKeys) {
      let isUsed = false;
      for (const usage of this.usedKeys) {
        const expectedKey = usage.namespace ? `${usage.namespace}.${key}` : key;
        if (expectedKey === key) {
          isUsed = true;
          break;
        }
      }
      if (!isUsed) {
        unusedKeys.add(key);
      }
    }

    // Report results
    console.log('📊 Translation Key Analysis:\n');
    console.log(`Total defined keys in ${baseLocale}: ${baseKeys.size}`);
    console.log(`Total used namespaces: ${usedNamespaces.size}`);
    console.log(`Total used keys: ${this.usedKeys.reduce((sum, u) => sum + u.keys.length, 0)}`);
    console.log(`Missing keys: ${missingKeys.size}`);
    console.log(`Unused keys: ${unusedKeys.size}`);

    if (missingKeys.size > 0) {
      console.log('\n❌ Missing Translation Keys:');
      console.log('=' .repeat(50));
      Array.from(missingKeys).sort().forEach(key => {
        console.log(`  - ${key}`);
      });
    }

    if (unusedKeys.size > 0) {
      console.log('\n⚠️  Potentially Unused Keys:');
      console.log('=' .repeat(50));
      Array.from(unusedKeys).sort().slice(0, 20).forEach(key => {
        console.log(`  - ${key}`);
      });
      if (unusedKeys.size > 20) {
        console.log(`  ... and ${unusedKeys.size - 20} more`);
      }
    }

    // Check other locales for missing keys
    console.log('\n🌍 Locale Completion Status:');
    console.log('=' .repeat(50));
    
    for (const [locale, keys] of this.definedKeys.entries()) {
      if (locale === baseLocale) continue;
      
      const missingInLocale = Array.from(baseKeys).filter(key => !keys.has(key));
      const completionPercentage = ((baseKeys.size - missingInLocale.length) / baseKeys.size) * 100;
      
      console.log(`${locale.padEnd(5)}: ${completionPercentage.toFixed(1).padStart(5)}% complete (${missingInLocale.length} missing)`);
    }
  }

  private generateMissingKeysFile(): void {
    const baseLocale = 'en';
    const baseKeys = this.definedKeys.get(baseLocale);
    
    if (!baseKeys) return;

    const missingKeys: Set<string> = new Set();
    
    for (const usage of this.usedKeys) {
      for (const key of usage.keys) {
        const fullKey = usage.namespace ? `${usage.namespace}.${key}` : key;
        if (!baseKeys.has(fullKey)) {
          missingKeys.add(fullKey);
        }
      }
    }

    if (missingKeys.size > 0) {
      const missingKeysObj: Record<string, string> = {};
      
      for (const key of missingKeys) {
        missingKeysObj[key] = `[TODO: Add translation for "${key}"]`;
      }

      const outputPath = path.join(__dirname, '../src/messages/missing-keys.json');
      fs.writeFileSync(outputPath, JSON.stringify(missingKeysObj, null, 2));
      
      console.log(`\n📝 Missing keys template saved to: ${outputPath}`);
    }
  }

  public run(): void {
    console.log('🔍 SuperClaude Translation Key Checker\n');
    console.log('=' .repeat(60));
    
    try {
      this.loadTranslationFiles();
      this.extractTranslationKeysFromCode();
      this.checkMissingKeys();
      this.generateMissingKeysFile();
      
      console.log('\n✅ Analysis complete!');
      console.log('\n📝 Recommendations:');
      console.log('1. Add missing translation keys to en.json');
      console.log('2. Review unused keys for potential cleanup');
      console.log('3. Update other locale files with missing translations');
      console.log('4. Run this script regularly to maintain consistency');
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      process.exit(1);
    }
  }
}

// Run the checker
const checker = new TranslationKeyChecker();
checker.run(); 