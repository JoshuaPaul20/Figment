# Figment: Brand-Aware AI Code Generation

Figment is a powerful tool that ensures your AI-generated code components automatically adhere to your brand's unique guidelines. Say goodbye to inconsistent designs and hello to perfectly branded code, every time.

<div align="center">
  <img src="https://raw.githubusercontent.com/JoshuaPaul20/Figment/main/Figment.png" alt="Figment Logo" style="margin-bottom: 20px;" />
</div>

## ✨ Features

*   🎨 **Interactive Brand Setup** - Define your brand's colors, typography, and spacing through an intuitive CLI wizard or a visual web interface.
*   🤖 **MCP Integration** - Seamlessly integrates with Model Context Protocol (MCP) compatible AI tools like Gemini CLI, Claude Code, Cursor, and Windsurf.
*   📝 **Import Existing Guides** - Easily import brand guidelines from markdown files, PDFs, or even Figma design tokens.
*   🎯 **Component Patterns** - Define and manage reusable component styles and patterns that your AI can leverage for consistent UI elements.
*   🔧 **CSS Generation** - Automatically generate CSS custom properties (CSS variables) directly from your defined brand context.
*   ⚡ **Zero Workflow Change** - Figment works in the background, providing your AI tools with real-time brand context without interrupting your existing development workflow.

## 🚀 Quick Start

Get started with Figment in minutes!

### Installation

Install Figment globally via npm:

```bash
npm install -g @figmentdev/figment
```

Verify your installation:

```bash
figment --version
```

### Setup Your Brand Guide

Use the quick setup wizard to define your core brand elements:

```bash
figment init
```

For a more visual and comprehensive setup, launch the web interface:

```bash
figment setup --web
```

## 💡 How It Works

Figment acts as a bridge between your brand guidelines and your AI coding assistant.

1.  **Define Your Brand:** You set up your brand's colors, fonts, spacing, and component patterns using Figment's CLI or web interface.
2.  **AI Gets Context:** Figment exposes a Model Context Protocol (MCP) server that your AI tools connect to. This server provides real-time access to your brand guidelines.
3.  **Generate Consistent Code:** When your AI generates code, it queries Figment's MCP server for your brand context, ensuring every component it creates is perfectly on-brand.

## 💻 Usage Examples

Here are a few common ways to use Figment:

```bash
# Set up your brand colors, fonts, and spacing interactively
figment init

# Generate CSS variables based on your brand guide
figment css --output ./src/styles/brand-variables.css

# Check the current status of your Figment configuration and MCP server
figment status

# Start the MCP server for AI integration (keep this running in the background)
figment serve
```

Your AI coding tools will now generate components like this:

```jsx
// Before Figment: Generic styling
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click me
</button>

// After Figment: Your exact brand colors and spacing, automatically applied
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

## 🔌 Integrating with AI Tools (MCP Server)

Figment exposes a Model Context Protocol (MCP) server that AI tools can connect to for brand-aware code generation. To use Figment with your AI tool, you'll typically need to configure your tool to connect to a local MCP server.

First, start the Figment MCP server:

```bash
npm run figment -- serve
```

This command will start the server and keep it running. You'll need to keep this process active while using your AI tool.

### Configuration Examples

While specific configuration steps may vary depending on your AI tool setup, the general approach involves telling your AI tool to connect to a local MCP server.

#### Gemini CLI

You would typically add a configuration similar to this in your Gemini CLI's settings or a relevant configuration file:

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

#### Claude Code

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

## 🛠️ Commands

A comprehensive list of Figment CLI commands:

*   `figment init` - Initialize your brand guide interactively. Use `--quick` for minimal setup.
*   `figment status` - Check your current configuration and MCP integration status.
*   `figment css [--output file]` - Generate CSS custom properties from your brand context.
*   `figment serve` - Start the MCP server (used internally by AI tools).
*   `figment import <file>` - Import from existing brand guides. Supports `.md` (extracts colors and fonts automatically).

## 🤝 Supported AI Tools

Figment is designed to work with any MCP-compatible AI coding tool:

*   ✅ Gemini CLI
*   ✅ Claude Code
*   ✅ Cursor
*   ✅ Windsurf
*   ✅ Cline
*   ✅ Any tool supporting MCP servers

## 🧑‍💻 Development

### Setup

To set up the development environment:

```bash
# Clone the repository
git clone https://github.com/JoshuaPaul20/Figment.git
cd Figment
npm install
```

### Building

Build all packages in the monorepo:

```bash
npm run build
```

### Running in Development Mode

Run all packages in development mode (CLI, Core MCP Server, and Web UI):

```bash
npm run dev
```

### Testing

Run unit and end-to-end tests:

```bash
npm test
```


