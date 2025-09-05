import fs from 'fs';
import path from 'path';

interface LocaleAnalysis {
  locale: string;
  totalKeys: number;
  missingKeys: string[];
  extraKeys: string[];
  structure: Record<string, unknown>;
}

export class LocaleAnalyzer {
  private messagesDir: string;
  private baseLocale: string;

  constructor(messagesDir = './messages', baseLocale = 'en') {
    this.messagesDir = messagesDir;
    this.baseLocale = baseLocale;
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

  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj as unknown);
  }

  public analyzeLocale(locale: string): LocaleAnalysis {
    const filePath = path.join(this.messagesDir, `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Locale file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const structure = JSON.parse(content) as Record<string, unknown>;
    const keys = this.getAllKeys(structure);
    
    return {
      locale,
      totalKeys: keys.length,
      missingKeys: [],
      extraKeys: [],
      structure
    };
  }

  public compareWithBase(locale: string): LocaleAnalysis {
    const baseAnalysis = this.analyzeLocale(this.baseLocale);
    const localeAnalysis = this.analyzeLocale(locale);
    
    const baseKeys = this.getAllKeys(baseAnalysis.structure);
    const localeKeys = this.getAllKeys(localeAnalysis.structure);
    
    const missingKeys = baseKeys.filter(key => !localeKeys.includes(key));
    const extraKeys = localeKeys.filter(key => !baseKeys.includes(key));
    
    return {
      ...localeAnalysis,
      missingKeys,
      extraKeys
    };
  }

  public generateReport(): void {
    const locales = ['en', 'zh', 'es', 'ar', 'hi', 'fr', 'tr', 'fa', 'de', 'ja', 'it', 'ru', 'th'];
    const report: Record<string, LocaleAnalysis> = {};
    
    console.log('🔍 Analyzing locale files...\n');
    
    for (const locale of locales) {
      try {
        if (locale === this.baseLocale) {
          report[locale] = this.analyzeLocale(locale);
        } else {
          report[locale] = this.compareWithBase(locale);
        }
      } catch (error) {
        console.error(`❌ Error analyzing ${locale}:`, error);
      }
    }
    
    // Print summary
    console.log('📊 Locale Analysis Summary:\n');
    console.log('Locale\t\tTotal Keys\tMissing\tExtra');
    console.log('------\t\t----------\t-------\t-----');
    
    for (const [locale, analysis] of Object.entries(report)) {
      console.log(
        `${locale.padEnd(12)}\t${analysis.totalKeys.toString().padStart(10)}\t${analysis.missingKeys.length.toString().padStart(7)}\t${analysis.extraKeys.length.toString().padStart(5)}`
      );
    }
    
    // Print detailed missing keys
    console.log('\n🔍 Missing Keys by Locale:\n');
    for (const [locale, analysis] of Object.entries(report)) {
      if (locale !== this.baseLocale && analysis.missingKeys.length > 0) {
        console.log(`\n${locale.toUpperCase()} (${analysis.missingKeys.length} missing):`);
        analysis.missingKeys.slice(0, 10).forEach(key => console.log(`  - ${key}`));
        if (analysis.missingKeys.length > 10) {
          console.log(`  ... and ${analysis.missingKeys.length - 10} more`);
        }
      }
    }
  }
}

// Export for use in other files
export const SUPPORTED_LOCALES = [
  'en',    // English
  'zh',    // Chinese
  'es',    // Spanish
  'ar',    // Arabic
  'hi',    // Hindi
  'fr',    // French
  'tr',    // Turkish
  'fa',    // Farsi/Persian
  'de',    // German
  'ja',    // Japanese
  'it',    // Italian
  'ru',    // Russian
  'th'     // Thai
] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number]; 