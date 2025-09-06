import { BrandContext, BrandContextSchema, Colors, Typography } from './types.js';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export class BrandContextError extends Error {
  constructor(message: string, public override cause?: Error) {
    super(message);
    this.name = 'BrandContextError';
  }
}

export class BrandContextManager {
  private context: BrandContext | null = null;
  private configPath: string;

  constructor(configPath: string = '.figment/brand-context.json') {
    this.configPath = configPath;
  }

  /**
   * Load brand context from file system
   */
  async loadContext(): Promise<BrandContext | null> {
    try {
      const configExists = await this.fileExists(this.configPath);
      if (!configExists) {
        return null;
      }

      const content = await fs.readFile(this.configPath, 'utf-8');
      const rawContext = JSON.parse(content) as Record<string, unknown>;
      
      // Validate using Zod schema
      const validatedContext = BrandContextSchema.parse(rawContext);
      this.context = validatedContext;
      
      return this.context;
    } catch (error: unknown) {
      console.error('Failed to load brand context:', error);
      return null;
    }
  }

  /**
   * Save brand context to file system
   */
  async saveContext(context: BrandContext): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.configPath);
      await fs.mkdir(dir, { recursive: true });

      // Validate before saving
      const validatedContext = BrandContextSchema.parse(context);
      
      // Add metadata
      validatedContext.metadata = {
        ...validatedContext.metadata,
        updatedAt: new Date().toISOString(),
        createdAt: validatedContext.metadata?.createdAt || new Date().toISOString(),
      };

      await fs.writeFile(this.configPath, JSON.stringify(validatedContext, null, 2));
      this.context = validatedContext;
    } catch (error: unknown) {
      throw new BrandContextError(`Failed to save brand context: ${(error as Error).message}`, error as Error);
    }
  }

  /**
   * Get current brand context
   */
  getContext(): BrandContext | null {
    return this.context;
  }

  /**
   * Parse brand guide from markdown file
   */
  async parseBrandGuideMarkdown(filePath: string): Promise<Partial<BrandContext>> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: body } = matter(content) as { data: Record<string, unknown>; content: string };
      
      // Extract colors from markdown content
      const colors = this.extractColorsFromContent(body);
      const typography = this.extractTypographyFromContent(body);
      
      return {
        name: data.name as string || path.basename(filePath, '.md'),
        colors: this.buildColorObject(colors),
        typography: this.buildTypographyObject(typography),
      } as Partial<BrandContext>;
    } catch (error: unknown) {
      throw new BrandContextError(`Failed to parse brand guide: ${(error as Error).message}`, error as Error);
    }
  }

  /**
   * Generate CSS custom properties from brand context
   */
  generateCSSCustomProperties(): string {
    if (!this.context) {
      return '';
    }

    const css: string[] = [':root {'];
    
    // Colors
    if (this.context.colors) {
      css.push('  /* Brand Colors */');
      css.push(`  --color-primary: ${this.context.colors.primary};`);
      css.push(`  --color-secondary: ${this.context.colors.secondary};`);
      
      if (this.context.colors.accent) {
        css.push(`  --color-accent: ${this.context.colors.accent};`);
      }
      
      // Semantic colors
      if (this.context.colors.success) css.push(`  --color-success: ${this.context.colors.success};`);
      if (this.context.colors.warning) css.push(`  --color-warning: ${this.context.colors.warning};`);
      if (this.context.colors.error) css.push(`  --color-error: ${this.context.colors.error};`);
      
      // Neutral colors
      if (this.context.colors.neutral) {
        css.push('  /* Neutral Colors */');
        Object.entries(this.context.colors.neutral).forEach(([key, value]) => {
          if (value) css.push(`  --color-neutral-${key}: ${value};`);
        });
      }
    }

    // Typography
    if (this.context.typography) {
      css.push('  /* Typography */');
      css.push(`  --font-heading: ${this.context.typography.fontFamily.heading};`);
      css.push(`  --font-body: ${this.context.typography.fontFamily.body};`);
      if (this.context.typography.fontFamily.mono) {
        css.push(`  --font-mono: ${this.context.typography.fontFamily.mono};`);
      }
      
      // Font sizes
      Object.entries(this.context.typography.fontSize).forEach(([key, value]) => {
        css.push(`  --font-size-${key}: ${value};`);
      });
    }

    // Spacing
    if (this.context.spacing) {
      css.push('  /* Spacing */');
      css.push(`  --spacing-base: ${this.context.spacing.base}px;`);
      this.context.spacing.scale.forEach((value, index) => {
        css.push(`  --spacing-${index}: ${value}px;`);
      });
    }

    css.push('}');
    return css.join('\n');
  }

  /**
   * Generate component guidelines text for AI context
   */
  generateComponentGuidelines(): string {
    if (!this.context) {
      return 'No brand context available.';
    }

    const guidelines: string[] = [
      '# Brand Guidelines for Code Generation',
      '',
      `Brand: ${this.context.name}`,
      `Version: ${this.context.version}`,
      '',
    ];

    // Colors section
    if (this.context.colors) {
      guidelines.push('## Colors');
      guidelines.push(`Primary: ${this.context.colors.primary}`);
      guidelines.push(`Secondary: ${this.context.colors.secondary}`);
      
      if (this.context.colors.accent) {
        guidelines.push(`Accent: ${this.context.colors.accent}`);
      }
      
      guidelines.push('');
      guidelines.push('Use these colors for:');
      guidelines.push('- Primary: Main CTAs, links, focus states');
      guidelines.push('- Secondary: Supporting elements, borders');
      if (this.context.colors.accent) {
        guidelines.push('- Accent: Highlights, badges, notifications');
      }
      guidelines.push('');
    }

    // Typography section
    if (this.context.typography) {
      guidelines.push('## Typography');
      guidelines.push(`Headings: ${this.context.typography.fontFamily.heading}`);
      guidelines.push(`Body text: ${this.context.typography.fontFamily.body}`);
      if (this.context.typography.fontFamily.mono) {
        guidelines.push(`Code/mono: ${this.context.typography.fontFamily.mono}`);
      }
      guidelines.push('');
    }

    // Component patterns
    if (this.context.components) {
      guidelines.push('## Component Patterns');
      
      if (this.context.components.button) {
        guidelines.push('### Buttons');
        if (this.context.components.button.base) {
          guidelines.push(
            `Base: ${Object.entries(this.context.components.button.base)
              .map(([k, v]) => `${k}: ${v}`) 
              .join(', ')}`
          );
        }
        if (this.context.components.button.variants?.primary) {
          guidelines.push(
            `Primary: ${Object.entries(this.context.components.button.variants.primary)
              .map(([k, v]) => `${k}: ${v}`) 
              .join(', ')}`
          );
        }
        if (this.context.components.button.variants?.secondary) {
          guidelines.push(
            `Secondary: ${Object.entries(
              this.context.components.button.variants.secondary
            )
              .map(([k, v]) => `${k}: ${v}`) 
              .join(', ')}`
          );
        }
        guidelines.push('');
      }
      
      if (this.context.components.input) {
        guidelines.push('### Form Inputs');
        if (this.context.components.input.base) {
          guidelines.push(
            `Base: ${Object.entries(this.context.components.input.base)
              .map(([k, v]) => `${k}: ${v}`) 
              .join(', ')}`
          );
        }
        if (this.context.components.input.states?.default) {
          guidelines.push(
            `Default: ${Object.entries(this.context.components.input.states.default)
              .map(([k, v]) => `${k}: ${v}`) 
              .join(', ')}`
          );
        }
        if (this.context.components.input.states?.focus) {
          guidelines.push(
            `Focus: ${Object.entries(this.context.components.input.states.focus)
              .map(([k, v]) => `${k}: ${v}`) 
              .join(', ')}`
          );
        }
        guidelines.push('');
      }
    }

    guidelines.push('## Instructions for AI');
    guidelines.push('When generating code:');
    guidelines.push('1. Always use the specified brand colors');
    guidelines.push('2. Apply the correct typography for headings and body text');
    guidelines.push('3. Follow component patterns when creating UI elements');
    guidelines.push('4. Maintain consistent spacing using the defined scale');
    guidelines.push('5. Ensure accessibility standards are met');

    return guidelines.join('\n');
  }

  // Private helper methods
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private extractColorsFromContent(content: string): string[] {
    const hexColorRegex = /#[0-9A-Fa-f]{6}/g;
    return content.match(hexColorRegex) || [];
  }

  private extractTypographyFromContent(content: string): { fonts: string[] } | null {
    const fontRegex = /font[- ]?family[:\s]+([^;\n,]+)/gi;
    const matches = content.match(fontRegex);
    
    if (matches && matches.length > 0) {
      const fonts = matches.map(match => 
        match.replace(/font[- ]?family[:\s]+/i, '').trim()
      );
      return { fonts: [...new Set(fonts)] };
    }
    
    return null;
  }

  /**
   * Builds a color object from an array of hex color strings.
   * Note: This uses a simple heuristic and may not be robust for all cases.
   */
  private buildColorObject(colors: string[]): Colors | undefined {
    if (colors.length === 0) {
      return undefined;
    }

    const primary = colors[0];
    const secondary = colors.length > 1 ? colors[1] : primary;
    const accent = colors.length > 2 ? colors[2] : undefined;

    return {
      primary: primary || '',
      secondary: secondary || '',
      accent: accent,
    };
  }

  /**
   * Builds a typography object from an array of font family names.
   * Note: This uses a simple heuristic and may not be robust for all cases.
   */
  private buildTypographyObject(typography: { fonts: string[] } | null): Typography | undefined {
    if (!typography || typography.fonts.length === 0) {
      return undefined;
    }

    const heading = typography.fonts[0];
    const body = typography.fonts.length > 1 ? typography.fonts[1] : heading;
    const mono = typography.fonts.length > 2 ? typography.fonts[2] : undefined;

    return {
      fontFamily: {
        heading: heading || '',
        body: body || '',
        mono: mono,
      },
      fontSize: {
        base: '16px',
      },
    };
  }
}
