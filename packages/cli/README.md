# Figment CLI

Brand-aware AI code generation CLI tool that integrates with AI coding tools through the Model Context Protocol (MCP).

## Installation

Install globally via npm:

```bash
npm install -g @figmentdev/figment
```

## Quick Start

1. Initialize your brand guide:
```bash
figment init
```

2. Check status:
```bash
figment status
```

3. Configure your AI tool (Claude Code, Cursor, etc.):
```bash
figment configure-claude  # For Claude Code
figment configure-gemini  # For Gemini CLI
```

4. Start the MCP server:
```bash
figment serve
```

## Commands

- `figment init` - Initialize your brand guide interactively
- `figment setup --web` - Launch visual brand guide setup (requires web package)
- `figment import <file>` - Import brand guide from markdown file
- `figment status` - Check configuration status
- `figment configure-claude` - Auto-configure Claude Code MCP
- `figment configure-gemini` - Auto-configure Gemini CLI MCP
- `figment serve` - Start the MCP server for AI tools
- `figment css` - Generate CSS custom properties from brand context

## Usage with AI Tools

Once configured, your AI tools will automatically:
- Access your brand colors, typography, and spacing
- Generate components that follow your brand guidelines
- Validate existing code against your brand standards

## Examples

Generate a brand-compliant button:
```
AI: Create a primary button component following our brand guidelines
```

Validate existing code:
```
AI: Check if this CSS follows our brand guidelines: [paste CSS]
```

## Development

This CLI is part of the Figment monorepo. See the main project README for development setup.

## License

MIT