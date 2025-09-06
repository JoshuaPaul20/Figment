import type { Colors, Typography, ComponentPatterns } from '@figmentdev/sdk/types';

// A simplified type for the Figma tokens JSON structure
interface FigmaToken {
  value: string | number | Record<string, any>;
  type: string;
}

interface FigmaTokenGroup {
  [key: string]: FigmaToken | FigmaTokenGroup;
}

interface FigmaTokens {
  [key: string]: FigmaTokenGroup;
}

// Helper to resolve aliases in the token values
function resolveAlias(value: string, tokens: FigmaTokens): string {
  if (typeof value !== 'string' || !value.startsWith('{') || !value.endsWith('}')) {
    return value;
  }

  const path = value.slice(1, -1).split('.');
  let current: any = tokens;
  for (const key of path) {
    current = current[key];
    if (current === undefined) {
      return value; // Return original if alias not found
    }
  }

  if (current.value) {
    return resolveAlias(current.value, tokens);
  }

  return value;
}

export function parseFigmaTokens(tokens: FigmaTokens): {
  colors: Colors;
  typography: Typography;
  componentStyles: ComponentPatterns;
} {
  const newColors: Colors = {} as Colors;
  const newTypography: Typography = {
    fontFamily: { heading: '', body: '' },
    fontSize: { base: '16px' },
  } as Typography;

  // --- Map Colors ---
  if (tokens.colors) {
    for (const key in tokens.colors) {
      const token = tokens.colors[key] as FigmaToken;
      if (token.value) {
        const colorValue = resolveAlias(token.value as string, tokens);
        if (key === 'primary') newColors.primary = colorValue;
        if (key === 'secondary') newColors.secondary = colorValue;
        if (key === 'accent') newColors.accent = colorValue;
      }
    }
  }

  // --- Map Typography ---
  if (tokens.typography?.font) {
    const fontFamily = (tokens.typography.font as FigmaTokenGroup).family as FigmaTokenGroup;
    if (fontFamily) {
      if ((fontFamily as Record<string, FigmaToken>).heading) newTypography.fontFamily.heading = resolveAlias(((fontFamily as Record<string, FigmaToken>).heading as FigmaToken).value as string, tokens);
      if ((fontFamily as Record<string, FigmaToken>).base) newTypography.fontFamily.body = resolveAlias(((fontFamily as Record<string, FigmaToken>).base as FigmaToken).value as string, tokens);
    }

    const fontWeight = (tokens.typography.font as FigmaTokenGroup).weight as FigmaTokenGroup;
    if (fontWeight) {
      newTypography.fontWeight = newTypography.fontWeight || {}; // Initialize if undefined
      if (fontWeight.bold) newTypography.fontWeight.bold = parseInt(resolveAlias((fontWeight.bold as FigmaToken).value as string, tokens), 10);
      if (fontWeight.regular) newTypography.fontWeight.normal = parseInt(resolveAlias((fontWeight.regular as FigmaToken).value as string, tokens), 10);
    }
  }

  // For now, we don't map component styles from Figma tokens.
  // This would require a more complex mapping logic.
  const newComponentStyles: ComponentPatterns = {} as ComponentPatterns;

  return {
    colors: newColors,
    typography: newTypography,
    componentStyles: newComponentStyles,
  };
}
