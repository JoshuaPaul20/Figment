# @figmentdev/mcp

Model Context Protocol (MCP) server for Figment brand-aware AI code generation.

## Overview

This package provides an MCP server that connects AI tools (like Claude Desktop, Cursor, etc.) to your Figment brand context. It enables AI to generate code that automatically follows your brand guidelines.

## Features

- 🔌 **MCP Server** - Standards-compliant Model Context Protocol server
- 🎨 **Brand Context Access** - Provides AI tools with your brand colors, typography, spacing
- 🧰 **Tool Integration** - Exposes brand data through MCP tools
- 📐 **Component Generation** - AI-powered component creation with brand consistency
- ✅ **Validation** - Ensures generated code follows brand guidelines

## Installation

```bash
npm install @figmentdev/mcp
```

## Usage

### As MCP Server

The most common usage is through AI tools that support MCP:

#### Claude Desktop Configuration

Add to your Claude Desktop config file:

**Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "figment": {
      "command": "node",
      "args": ["./node_modules/@figmentdev/mcp/dist/index.js"]
    }
  }
}
```

#### Direct Usage

```typescript
import { startMCPServer } from '@figmentdev/mcp';

// Start the MCP server
startMCPServer();
```

## Available Tools

When connected, AI tools gain access to these MCP tools:

- **`get-brand-context`** - Retrieve complete brand configuration
- **`generate-css-variables`** - Generate CSS custom properties  
- **`validate-component`** - Check if code follows brand guidelines
- **`get-component-patterns`** - Get brand-specific component templates

## Example AI Interaction

```
User: "Create a primary button component"

AI: *uses get-brand-context tool*
AI: *generates button with your exact brand colors, fonts, spacing*

<button 
  style={{
    backgroundColor: 'var(--color-primary)',
    fontFamily: 'var(--font-heading)',
    padding: 'var(--spacing-2) var(--spacing-4)'
  }}
>
  Click me
</button>
```

## Requirements

- Node.js 18+
- Figment brand context file (`.figment/brand-context.json`)
- MCP-compatible AI tool

## Integration

This MCP server works with:
- Claude Desktop
- Claude Code  
- Cursor (with MCP extension)
- Any MCP-compatible AI tool

## Development

```bash
# Build the package
npm run build

# Start in development mode
npm run dev

# Run tests
npm run test
```

## License

MIT - see LICENSE file for details.