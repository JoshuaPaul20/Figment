# @figmentdev/sdk

Core SDK for brand-aware AI code generation with Figment.

## Overview

The Figment SDK provides brand context management, validation, and CSS generation capabilities. It's the foundation that powers the Figment ecosystem, allowing AI tools to understand and apply your brand guidelines consistently.

## Features

- 🎨 **Brand Context Management** - Load, save, and validate brand configurations
- 📐 **Design Token Support** - Colors, typography, spacing, and component patterns  
- ✅ **Schema Validation** - Ensure brand data integrity with Zod schemas
- 🔧 **CSS Generation** - Generate CSS custom properties from brand context
- 📄 **Markdown Parsing** - Import brand guides from markdown files

## Installation

```bash
npm install @figmentdev/sdk
```

## Usage

### Basic Brand Context

```typescript
import { BrandContextManager } from '@figmentdev/sdk/brand-context';
import type { BrandContext } from '@figmentdev/sdk/types';

const brandManager = new BrandContextManager();

// Create brand context
const brandContext: BrandContext = {
  name: 'My Brand',
  version: '1.0.0',
  colors: {
    primary: '#3B82F6',
    secondary: '#64748B'
  },
  typography: {
    fontFamily: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    fontSize: { base: '16px' }
  },
  spacing: {
    base: 8,
    scale: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64]
  }
};

// Save brand context
await brandManager.saveContext(brandContext);

// Load brand context
const context = await brandManager.loadContext();
```

### Generate CSS Custom Properties

```typescript
const brandManager = new BrandContextManager();
const css = brandManager.generateCSSCustomProperties();

console.log(css);
// Output:
// :root {
//   --color-primary: #3B82F6;
//   --color-secondary: #64748B;
//   --font-heading: 'Inter', sans-serif;
//   --font-body: 'Inter', sans-serif;
//   --spacing-1: 8px;
//   --spacing-2: 16px;
//   /* ... */
// }
```

## API Reference

### BrandContextManager

- `loadContext()` - Load brand context from file system
- `saveContext(context)` - Save brand context to file system  
- `generateCSSCustomProperties()` - Generate CSS custom properties
- `parseBrandGuideMarkdown(filePath)` - Parse brand guide from markdown

### Types

- `BrandContext` - Main brand configuration interface
- `Colors` - Color palette definition
- `Typography` - Font and text styling configuration
- `ComponentPatterns` - UI component style definitions

## Integration

This SDK is used by:
- `@figmentdev/mcp` - MCP server for AI integration
- `@figmentdev/cli` - Command-line interface
- `@figmentdev/figment-web` - Visual brand editor

## License

MIT - see LICENSE file for details.