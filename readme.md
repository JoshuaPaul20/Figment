# Figment

Brand-aware AI code generation through Model Context Protocol (MCP). Figment ensures your AI-generated components follow your brand guidelines automatically.

![Figment Logo](https://raw.githubusercontent.com/figmentdev/figment/main/assets/logo.png)

## Quick Start

### Installation

```bash
# Install globally via npm
npm install -g @figmentdev/figment

# Verify installation
figment --version
```

### Alternative Installation Methods

```bash
# Use without installing globally
npx @figmentdev/figment --help

# Install from GitHub
npm install -g https://https://github.com/figmentdev/figment.git
```

### Setup Your Brand Guide

```bash
# Quick setup (3 minutes)
figment init

# Full setup with web interface
figment setup --web

# Import existing brand guide
figment import brand-guide.md
```

## Building and Running

### Entire Project

*   **Build all packages:** `npm run build`
*   **Run all packages in development mode:** `npm run dev`

### Individual Packages

*   **Core Package:**
    *   **Build:** `npm run build -w packages/core`
    *   **Development:** `npm run dev -w packages/core`
*   **CLI Package:**
    *   **Build:** `npm run build -w packages/cli`
    *   **Development:** `npm run dev -w packages/cli`
*   **Web Package:**
    *   **Build:** `npm run build -w packages/web`
    *   **Development:** `npm run dev -w packages/web` (runs on `http://localhost:3456`)

### Running the CLI

After building the CLI, you can run it from the root of the project:

```bash
npm run figment -- [command]
```

For example:

```bash
npm run figment -- init
npm run figment -- status
```

## Integrating with AI Tools (MCP Server)

Figment exposes a Model Context Protocol (MCP) server that AI tools can connect to for brand-aware code generation. To use Figment with your AI tool, you'll typically need to configure your tool to connect to a local MCP server.

First, start the Figment MCP server:

```bash
npm run figment -- serve
```

This command will start the server and keep it running. You'll need to keep this process active while using your AI tool.

### Example: Configuring Gemini CLI

While specific configuration steps may vary depending on your Gemini CLI setup, the general approach involves telling Gemini CLI to connect to a local MCP server. You would typically add a configuration similar to this in your Gemini CLI's settings or a relevant configuration file:

```json
{
  "mcpServers": {
    "figment": {
      "command": "figment",
      "args": ["serve"]
    }
  }
}
```

### Example: Configuring Claude Code

For Claude Code, you would typically add a configuration similar to this in your Claude Code's settings or a relevant configuration file:

```json
{
  "mcpServers": {
    "figment": {
      "command": "figment",
      "args": ["serve"]
    }
  }
}
```

Once configured, your AI tool should be able to:

*   **Access Brand Resources:** Query resources like `figment://brand-guidelines` (for markdown guidelines), `figment://css-variables` (for CSS custom properties), or `figment://brand-context` (for raw JSON brand data).
*   **Utilize Figment Tools:** Call tools exposed by the Figment MCP server, such as `get_brand_colors`, `get_component_pattern`, `validate_design_compliance`, and `generate_component_code` to generate brand-compliant code.

Refer to your AI tool's documentation for precise instructions on configuring external MCP servers and utilizing their exposed resources and tools.

## How It Works

1.  **Define Your Brand** - Set colors, fonts, spacing through interactive setup
2.  **AI Gets Context** - Your brand guidelines are automatically provided to AI tools
3.  **Generate Consistent Code** - Every component follows your brand automatically

## Example Usage

```bash
# Set up your brand colors, fonts, and spacing
figment init

# Generate CSS variables for your project
figment css

# Check your brand configuration
figment status

# Start the MCP server for AI integration
figment serve
```

Your AI coding tools will now generate components like:

```jsx
// Before Figment: Generic styling
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click me
</button>

// After Figment: Your exact brand colors and spacing
<button
  className="px-4 py-2 rounded font-medium transition-colors"
  style={{
    backgroundColor: 'var(--color-primary)',
    fontFamily: 'var(--font-heading)',
    padding: 'var(--spacing-2) var(--spacing-4)'
  }}
>
  Click me
</button>
```

## Features

*   🎨 **Interactive Brand Setup** - Quick CLI wizard or visual web interface
*   🤖 **MCP Integration** - Works with Cursor, Windsurf, and other MCP tools
*   📝 **Import Existing Guides** - Parse markdown, PDF, and Figma design files
*   🎯 **Component Patterns** - Define reusable component styles and patterns
*   🔧 **CSS Generation** - Export CSS custom properties from your brand context
*   ⚡ **Zero Workflow Change** - AI tools automatically get your brand context

## Commands

*   `figment init` - Initialize your brand guide interactively. Use `--quick` for minimal setup.
*   `figment status` - Check your current configuration and MCP integration status.
*   `figment css [--output file]` - Generate CSS custom properties from your brand context.
*   `figment serve` - Start the MCP server (used internally by AI tools).
*   `figment import <file>` - Import from existing brand guides. Supports `.md` (extracts colors and fonts automatically).

## Brand Context Structure

Figment stores your brand information in `.figment/brand-context.json`:

```json
{
  "name": "My Brand",
  "version": "1.0.0",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#64748B",
    "accent": "#10B981"
  },
  "typography": {
    "fontFamily": {
      "heading": "Inter, sans-serif",
      "body": "Inter, sans-serif"
    },
    "fontSize": {
      "base": "16px"
    }
  },
  "spacing": {
    "base": 8,
    "scale": [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]
  },
  "components": {
    "button": {
      "base": "px-4 py-2 rounded font-medium transition-colors",
      "variants": {
        "primary": "bg-primary text-white hover:bg-primary/90",
        "secondary": "bg-secondary text-white hover:bg-secondary/90"
      }
    }
  }
}
```

## MCP Tools

Figment provides these tools to AI agents:

*   `get_brand_colors` - Get your brand colors in various formats
*   `get_component_pattern` - Get CSS classes for component types
*   `validate_design_compliance` - Check if code follows brand guidelines
*   `generate_component_code` - Generate framework-specific components

## Supported AI Tools

Figment works with any MCP-compatible tool:

*   ✅ Gemini CLI
*   ✅ Claude Code
*   ✅ Cursor
*   ✅ Windsurf
*   ✅ Cline
*   ✅ Any tool supporting MCP servers

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/figmentdev/figment.git # Replace with actual repo URL if different
cd figment
npm install
```

### Building

```bash
# Build all packages
npm run build
```

### Running in Development Mode

```bash
# Run all packages in development mode
npm run dev
```

### Testing

```bash
# Run tests
npm test
```