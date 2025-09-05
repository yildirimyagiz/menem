#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TranslationProgress {
  locale: string;
  totalKeys: number;
  translatedKeys: number;
  completionPercentage: number;
  templateFile: string;
  localeFile: string;
}

class TranslationHelper {
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

  private loadLocaleFile(locale: string): Record<string, unknown> {
    const filePath = path.join(this.messagesDir, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
      return {};
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Record<string, unknown>;
  }

  private loadTemplateFile(locale: string): Record<string, unknown> {
    const filePath = path.join(this.messagesDir, `${locale}-template.json`);
    if (!fs.existsSync(filePath)) {
      return {};
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Record<string, unknown>;
  }

  public analyzeTranslationProgress(): TranslationProgress[] {
    console.log('📊 Analyzing translation progress...\n');
    
    const locales = ['ar', 'fa', 'ja', 'zh', 'fr', 'hi', 'it', 'ru', 'th', 'de', 'tr'];
    const progress: TranslationProgress[] = [];
    
    for (const locale of locales) {
      const templateData = this.loadTemplateFile(locale);
      const localeData = this.loadLocaleFile(locale);
      
      const templateKeys = this.getAllKeys(templateData);
      const localeKeys = this.getAllKeys(localeData);
      
      // Count translated keys (keys that exist in locale but not in template)
      const translatedKeys = localeKeys.filter(key => !templateKeys.includes(key)).length;
      const totalKeys = templateKeys.length + translatedKeys;
      const completionPercentage = totalKeys > 0 ? (translatedKeys / totalKeys) * 100 : 0;
      
      progress.push({
        locale,
        totalKeys,
        translatedKeys,
        completionPercentage,
        templateFile: `${locale}-template.json`,
        localeFile: `${locale}.json`
      });
    }
    
    return progress;
  }

  public generateTranslationGuide(): void {
    console.log('📝 Translation Guide for All Locales\n');
    console.log('=' .repeat(80));
    
    const progress = this.analyzeTranslationProgress();
    
    console.log('Translation Progress Summary:');
    console.log('Locale\t\tTotal Keys\tTranslated\tCompletion\tTemplate File');
    console.log('------\t\t----------\t----------\t----------\t-------------');
    
    for (const p of progress) {
      console.log(
        `${p.locale.padEnd(12)}\t${p.totalKeys.toString().padStart(10)}\t${p.translatedKeys.toString().padStart(10)}\t${p.completionPercentage.toFixed(1).padStart(8)}%\t${p.templateFile}`
      );
    }
    
    console.log('\n📋 Translation Workflow:');
    console.log('=' .repeat(80));
    
    console.log('\n1. 📝 Edit Template Files:');
    console.log('   - Open each template file in your editor');
    console.log('   - Replace [TODO: ...] placeholders with actual translations');
    console.log('   - Example: "[TODO: Translate \"Hello\" to ar]" → "مرحبا"');
    
    console.log('\n2. 🔄 Merge Templates:');
    console.log('   pnpm translation-workflow merge <locale>');
    console.log('   Example: pnpm translation-workflow merge ar');
    
    console.log('\n3. ✅ Validate Translations:');
    console.log('   pnpm translation-workflow validate');
    
    console.log('\n4. 📊 Check Progress:');
    console.log('   pnpm translation-workflow');
    
    console.log('\n🎯 Priority Order (by completion percentage):');
    const sortedProgress = progress.sort((a, b) => a.completionPercentage - b.completionPercentage);
    
    for (let i = 0; i < sortedProgress.length; i++) {
      const p = sortedProgress[i];
      console.log(`   ${i + 1}. ${p.locale} (${p.completionPercentage.toFixed(1)}% complete)`);
    }
    
    console.log('\n💡 Tips for Efficient Translation:');
    console.log('   - Use translation services like Google Translate, DeepL, or professional translators');
    console.log('   - Focus on UI elements first (buttons, labels, navigation)');
    console.log('   - Pay attention to context and cultural nuances');
    console.log('   - Test translations in the actual application');
    console.log('   - Consider hiring native speakers for final review');
  }

  public generateTranslationStats(): void {
    console.log('📈 Translation Statistics\n');
    console.log('=' .repeat(60));
    
    const progress = this.analyzeTranslationProgress();
    const totalKeys = progress.reduce((sum, p) => sum + p.totalKeys, 0);
    const totalTranslated = progress.reduce((sum, p) => sum + p.translatedKeys, 0);
    const averageCompletion = progress.reduce((sum, p) => sum + p.completionPercentage, 0) / progress.length;
    
    console.log(`Total Keys to Translate: ${totalKeys.toLocaleString()}`);
    console.log(`Total Keys Translated: ${totalTranslated.toLocaleString()}`);
    console.log(`Average Completion: ${averageCompletion.toFixed(1)}%`);
    console.log(`Remaining Keys: ${(totalKeys - totalTranslated).toLocaleString()}`);
    
    console.log('\n📊 Completion by Locale:');
    console.log('=' .repeat(40));
    
    const sortedProgress = progress.sort((a, b) => b.completionPercentage - a.completionPercentage);
    
    for (const p of sortedProgress) {
      const barLength = 20;
      const filledLength = Math.round((p.completionPercentage / 100) * barLength);
      const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
      
      console.log(`${p.locale.padEnd(5)}: ${bar} ${p.completionPercentage.toFixed(1)}%`);
    }
  }

  public run(): void {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      this.generateTranslationGuide();
      return;
    }
    
    const command = args[0];
    
    switch (command) {
      case 'guide':
        this.generateTranslationGuide();
        break;
      case 'stats':
        this.generateTranslationStats();
        break;
      case 'progress':
        this.analyzeTranslationProgress();
        break;
      default:
        console.log('Usage:');
        console.log('  pnpm translate-templates guide    # Generate translation guide');
        console.log('  pnpm translate-templates stats    # Show translation statistics');
        console.log('  pnpm translate-templates progress # Show progress analysis');
    }
  }
}

// Run the helper
const helper = new TranslationHelper();
helper.run(); 