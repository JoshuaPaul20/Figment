import { z } from 'zod';

// Brand context schema
export const ColorSchema = z.object({
  primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional(),
  success: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional(),
  warning: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional(),
  error: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional(),
  neutral: z.object({
    50: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    100: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    200: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    300: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    400: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    500: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    600: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    700: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    800: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    900: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  }).optional()
});

export const TypographySchema = z.object({
  fontFamily: z.object({
    heading: z.string(),
    body: z.string(),
    mono: z.string().optional()
  }),
  fontSize: z.object({
    xs: z.string().optional(),
    sm: z.string().optional(),
    base: z.string(),
    lg: z.string().optional(),
    xl: z.string().optional(),
    '2xl': z.string().optional(),
    '3xl': z.string().optional(),
    '4xl': z.string().optional(),
  }),
  fontWeight: z.object({
    normal: z.number().optional(),
    medium: z.number().optional(),
    semibold: z.number().optional(),
    bold: z.number().optional(),
  }).optional(),
  lineHeight: z.object({
    tight: z.number().optional(),
    normal: z.number().optional(),
    relaxed: z.number().optional(),
  }).optional()
});

export const SpacingSchema = z.object({
  base: z.number().default(8),
  scale: z.array(z.number()).default([4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96])
});

export const ComponentPatternSchema = z.object({
  button: z.object({
    base: z.object({
      padding: z.string().optional(),
      borderRadius: z.string().optional(),
      fontWeight: z.string().optional(),
      transition: z.string().optional(),
    }).optional(),
    variants: z.object({
      primary: z.object({
        backgroundColor: z.string().optional(),
        textColor: z.string().optional(),
        hoverBackgroundColor: z.string().optional(),
      }).optional(),
      secondary: z.object({
        backgroundColor: z.string().optional(),
        textColor: z.string().optional(),
        hoverBackgroundColor: z.string().optional(),
      }).optional(),
      outline: z.object({
        borderColor: z.string().optional(),
        textColor: z.string().optional(),
        hoverBackgroundColor: z.string().optional(),
      }).optional(),
      ghost: z.object({
        textColor: z.string().optional(),
        hoverBackgroundColor: z.string().optional(),
      }).optional(),
    }).optional(),
  }).optional(),
  input: z.object({
    base: z.object({
      padding: z.string().optional(),
      borderRadius: z.string().optional(),
      border: z.string().optional(),
    }).optional(),
    states: z.object({
      default: z.object({
        borderColor: z.string().optional(),
        backgroundColor: z.string().optional(),
      }).optional(),
      focus: z.object({
        borderColor: z.string().optional(),
        boxShadow: z.string().optional(),
      }).optional(),
      error: z.object({
        borderColor: z.string().optional(),
        textColor: z.string().optional(),
      }).optional(),
    }).optional(),
  }).optional(),
  card: z.object({
    base: z.object({
      padding: z.string().optional(),
      borderRadius: z.string().optional(),
      backgroundColor: z.string().optional(),
      boxShadow: z.string().optional(),
    }).optional(),
    variants: z.object({
      default: z.object({
        border: z.string().optional(),
      }).optional(),
      elevated: z.object({
        boxShadow: z.string().optional(),
      }).optional(),
    }).optional(),
  }).optional(),
});

export const BrandContextSchema = z.object({
  name: z.string(),
  version: z.string().default('1.0.0'),
  colors: ColorSchema,
  typography: TypographySchema,
  spacing: SpacingSchema,
  components: ComponentPatternSchema.optional(),
  customCSS: z.string().optional(),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    author: z.string().optional()
  }).optional()
});

// Type exports
export type BrandContext = z.infer<typeof BrandContextSchema>;
export type Colors = z.infer<typeof ColorSchema>;
export type Typography = z.infer<typeof TypographySchema>;
export type Spacing = z.infer<typeof SpacingSchema>;
export type ComponentPatterns = z.infer<typeof ComponentPatternSchema>;

export const InputStatesSchema = z.object({
  default: z.object({
    borderColor: z.string().optional(),
    backgroundColor: z.string().optional(),
  }).optional(),
  focus: z.object({
    borderColor: z.string().optional(),
    boxShadow: z.string().optional(),
  }).optional(),
  error: z.object({
    borderColor: z.string().optional(),
    textColor: z.string().optional(),
  }).optional(),
});

export type InputStates = z.infer<typeof InputStatesSchema>;

export const CardVariantsSchema = z.object({
  default: z.object({
    border: z.string().optional(),
  }).optional(),
  elevated: z.object({
    boxShadow: z.string().optional(),
  }).optional(),
});

export type CardVariants = z.infer<typeof CardVariantsSchema>;


// MCP tool definitions
export interface FigmentTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// Configuration file schema
export const FigmentConfigSchema = z.object({
  configVersion: z.string().default('1.0.0'),
  server: z.object({
    port: z.number().default(3000),
    host: z.string().default('localhost'),
  }),
  brandContext: BrandContextSchema.optional(),
  paths: z.object({
    brandGuide: z.string().optional(),
    outputDir: z.string().default('.figment')
  }).optional()
});

export type FigmentConfig = z.infer<typeof FigmentConfigSchema>;