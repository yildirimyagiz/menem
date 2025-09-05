#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TranslationStats {
  locale: string;
  totalKeys: number;
  missingKeys: string[];
  completionPercentage: number;
}

class TranslationWorkflow {
  private messagesDir: string;
  private baseLocale = 'en';

  constructor() {
    this.messagesDir = path.join(__dirname, '../src/messages');
  }

  private getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    const keys: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        keys.push(...this.getAllKeys(value as Record<string, unknown>, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    
    return keys;
  }

  private getNestedValue(obj: Record<string, unknown>, keyPath: string): unknown {
    return keyPath.split('.').reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }

  private setNestedValue(obj: Record<string, unknown>, keyPath: string, value: unknown): void {
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

  private loadLocaleFile(locale: string): Record<string, unknown> {
    const filePath = path.join(this.messagesDir, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
      return {};
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Record<string, unknown>;
  }

  private saveLocaleFile(locale: string, data: Record<string, unknown>): void {
    const filePath = path.join(this.messagesDir, `${locale}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  public analyzeTranslationStatus(): TranslationStats[] {
    console.log('🔍 Analyzing translation status...\n');
    
    const baseData = this.loadLocaleFile(this.baseLocale);
    const baseKeys = this.getAllKeys(baseData);
    const stats: TranslationStats[] = [];
    
    const locales = ['en', 'zh', 'es', 'ar', 'hi', 'fr', 'tr', 'fa', 'de', 'ja', 'it', 'ru', 'th'];
    
    for (const locale of locales) {
      const data = this.loadLocaleFile(locale);
      const keys = this.getAllKeys(data);
      const missingKeys = baseKeys.filter(key => !keys.includes(key));
      const completionPercentage = ((baseKeys.length - missingKeys.length) / baseKeys.length) * 100;
      
      stats.push({
        locale,
        totalKeys: keys.length,
        missingKeys,
        completionPercentage
      });
    }
    
    return stats;
  }

  public addMissingKeysToBase(): void {
    console.log('📝 Adding missing keys to base locale...\n');
    
    const baseData = this.loadLocaleFile(this.baseLocale);
    const missingKeysFile = path.join(__dirname, '../src/messages/missing-keys.json');
    
    if (!fs.existsSync(missingKeysFile)) {
      console.log('❌ No missing-keys.json file found. Run check-translation-keys first.');
      return;
    }
    
    const missingKeysData = JSON.parse(fs.readFileSync(missingKeysFile, 'utf-8'));
    let addedCount = 0;
    
    for (const [key, value] of Object.entries(missingKeysData)) {
      if (!this.getNestedValue(baseData, key)) {
        this.setNestedValue(baseData, key, value);
        addedCount++;
      }
    }
    
    this.saveLocaleFile(this.baseLocale, baseData);
    console.log(`✅ Added ${addedCount} missing keys to ${this.baseLocale}.json`);
  }

  public generateTranslationTemplate(locale: string): void {
    console.log(`📝 Generating translation template for ${locale}...\n`);
    
    const baseData = this.loadLocaleFile(this.baseLocale);
    const localeData = this.loadLocaleFile(locale);
    const baseKeys = this.getAllKeys(baseData);
    const localeKeys = this.getAllKeys(localeData);
    
    const missingKeys = baseKeys.filter(key => !localeKeys.includes(key));
    
    if (missingKeys.length === 0) {
      console.log(`✅ ${locale} locale is complete!`);
      return;
    }
    
    const template: Record<string, unknown> = {};
    
    for (const key of missingKeys) {
      const baseValue = this.getNestedValue(baseData, key);
      this.setNestedValue(template, key, `[TODO: Translate "${String(baseValue)}" to ${locale}]`);
    }
    
    const templatePath = path.join(__dirname, `../src/messages/${locale}-template.json`);
    fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
    
    console.log(`📝 Template saved to: ${templatePath}`);
    console.log(`Missing keys: ${missingKeys.length}`);
    console.log(`Completion needed: ${(100 - ((baseKeys.length - missingKeys.length) / baseKeys.length) * 100).toFixed(1)}%`);
  }

  public mergeTemplateToLocale(locale: string): void {
    console.log(`🔄 Merging template into ${locale} locale...\n`);
    
    const templatePath = path.join(__dirname, `../src/messages/${locale}-template.json`);
    if (!fs.existsSync(templatePath)) {
      console.log(`❌ No template file found for ${locale}. Generate template first.`);
      return;
    }
    
    const localeData = this.loadLocaleFile(locale);
    const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
    
    // Merge template into locale data
    for (const [key, value] of Object.entries(templateData)) {
      this.setNestedValue(localeData, key, value);
    }
    
    this.saveLocaleFile(locale, localeData);
    console.log(`✅ Template merged into ${locale}.json`);
  }

  public validateTranslations(): void {
    console.log('✅ Validating translations...\n');
    
    const locales = ['zh', 'es', 'ar', 'hi', 'fr', 'tr', 'fa', 'de', 'ja', 'it', 'ru', 'th'];
    const issues: string[] = [];
    
    for (const locale of locales) {
      const data = this.loadLocaleFile(locale);
      const keys = this.getAllKeys(data);
      
      for (const key of keys) {
        const value = this.getNestedValue(data, key);
        if (typeof value === 'string' && value.includes('[TODO:')) {
          issues.push(`${locale}: ${key} - ${value}`);
        }
      }
    }
    
    if (issues.length > 0) {
      console.log('⚠️  Translation issues found:');
      console.log('=' .repeat(50));
      issues.slice(0, 10).forEach(issue => console.log(`  - ${issue}`));
      if (issues.length > 10) {
        console.log(`  ... and ${issues.length - 10} more`);
      }
    } else {
      console.log('✅ No translation issues found!');
    }
  }

  public generateTranslationReport(): void {
    console.log('📊 Generating comprehensive translation report...\n');
    
    const stats = this.analyzeTranslationStatus();
    
    console.log('Translation Completion Status:');
    console.log('=' .repeat(60));
    console.log('Locale\t\tTotal Keys\tMissing\tCompletion');
    console.log('------\t\t----------\t-------\t----------');
    
    for (const stat of stats) {
      console.log(
        `${stat.locale.padEnd(12)}\t${stat.totalKeys.toString().padStart(10)}\t${stat.missingKeys.length.toString().padStart(7)}\t${stat.completionPercentage.toFixed(1).padStart(8)}%`
      );
    }
    
    console.log('\n📝 Priority Actions:');
    console.log('=' .repeat(60));
    
    // Find locales with lowest completion
    const incompleteLocales = stats.filter(s => s.completionPercentage < 100 && s.locale !== 'en');
    incompleteLocales.sort((a, b) => a.completionPercentage - b.completionPercentage);
    
    if (incompleteLocales.length > 0) {
      console.log('🚧 Locales requiring attention (in priority order):');
      incompleteLocales.slice(0, 5).forEach(stat => {
        console.log(`  - ${stat.locale}: ${stat.missingKeys.length} keys missing (${stat.completionPercentage.toFixed(1)}% complete)`);
      });
    } else {
      console.log('✅ All locales are complete!');
    }
    
    console.log('\n🔧 Available Commands:');
    console.log('  pnpm translation-workflow add-missing    # Add missing keys to base');
    console.log('  pnpm translation-workflow template <locale>  # Generate template for locale');
    console.log('  pnpm translation-workflow merge <locale>     # Merge template to locale');
    console.log('  pnpm translation-workflow validate           # Validate translations');
  }

  public run(): void {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      this.generateTranslationReport();
      return;
    }
    
    const command = args[0];
    
    switch (command) {
      case 'add-missing':
        this.addMissingKeysToBase();
        break;
      case 'template':
        if (args[1]) {
          this.generateTranslationTemplate(args[1]);
        } else {
          console.log('❌ Please specify a locale: pnpm translation-workflow template <locale>');
        }
        break;
      case 'merge':
        if (args[1]) {
          this.mergeTemplateToLocale(args[1]);
        } else {
          console.log('❌ Please specify a locale: pnpm translation-workflow merge <locale>');
        }
        break;
      case 'validate':
        this.validateTranslations();
        break;
      case 'report':
        this.generateTranslationReport();
        break;
      default:
        console.log('Usage:');
        console.log('  pnpm translation-workflow                    # Generate report');
        console.log('  pnpm translation-workflow add-missing       # Add missing keys to base');
        console.log('  pnpm translation-workflow template <locale> # Generate template');
        console.log('  pnpm translation-workflow merge <locale>    # Merge template');
        console.log('  pnpm translation-workflow validate          # Validate translations');
        console.log('  pnpm translation-workflow report            # Generate report');
    }
  }
}

// Run the workflow
const workflow = new TranslationWorkflow();
workflow.run(); 